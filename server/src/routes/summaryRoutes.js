import express from "express";
import { auth } from "../middleware/auth.js";
import { Transaction } from "../models/Transaction.js";
import { MonthlySummary } from "../models/MonthlySummary.js";
import { getSpendingAnalysis } from "../utils/aiClient.js";

const router = express.Router();

// Generate or refresh AI summary for a given month
router.post("/monthly", auth, async (req, res) => {
    try {
        const { month, year } = req.body;
        if (!month || !year) {
            return res.status(400).json({ message: "month & year required" });
        }

        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0, 23, 59, 59);

        const transactions = await Transaction.find({
            user: req.user._id,
            date: { $gte: start, $lte: end },
        });

        if (!transactions.length) {
            return res
                .status(400)
                .json({ message: "No transactions for this period" });
        }

        // Ask Gemini for analysis
        const aiAnalysis = await getSpendingAnalysis(transactions);

        let summary = await MonthlySummary.findOne({
            user: req.user._id,
            month,
            year,
        });

        if (summary) {
            summary.summaryText = aiAnalysis.summaryText;
            summary.topCategories = aiAnalysis.topCategories || [];
            summary.cutSuggestions = aiAnalysis.cutSuggestions || "";
            summary.savingGoal = aiAnalysis.savingGoal || 0;
            await summary.save();
        } else {
            summary = await MonthlySummary.create({
                user: req.user._id,
                month,
                year,
                summaryText: aiAnalysis.summaryText,
                topCategories: aiAnalysis.topCategories || [],
                cutSuggestions: aiAnalysis.cutSuggestions || "",
                savingGoal: aiAnalysis.savingGoal || 0,
            });
        }

        res.json(summary);
    } catch (err) {
        console.error("Error in /summaries/monthly:", err.message);
        res.status(500).json({ message: "AI analysis failed" });
    }
});

// History of all stored monthly summaries for the user
router.get("/history", auth, async (req, res) => {
    try {
        const summaries = await MonthlySummary.find({
            user: req.user._id,
        }).sort({ year: -1, month: -1 });

        res.json(summaries);
    } catch (err) {
        console.error("Error in /summaries/history:", err.message);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
