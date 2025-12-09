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
    totalBudget,
    totalStatus,
    savingGoal,
    monthLabel,
    perCategoryStatus = {},
}) {
    const formattedSpent = `₹${totalSpent.toLocaleString("en-IN")}`;
    const formattedBudget =
        totalBudget && totalBudget > 0
            ? `₹${totalBudget.toLocaleString("en-IN")}`
            : "No budget";

    const ratioLabel =
        totalBudget && totalBudget > 0
            ? `${formattedSpent} / ${formattedBudget}`
            : formattedSpent;

    return (
        <div className="grid gap-4 md:grid-cols-3 mt-4">

            {/* This Month */}
            <Card className="p-4">
                <p className="text-xs uppercase text-slate-400 mb-1 font-bold">
                    This month
                </p>
                <p className="text-xs text-slate-300 mb-1">{monthLabel}</p>

                <p className="text-lg md:text-xl font-semibold text-slate-50">
                    {ratioLabel}
                </p>

                <div className="mt-2">
                    <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-[9px] border ${statusColor[totalStatus]}`}
                    >
                        {statusText[totalStatus] || "No budget set"}
                    </span>
                </div>
            </Card>

            {/* Saving Goal */}
            <Card className="p-4">
                <p className="text-xs uppercase text-slate-400 mb-1 font-bold">
                    Monthly saving goal
                </p>
                <p className="text-lg md:text-xl font-semibold text-emerald-400">
                    {savingGoal
                        ? `₹${savingGoal.toLocaleString("en-IN")}`
                        : "Not set"}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                    Configure in Settings for better AI advice.
                </p>
            </Card>

            {/* Category Signals */}
            <Card className="p-4">
                <p className="text-xs uppercase text-slate-400 mb-2 font-bold">
                    Category signals
                </p>

                <div className="space-y-1.5 text-xs">
                    {Object.keys(perCategoryStatus).length === 0 && (
                        <p className="text-slate-500">
                            No per-category limits configured.
                        </p>
                    )}

                    {Object.entries(perCategoryStatus).map(([cat, status]) => (
                        <div
                            key={cat}
                            className="flex items-center justify-between"
                        >
                            <span className="capitalize text-slate-300">
                                {cat}
                            </span>
                            <span
                                className={
                                    "text-[11px] font-medium " +
                                    (statusColor[status] || "text-slate-400")
                                }
                            >
                                {statusLabel[status] || "No budget"}
                            </span>
                        </div>
                    ))}
                </div>
            </Card>

        </div>
    );
}