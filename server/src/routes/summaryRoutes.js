import express from "express";
import { auth } from "../middleware/auth.js";
import { Transaction } from "../models/Transaction.js";
import { MonthlySummary } from "../models/MonthlySummary.js";

const router = express.Router();

const buildFallbackSummary = (transactions, month, year) => {
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);

    const byCategory = {};
    for (const t of transactions) {
        const cat = t.category || "others";
        byCategory[cat] = (byCategory[cat] || 0) + t.amount;
    }

    const sortedCats = Object.entries(byCategory).sort(
        (a, b) => b[1] - a[1]
    );
    const topCategories = sortedCats.slice(0, 3).map(([cat]) => cat);

    const summaryText =
        transactions.length === 0
            ? `No transactions recorded yet for ${month}/${year}.`
            : `For ${month}/${year}, your total recorded spending is ₹${total.toFixed(
                2
            )}. Your top spending categories are ${topCategories.join(
                ", "
            )}. Keeping these under control will have the biggest impact.`;

    const cutSuggestions =
        sortedCats.length === 0
            ? "Once you add more transactions, we’ll highlight categories where you can reduce or optimize spending."
            : `Start by trimming non-essential expenses in ${topCategories[0] || "your largest category"
            }. Set simple weekly caps for food, shopping and transport to avoid end-of-month spikes.`;

    const savingGoal = total > 0 ? Math.round(total * 0.15) : 0;

    return {
        summaryText,
        cutSuggestions,
        topCategories,
        savingGoal,
    };
};

router.post("/monthly", auth, async (req, res) => {
    try {
        let { month, year } = req.body;

        if (!month || !year) {
            const now = new Date();
            month = now.getMonth() + 1;
            year = now.getFullYear();
        }

        month = Number(month);
        year = Number(year);

        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0, 23, 59, 59);

        const transactions = await Transaction.find({
            user: req.user._id,
            date: { $gte: start, $lte: end },
        }).sort({ date: -1 });

        const base = buildFallbackSummary(transactions, month, year);

        const summaryDoc = await MonthlySummary.findOneAndUpdate(
            { user: req.user._id, month, year },
            base,
            { upsert: true, new: true }
        );

        res.json({
            summaryText: summaryDoc.summaryText,
            cutSuggestions: summaryDoc.cutSuggestions,
            topCategories: summaryDoc.topCategories,
            savingGoal: summaryDoc.savingGoal,
        });
    } catch (err) {
        console.error("POST /api/summaries/monthly error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
