import express from "express";
import multer from "multer";
import csv from "csv-parser";
import { Readable } from "stream";

import { auth } from "../middleware/auth.js";
import { Transaction, CATEGORY_VALUES } from "../models/Transaction.js";
import { checkDuplicate } from "../utils/checkDuplicate.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Smart category guesser
const guessCategory = (text = "") => {
  const t = text.toLowerCase();
  if (/uber|ola|bus|train|cab|metro|fuel/.test(t)) return "transport";
  if (/zomato|swiggy|restaurant|cafe|food|pizza|burger/.test(t)) return "food";
  if (/rent|landlord|room/.test(t)) return "rent";
  if (/netflix|spotify|prime|subscription|subscr/.test(t)) return "subscriptions";
  if (/amazon|flipkart|myntra|shopping|store/.test(t)) return "shopping";
  return "others";
};

// Normalize category to valid enum
const normalizeCategory = (rawCategory) => {
  const c = (rawCategory || "").toString().toLowerCase().trim();
  if (CATEGORY_VALUES.includes(c)) return c;
  return "others";
};

// Add single transaction
router.post("/", auth, async (req, res) => {
  try {
    const {
      date,
      description,
      amount,
      category,
      duplicateMode = "skip",
    } = req.body;

    if (!date || !description || amount == null) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const duplicate = await checkDuplicate(req.user._id, {
      date,
      description,
      amount,
    });

    if (duplicate && duplicateMode === "skip") {
      return res.status(409).json({
        message: "Duplicate transaction detected (skipped by mode)",
        duplicate,
      });
    }

    const rawCategory = category || guessCategory(description);
    const finalCategory = normalizeCategory(rawCategory);

    const txn = await Transaction.create({
      user: req.user._id,
      date,
      description,
      amount,
      category: finalCategory,
    });

    res.status(201).json(txn);
  } catch (err) {
    console.error("Single transaction error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch all transactions
router.get("/", auth, async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;

    const query = { user: req.user._id };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (category && category !== "all") {
      query.category = category.toLowerCase();
    }

    const list = await Transaction.find(query).sort({ date: -1 });
    res.json(list);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// CSV format: date,description,amount
router.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const mode = req.query.mode || "skip";
    const csvRows = [];
    const stream = Readable.from(req.file.buffer);

    stream
      .pipe(csv())
      .on("data", (row) => csvRows.push(row))
      .on("end", async () => {
        try {
          const docsToInsert = [];
          let duplicateCount = 0;

          for (const r of csvRows) {
            const rowDate = r.date;
            const rowDesc = r.description;
            const rowAmount = Number(r.amount);

            // basic validation
            if (!rowDate || !rowDesc || isNaN(rowAmount)) {
              continue;
            }

            const duplicate = await checkDuplicate(req.user._id, {
              date: rowDate,
              description: rowDesc,
              amount: rowAmount,
            });

            if (duplicate && mode === "skip") {
              duplicateCount++;
              continue;
            }

            const rawCategory = guessCategory(rowDesc);
            const finalCategory = normalizeCategory(rawCategory);

            docsToInsert.push({
              user: req.user._id,
              date: new Date(rowDate),
              description: rowDesc.trim(),
              amount: rowAmount,
              category: finalCategory,
            });
          }

          if (!docsToInsert.length) {
            return res.status(409).json({
              message:
                "No new transactions to insert (all were duplicates or invalid rows).",
              insertedCount: 0,
              duplicateCount,
            });
          }

          const inserted = await Transaction.insertMany(docsToInsert, {
            ordered: false,
          });

          res.json({
            message: "CSV processed",
            insertedCount: inserted.length,
            duplicateCount,
          });
        } catch (err) {
          console.error("CSV insert error:", err);
          res.status(500).json({ message: "Insert failed" });
        }
      })
      .on("error", (err) => {
        console.error("CSV parse error:", err);
        res.status(500).json({ message: "CSV parse error" });
      });

  } catch (err) {
    console.error("CSV upload error:", err);
    res.status(500).json({ message: "CSV upload failed" });
  }
});

export default router;
