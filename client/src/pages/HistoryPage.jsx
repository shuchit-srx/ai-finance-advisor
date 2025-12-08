import { useEffect, useState } from "react";
import api from "../lib/api";
import Card from "../components/common/Card.jsx";

export default function HistoryPage() {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await api.get("/summaries/history");
                setHistory(data);
            } catch (err) {
                console.error(err);
            }
        };
        load();
    }, []);

    return (
        <div className="max-w-6xl mx-auto mt-6">
            <h1 className="text-2xl font-semibold tracking-tight mb-2">
                Monthly history
            </h1>
            <p className="text-sm text-slate-400 mb-4">
                Past AI summaries are stored here so you can see how your spending
                habits evolved.
            </p>

            {history.length === 0 ? (
                <p className="text-sm text-slate-500">
                    No historical summaries yet. Generate insights from the dashboard
                    first.
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {history.map((h) => (
                        <Card key={h._id} className="p-4">
                            <p className="text-sm font-semibold mb-1">
                                {new Date(h.year, h.month - 1).toLocaleString("default", {
                                    month: "long",
                                    year: "numeric",
                                })}
                            </p>
                            <p className="text-sm text-slate-200 mb-2">{h.summaryText}</p>
                            <p className="text-xs text-slate-300 mb-2">
                                <span className="font-semibold">Suggestions:</span>{" "}
                                {h.cutSuggestions}
                            </p>
                            <p className="text-xs text-slate-300 mb-2">
                                Suggested saving: ₹{h.savingGoal?.toFixed(2) || 0}
                            </p>
                            {h.topCategories?.length ? (
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {h.topCategories.map((c) => (
                                        <span
                                            key={c}
                                            className="px-2 py-1 rounded-full bg-slate-800 text-[11px] text-slate-200"
                                        >
                                            {c}
                                        </span>
                                    ))}
                                </div>
                            ) : null}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
