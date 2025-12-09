import express from "express";
import { auth } from "../middleware/auth.js";
import { Transaction } from "../models/Transaction.js";
import { MonthlySummary } from "../models/MonthlySummary.js";

const router = express.Router();

const buildFallbackSummary = (transactions, month, year, savingGoalFromUser = 0) => {
    if (!transactions.length) {
        return {
            summaryText: `No transactions recorded yet for ${month}/${year}. Once you add income and expenses, your monthly insight will appear here.`,
            cutSuggestions:
                "Start by adding both income (salary, refunds, transfers) and expenses (food, rent, subscriptions) so your cashflow picture is complete.",
            topCategories: [],
            savingGoal: savingGoalFromUser || 0,
        };
    }

    let totalDebit = 0;
    let totalCredit = 0;
    const byCategory = {};

    for (const t of transactions) {
        const rawAmount = Number(t.amount) || 0;
        const type =
            t.type ||
            (rawAmount >= 0 ? "debit" : "credit");

        if (type === "credit") {
            totalCredit += Math.abs(rawAmount);
        } else {
            const debitAmount = Math.abs(rawAmount);
            totalDebit += debitAmount;

            const cat = (t.category || "others").toLowerCase();
            byCategory[cat] = (byCategory[cat] || 0) + debitAmount;
        }
    }

    const net = totalCredit - totalDebit;
    const monthLabel = `${month}/${year}`;

    const sortedCats = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
    const topCategories = sortedCats.slice(0, 3).map(([cat]) => cat);

    const effectiveSavingGoal =
        savingGoalFromUser && savingGoalFromUser > 0
            ? savingGoalFromUser
            : totalCredit > 0
                ? Math.round(totalCredit * 0.15)
                : 0;

    const gap = effectiveSavingGoal > 0 ? effectiveSavingGoal - net : 0;

    let goalSentence = "";
    if (effectiveSavingGoal > 0) {
        if (gap <= 0) {
            goalSentence = `You are currently on track with your saving goal of ₹${effectiveSavingGoal.toLocaleString(
                "en-IN"
            )}, with a net surplus that already meets or exceeds it.`;
        } else {
            goalSentence = `To reach your saving goal of ₹${effectiveSavingGoal.toLocaleString(
                "en-IN"
            )}, you need an additional net surplus of about ₹${Math.abs(
                gap
            ).toLocaleString("en-IN")} this month.`;
        }
    } else {
        goalSentence =
            "You have not set a specific saving goal for this month. Configure it in Settings to get more precise suggestions.";
    }

    const summaryText = `
For ${monthLabel}, your total inflow (credits) is ₹${totalCredit.toFixed(
        2
    )}, and your total spending (debits) is ₹${totalDebit.toFixed(2)}.
That leaves you with a net ${net >= 0 ? "surplus" : "deficit"} of ₹${Math.abs(
        net
    ).toFixed(2)} for the month.
Your main spending categories are ${topCategories.length ? topCategories.join(", ") : "not clearly defined yet"
        }.
${goalSentence}
  `.trim();

    const primaryCategory = topCategories[0];

    const cutSuggestions =
        sortedCats.length === 0
            ? "Once more expense data is available, we’ll highlight where you can cut or rebalance your spending."
            : effectiveSavingGoal > 0
                ? `
To move closer to your saving goal, start by trimming non-essential spend in ${primaryCategory || "your largest category"
                    }.
Even small reductions across food, shopping and transport can close the gap.
Try reviewing your weekly spending and assigning a hard cap per category that matches your target savings.
    `.trim()
                : `
Focus first on ${primaryCategory || "your largest category"
                    }, since cutting even small recurring costs there can meaningfully improve your monthly surplus.
Try to keep discretionary categories like food, shopping and transport under a simple monthly cap.
    `.trim();

    return {
        summaryText,
        cutSuggestions,
        topCategories,
        savingGoal: effectiveSavingGoal,
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

        const existing = await MonthlySummary.findOne({
            user: req.user._id,
            month,
            year,
        });

        const userSavingGoal = existing?.savingGoal || 0;

        const base = buildFallbackSummary(
            transactions,
            month,
            year,
            userSavingGoal
        );

        const summaryDoc = await MonthlySummary.findOneAndUpdate(
            { user: req.user._id, month, year },
            {
                summaryText: base.summaryText,
                cutSuggestions: base.cutSuggestions,
                topCategories: base.topCategories,
                savingGoal: base.savingGoal,
            },
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

router.get("/goal", auth, async (req, res) => {
    try {
        let { month, year } = req.query;

        if (!month || !year) {
            const now = new Date();
            month = now.getMonth() + 1;
            year = now.getFullYear();
        }

        month = Number(month);
        year = Number(year);

        const summary = await MonthlySummary.findOne({
            user: req.user._id,
            month,
            year,
        });

        res.json({
            month,
            year,
            savingGoal: summary?.savingGoal || 0,
        });
    } catch (err) {
        console.error("GET /api/summaries/goal error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
});

// Set / update saving goal for a month
router.post("/goal", auth, async (req, res) => {
    try {
        let { month, year, savingGoal } = req.body;

        if (!month || !year) {
            const now = new Date();
            month = now.getMonth() + 1;
            year = now.getFullYear();
        }

        month = Number(month);
        year = Number(year);
        savingGoal = Number(savingGoal) || 0;

        const summary = await MonthlySummary.findOneAndUpdate(
            { user: req.user._id, month, year },
            {
                $set: {
                    savingGoal,
                },
            },
            { upsert: true, new: true }
        );

        res.json({
            month,
            year,
            savingGoal: summary.savingGoal,
        });
    } catch (err) {
        console.error("POST /api/summaries/goal error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
