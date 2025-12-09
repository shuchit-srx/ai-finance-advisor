import mongoose from "mongoose";

const CATEGORY_VALUES = [
  "food",
  "rent",
  "transport",
  "shopping",
  "subscriptions",
  "others",
];

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: CATEGORY_VALUES,
      required: true,
      lowercase: true,
      trim: true,
      default: "others",
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
export { CATEGORY_VALUES };
