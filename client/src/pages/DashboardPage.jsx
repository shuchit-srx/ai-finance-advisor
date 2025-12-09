import { useEffect, useState } from "react";
import api from "../lib/api";
import SummaryCards from "../components/dashboard/SummaryCards.jsx";
import SpendingCharts from "../components/dashboard/SpendingCharts.jsx";
import Loader from "../components/common/Loader.jsx";
import Card from "../components/common/Card.jsx";

const getMonthYear = () => {
    const now = new Date();
    return { month: now.getMonth() + 1, year: now.getFullYear() };
};

export default function DashboardPage() {
    const [{ month, year }] = useState(getMonthYear());
    const [loading, setLoading] = useState(true);
    const [budgetData, setBudgetData] = useState(null);
    const [summary, setSummary] = useState(null);
    const [timeline, setTimeline] = useState([]);
    const [byCategory, setByCategory] = useState({});

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [budgetRes, summaryRes, txRes] = await Promise.all([
                    api.get("/budgets", { params: { month, year } }),
                    api.post("/summaries/monthly", { month, year }),
                    api.get("/transactions", {
                        params: {
                            startDate: new Date(year, month - 1, 1)
                                .toISOString()
                                .slice(0, 10),
                            endDate: new Date(year, month, 0).toISOString().slice(0, 10),
                        },
                    }),
                ]);

                setBudgetData(budgetRes.data || null);
                setSummary(summaryRes.data || null);

                const tx = txRes.data || [];
                const byDate = {};
                const cat = {};

                tx.forEach((t) => {
                    const d = new Date(t.date).toISOString().slice(0, 10);
                    byDate[d] = (byDate[d] || 0) + t.amount;
                    const key = t.category || "others";
                    cat[key] = (cat[key] || 0) + t.amount;
                });

                const dates = Object.keys(byDate).sort();
                setTimeline(
                    dates.map((d) => ({
                        date: d.slice(8),
                        amount: byDate[d],
                    }))
                );
                setByCategory(cat);
            } catch (err) {
                console.error("Error loading dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [month, year]);

    if (loading) return <Loader />;

    let totalSpent = 0;
    let totalStatus;
    let perCategoryStatus = {};
    let totalBudget = 0;

    if (budgetData) {
        if (typeof budgetData.totalSpent === "number") {
            totalSpent = budgetData.totalSpent;
        }
        if (budgetData.totalStatus) {
            totalStatus = budgetData.totalStatus;
        }
        if (budgetData.perCategoryStatus) {
            perCategoryStatus = budgetData.perCategoryStatus;
        }
        if (budgetData.budget && typeof budgetData.budget.total === "number") {
            totalBudget = budgetData.budget.total;
        }
    }

    const monthLabel = `${new Date(year, month - 1).toLocaleString("default", {
        month: "short",
    })} ${year}`;

    const topCategories = summary?.topCategories || [];

    return (
        <div className="max-w-6xl mx-auto mt-6 space-y-6">
            <header>
                <h1 className="text-2xl font-semibold tracking-tight">
                    Your overview
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                    Personal spending insights, budgets and AI advice in one place.
                </p>
            </header>

            {/* Summary cards */}
            <SummaryCards
                totalSpent={totalSpent}
                totalBudget={totalBudget}
                totalStatus={totalStatus}
                savingGoal={summary?.savingGoal || 0}
                monthLabel={monthLabel}
                perCategoryStatus={perCategoryStatus}
            />


            {/* Charts */}
            <SpendingCharts byCategory={byCategory} timeline={timeline} />

            {/* AI advice block */}
            <section>
                <Card className="p-5 mt-2">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        {/* Summary text */}
                        <div className="flex-1">
                            <p className="text-xs uppercase text-slate-400 mb-2 font-bold">
                                Latest AI advice
                            </p>
                            <p className="text-sm text-slate-200 leading-relaxed">
                                {summary?.summaryText ||
                                    "Once you add some transactions, your AI spending summary will appear here."}
                            </p>
                        </div>

                        {/* Suggestions & focus areas */}
                        <div className="flex-1 mt-3 md:mt-0 md:pl-6 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0">
                            <p className="text-xs uppercase text-slate-400 mb-2 font-bold">
                                Suggested focus areas
                            </p>
                            <p className="text-sm text-slate-200 leading-relaxed mb-2">
                                {summary?.cutSuggestions ||
                                    "Try to keep discretionary categories like food, shopping and transport under control and review recurring subscriptions regularly."}
                            </p>

                            {topCategories.length > 0 && (
                                <div className="mt-2">
                                    <p className="text-xs text-slate-400 mb-2.5">
                                        Categories to watch
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {topCategories.map((cat) => (
                                            <span
                                                key={cat}
                                                className="px-2 py-1 rounded-full bg-slate-900 border border-slate-700 text-[11px] text-slate-200"
                                            >
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </section>
        </div>
    );
}
