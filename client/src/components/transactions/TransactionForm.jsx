import { useState } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import api from "../../lib/api";

const categories = [
    "food",
    "rent",
    "transport",
    "shopping",
    "subscriptions",
    "others",
];

const todayStr = () => new Date().toISOString().slice(0, 10);

export default function TransactionForm({ onAdded }) {
    const [form, setForm] = useState({
        date: todayStr(),
        description: "",
        amount: "",
        category: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.date || !form.description || !form.amount) return;
        setLoading(true);
        try {
            const { data } = await api.post("/transactions", {
                ...form,
                amount: parseFloat(form.amount),
            });
            onAdded && onAdded(data);
            setForm({ date: todayStr(), description: "", amount: "", category: "" });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="p-4 mt-4">
            <p className="text-sm font-medium mb-3">
                Add transaction (for testing / manual entry)
            </p>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3 md:flex-row md:items-end"
            >
                <div className="flex-1">
                    <label className="block text-xs text-slate-400 mb-1">Date</label>
                    <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
                <div className="flex-[2]">
                    <label className="block text-xs text-slate-400 mb-1">
                        Description
                    </label>
                    <input
                        type="text"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-xs text-slate-400 mb-1">Amount</label>
                    <input
                        type="number"
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-xs text-slate-400 mb-1">
                        Category (optional)
                    </label>
                    <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="">Auto</option>
                        {categories.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>
                <Button type="submit" disabled={loading} className="w-full md:w-auto">
                    {loading ? "Saving..." : "Add"}
                </Button>
            </form>
        </Card>
    );
}
