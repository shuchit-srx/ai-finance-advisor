import express from "express";
import { auth } from "../middleware/auth.js";
import { Budget } from "../models/Budget.js";
import { Transaction } from "../models/Transaction.js";

const router = express.Router();

// Set or update budget for month
router.post("/", auth, async (req, res) => {
    try {
        const { month, year, total, perCategory } = req.body;
        if (!month || !year || !total)
            return res.status(400).json({ message: "month, year, total required" });

        const budget = await Budget.findOneAndUpdate(
            { user: req.user._id, month, year },
            { total, perCategory: perCategory || {} },
            { upsert: true, new: true }
        );

        res.json(budget);
    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

// Get budget + current spending + status flags
router.get("/", auth, async (req, res) => {
    try {
        const { month, year } = req.query;
        if (!month || !year)
            return res.status(400).json({ message: "month & year required" });

        const budget = await Budget.findOne({
            user: req.user._id,
            month,
            year,
        });

        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0, 23, 59, 59);

        const transactions = await Transaction.find({
            user: req.user._id,
            date: { $gte: start, $lte: end },
        });

        const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
        const byCategory = {};
        for (const t of transactions) {
            byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
        }

        // status helpers
        const statusFor = (spent, budgetValue) => {
            if (!budgetValue) return "no-budget";
            const ratio = spent / budgetValue;
            if (ratio < 0.8) return "within";
            if (ratio < 1) return "close";
            return "over";
        };

        const totalStatus = budget
            ? statusFor(totalSpent, budget.total)
            : "no-budget";
        const perCategoryStatus = {};

        if (budget && budget.perCategory) {
            for (const [cat, value] of budget.perCategory.entries()) {
                perCategoryStatus[cat] = statusFor(byCategory[cat] || 0, value);
            }
        }

        res.json({
            budget,
            totalSpent,
            byCategory,
            totalStatus,
            perCategoryStatus,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
