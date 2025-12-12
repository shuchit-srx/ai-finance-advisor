// src/routes/chatRoutes.js
import express from "express";
import { auth } from "../middleware/auth.js";
import { Transaction } from "../models/Transaction.js";
import { getSpendingAnalysis } from "../utils/aiClient.js"; // Ensure this path matches your file structure

const router = express.Router();

router.post("/query", auth, async (req, res) => {
    try {
        const { message = "", includeContext = true } = req.body;
        const trimmedMessage = (message || "").trim();

        if (!trimmedMessage) {
            return res.status(400).json({ message: "Empty message" });
        }

        // 1. Fetch Context (Transactions)
        // Instead of trying to guess the date range manually, we fetch the last 150 transactions.
        // The AI is smart enough to filter "last week" vs "today" from the JSON dates.
        let transactions = [];
        if (includeContext) {
            transactions = await Transaction.find({ user: req.user._id })
                .sort({ date: -1 }) // Newest first
                .limit(150)         // Give AI enough context (approx 1-2 months for most users)
                .lean();

            // Reverse so AI reads chronological order (optional, but sometimes helps logic)
            transactions = transactions.reverse();
        }

        // 2. Call AI with the specific User Query
        const analysis = await getSpendingAnalysis(transactions, trimmedMessage);

        // 3. Format the Reply for the Frontend
        // We combine the direct answer (summaryText) with the extra insights.
        const combinedReply = `
${analysis.summaryText}

${analysis.cutSuggestions ? "💡 Tip: " + analysis.cutSuggestions : ""}
        `.trim();

        return res.json({
            reply: combinedReply,
            // You can optionally send these separately if your UI supports widgets
            meta: {
                topCategories: analysis.topCategories,
                savingGoal: analysis.savingGoal
            }
        });

    } catch (err) {
        console.error("POST /chat/query error:", err);
        return res.status(500).json({ message: "Server encountered an error processing your chat." });
    }
});

export default router;