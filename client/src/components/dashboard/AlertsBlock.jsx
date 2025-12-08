import Card from "../common/Card";

const labelFor = {
    within: "You are comfortably within your budget.",
    close: "You are close to the limit. Ease up a bit.",
    over: "You crossed your budget. Time to tighten things.",
    "no-budget": "Set a budget to get alerts here.",
};

export default function AlertsBlock({ totalStatus, perCategoryStatus = {} }) {
    const anyDanger =
        totalStatus === "over" ||
        Object.values(perCategoryStatus).some((s) => s === "over" || s === "close");

    return (
        <Card className="p-5 mt-4">
            <p className="text-sm font-medium mb-2">Alerts & signals</p>
            <p className="text-sm text-slate-300 mb-3">
                {labelFor[totalStatus] || labelFor["no-budget"]}
            </p>

            {anyDanger && (
                <>
                    <p className="text-xs text-slate-400 mb-1 font-medium">
                        Category alerts:
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(perCategoryStatus).map(([cat, status]) => {
                            if (status === "within" || status === "no-budget") return null;
                            const color =
                                status === "over"
                                    ? "bg-rose-500/10 text-rose-300 border-rose-500/40"
                                    : "bg-amber-500/10 text-amber-300 border-amber-500/40";
                            return (
                                <span
                                    key={cat}
                                    className={`px-2 py-1 rounded-full text-[11px] border ${color}`}
                                >
                                    {cat}: {status === "over" ? "Over budget" : "Close to limit"}
                                </span>
                            );
                        })}
                    </div>
                </>
            )}
        </Card>
    );
}
