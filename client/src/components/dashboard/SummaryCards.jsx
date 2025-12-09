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
                    Configure in Set Budget for better AI advice.
                </p>
            </Card>

            {/* Alerts */}
            <Card className="p-4">
                <p className="text-xs uppercase text-slate-400 mb-2 font-bold">
                    Category Budget Alerts
                </p>

                <div className="flex flex-wrap gap-2 space-y-1.5 text-xs h-fit">

                    {Object.keys(perCategoryStatus).length === 0 && (
                        <p className="text-slate-500">
                            No per-category budgets set.
                        </p>
                    )}

                    {Object.entries(perCategoryStatus).map(([cat, status]) => {
                        cat = cat.charAt(0).toUpperCase() + cat.slice(1);
                        const message =
                            status === "over"
                                ? `${cat}`
                                : status === "close"
                                    ? `${cat}`
                                    : status === "within"
                                        ? `${cat}`
                                        : `${cat}`;

                        return (
                            <span
                                key={cat}
                                className={`px-2 py-1 h-fit rounded border text-[11px] ${statusColor[status] || "text-slate-400 border-slate-700"
                                    }`}
                            >
                                {message}
                            </span>
                        );
                    })}
                </div>
            </Card>

        </div>
    );
}
