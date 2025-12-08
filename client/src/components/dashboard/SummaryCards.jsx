import Card from "../common/Card";

const statusText = {
    within: "Within budget",
    close: "Close to limit",
    over: "Over budget",
    "no-budget": "No budget set",
};

const statusColor = {
    within: "bg-emerald-500/10 text-emerald-300 border-emerald-500/40",
    close: "bg-amber-500/10 text-amber-300 border-amber-500/40",
    over: "bg-rose-500/10 text-rose-300 border-rose-500/40",
    "no-budget": "bg-slate-700/40 text-slate-300 border-slate-600",
};

export default function SummaryCards({
    totalSpent,
    totalStatus,
    savingGoal,
    monthLabel,
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-5">
                <p className="text-xs uppercase text-slate-400">
                    This month ({monthLabel})
                </p>
                <p className="text-3xl font-semibold mt-2">
                    ₹{totalSpent.toFixed(2)}
                </p>
                <div className="mt-3">
                    <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] border ${statusColor[totalStatus]}`}
                    >
                        {statusText[totalStatus] || "No budget set"}
                    </span>
                </div>
            </Card>

            <Card className="p-5">
                <p className="text-xs uppercase text-slate-400">
                    Suggested monthly saving
                </p>
                <p className="text-3xl font-semibold mt-2">
                    {savingGoal ? `₹${savingGoal.toFixed(2)}` : "—"}
                </p>
                <p className="text-xs text-slate-400 mt-2">
                    Based on your recent spending pattern.
                </p>
            </Card>

            <Card className="p-5">
                <p className="text-xs uppercase text-slate-400">Quick tips</p>
                <ul className="mt-3 space-y-1.5 text-xs text-slate-300">
                    <li>• Review top 2 spending categories weekly.</li>
                    <li>• Move savings at the start of the month.</li>
                    <li>• Avoid impulse buys in “shopping” & “food”.</li>
                </ul>
            </Card>
        </div>
    );
}
