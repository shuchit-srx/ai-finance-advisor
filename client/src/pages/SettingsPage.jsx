import { useEffect, useState } from "react";
import api from "../lib/api";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";

const categories = [
    "food",
    "rent",
    "transport",
    "shopping",
    "subscriptions",
    "others",
];

const getMonthYear = () => {
    const now = new Date();
    return { month: now.getMonth() + 1, year: now.getFullYear() };
};

export default function SettingsPage() {
    const [{ month, year }] = useState(getMonthYear());
    const [total, setTotal] = useState("");
    const [perCategory, setPerCategory] = useState({});
    const [message, setMessage] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await api.get("/budgets", { params: { month, year } });
                if (data.budget) {
                    setTotal(data.budget.total);
                    setPerCategory(Object.fromEntries(data.budget.perCategory || []));
                }
            } catch (err) {
                console.error(err);
            }
        };
        load();
    }, [month, year]);

    const handleCategoryChange = (cat, value) =>
        setPerCategory((pc) => ({ ...pc, [cat]: value }));

    const handleSave = async () => {
        try {
            await api.post("/budgets", {
                month,
                year,
                total: Number(total),
                perCategory,
            });
            setMessage("Budget updated.");
            setTimeout(() => setMessage(""), 2000);
        } catch (err) {
            console.error(err);
            setMessage("Error saving budget.");
        }
    };

    const label = `${new Date(year, month - 1).toLocaleString("default", {
        month: "long",
        year: "numeric",
    })}`;

    return (
        <div className="max-w-4xl mx-auto mt-6">
            <h1 className="text-2xl font-semibold tracking-tight mb-2">
                Budgets & preferences
            </h1>
            <p className="text-sm text-slate-400 mb-4">
                Set monthly and per-category budgets to get alerts on the dashboard.
            </p>
            <Card className="p-5">
                <p className="text-sm font-medium mb-2">
                    Monthly budget for {label}
                </p>
                <div className="flex flex-col gap-3 mb-4 max-w-xs">
                    <label className="text-xs text-slate-400">
                        Total monthly budget
                    </label>
                    <input
                        type="number"
                        value={total}
                        onChange={(e) => setTotal(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
                <p className="text-xs text-slate-400 mb-2">
                    Optional budgets per category
                </p>
                <div className="space-y-2 max-w-md">
                    {categories.map((c) => (
                        <div
                            key={c}
                            className="flex items-center gap-3 text-sm text-slate-200"
                        >
                            <span className="w-28 capitalize">{c}</span>
                            <input
                                type="number"
                                value={perCategory[c] || ""}
                                onChange={(e) => handleCategoryChange(c, e.target.value)}
                                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                    ))}
                </div>
                <Button
                    variant="primary"
                    className="mt-4"
                    onClick={handleSave}
                    disabled={!total}
                >
                    Save budget
                </Button>
                {message && (
                    <p className="text-xs text-slate-300 mt-2">{message}</p>
                )}
            </Card>
        </div>
    );
}
