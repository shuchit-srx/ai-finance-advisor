import express from "express";
import multer from "multer";
import csv from "csv-parser";
import { auth } from "../middleware/auth.js";
import { Transaction } from "../models/Transaction.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const guessCategory = (description = "") => {
    const desc = description.toLowerCase();
    if (desc.match(/uber|ola|bus|train|cab|metro|fuel/)) return "transport";
    if (desc.match(/zomato|swiggy|restaurant|cafe|food|pizza|burger/))
        return "food";
    if (desc.match(/rent|landlord|room/)) return "rent";
    if (desc.match(/netflix|spotify|prime|subscription|subscr/))
        return "subscriptions";
    if (desc.match(/amazon|flipkart|myntra|shopping|store/)) return "shopping";
    return "others";
};

// Create single transaction (manual)
router.post("/", auth, async (req, res) => {
    try {
        const { date, description, amount, category } = req.body;
        if (!date || !description || amount == null)
            return res.status(400).json({ message: "Missing fields" });

        const txn = await Transaction.create({
            user: req.user._id,
            date,
            description,
            amount,
            category: category || guessCategory(description),
        });

        res.status(201).json(txn);
    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

// List transactions with filters (date range + category)
router.get("/", auth, async (req, res) => {
    try {
        const { startDate, endDate, category } = req.query;
        const query = { user: req.user._id };
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }
        if (category && category !== "all") query.category = category;

        const transactions = await Transaction.find(query).sort({ date: -1 });
        res.json(transactions);
    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

// CSV upload: date,description,amount
router.post(
    "/upload",
    auth,
    upload.single("file"),
    async (req, res) => {
        try {
            if (!req.file)
                return res.status(400).json({ message: "No file uploaded" });

            const results = [];
            const bufferStream = new (require("stream").Readable)();
            bufferStream.push(req.file.buffer);
            bufferStream.push(null);

            bufferStream
                .pipe(csv())
                .on("data", (row) => {
                    results.push(row);
                })
                .on("end", async () => {
                    const docs = results.map((r) => ({
                        user: req.user._id,
                        date: new Date(r.date),
                        description: r.description,
                        amount: parseFloat(r.amount),
                        category: guessCategory(r.description),
                    }));
                    const inserted = await Transaction.insertMany(docs);
                    res.json({ insertedCount: inserted.length });
                });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "File processing error" });
        }
    }
);

export default router;
