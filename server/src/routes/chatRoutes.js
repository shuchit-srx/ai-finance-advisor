import express from "express";
import { auth } from "../middleware/auth.js";
import { Transaction } from "../models/Transaction.js";
import { getSpendingAnalysis } from "../utils/aiClient.js";

const router = express.Router();

const detectCategory = (text = "") => {
    const t = text.toLowerCase();
    if (t.includes("food")) return "food";
    if (t.includes("rent")) return "rent";
    if (t.includes("transport") || t.includes("cab") || t.includes("uber") || t.includes("ola")) return "transport";
    if (t.includes("shop") || t.includes("shopping") || t.includes("amazon") || t.includes("flipkart")) return "shopping";
    if (t.includes("subscr") || t.includes("netflix") || t.includes("spotify") || t.includes("prime")) return "subscriptions";
    return null;
};

const dateRangeFromQuery = (text = "") => {
    const now = new Date();
    const t = text.toLowerCase();
    if (t.includes("today")) {
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        return { start, end };
    }
    if (t.includes("yesterday")) {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
        return { start, end };
    }
    if (t.includes("this month") || t.includes("month")) {
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        return { start, end };
    }
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 14);
    return { start, end: now };
};

router.post("/query", auth, async (req, res) => {
    try {
        const { message = "", includeContext = true } = req.body;
        const trimmed = (message || "").trim();
        if (!trimmed) return res.status(400).json({ message: "Empty message" });

        const categoryGuess = detectCategory(trimmed);
        const { start, end } = dateRangeFromQuery(trimmed);

        let transactions = [];
        if (includeContext) {
            transactions = await Transaction.find({
                user: req.user._id,
                date: { $gte: start, $lte: end },
            }).lean();
        }

        if (categoryGuess && transactions.length) {
            const total = transactions
                .filter((t) => (t.category || "").toLowerCase() === categoryGuess)
                .reduce((s, t) => s + Number(t.amount || 0), 0);

            const reply = `You spent ₹${total.toFixed(2)} on ${categoryGuess} between ${start.toISOString().slice(0, 10)} and ${end.toISOString().slice(0, 10)}. ${total > 0 ? "Consider reducing small recurring purchases to lower this." : "No recorded transactions in this category for that period."}`;

            return res.json({ reply });
        }

        const recent = includeContext ? transactions : await Transaction.find({ user: req.user._id }).sort({ date: -1 }).limit(200).lean();

        const analysis = await getSpendingAnalysis(recent || []);
        const reply = `${analysis.summaryText}\n\nSuggestions: ${analysis.cutSuggestions}\n\nTop categories: ${analysis.topCategories.join(", ") || "none"}. Suggested monthly saving goal: ₹${analysis.savingGoal?.toLocaleString?.("en-IN") || analysis.savingGoal || 0}`;

        return res.json({ reply });
    } catch (err) {
        console.error("POST /api/chat/query error:", err);
        return res.status(500).json({ message: "Server chat error" });
    }
});

export default router;
