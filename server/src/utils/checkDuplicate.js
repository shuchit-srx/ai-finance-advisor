import { Transaction } from "../models/Transaction.js";

export const checkDuplicate = async (userId, { date, description, amount }) => {
  if (!date || !description || amount == null) return null;

  const existing = await Transaction.findOne({
    user: userId,
    date: new Date(date),
    description: description.trim(),
    amount: Number(amount),
  }).lean();

  return existing || null;
};
