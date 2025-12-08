import { useEffect, useState } from "react";
import api from "../lib/api";
import SummaryCards from "../components/dashboard/SummaryCards.jsx";
import SpendingCharts from "../components/dashboard/SpendingCharts.jsx";
import AlertsBlock from "../components/dashboard/AlertsBlock.jsx";
import Loader from "../components/common/Loader.jsx";

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
                            startDate: new Date(year, month - 1, 1).toISOString().slice(0, 10),
                            endDate: new Date(year, month, 0).toISOString().slice(0, 10),
                        },
                    }),
                ]);

                setBudgetData(budgetRes.data);
                setSummary(summaryRes.data);

                const tx = txRes.data;
                const byDate = {};
                const cat = {};
                tx.forEach((t) => {
                    const d = new Date(t.date).toISOString().slice(0, 10);
                    byDate[d] = (byDate[d] || 0) + t.amount;
                    cat[t.category] = (cat[t.category] || 0) + t.amount;
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
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [month, year]);

    if (loading) return <Loader />;

    const { totalSpent = 0, totalStatus, perCategoryStatus } = budgetData || {};
    const monthLabel = `${new Date(year, month - 1).toLocaleString("default", {
        month: "short",
    })} ${year}`;

    return (
        <div className="max-w-6xl mx-auto mt-6">
            <header className="mb-4">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Your overview
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                    Personal spending insights, budgets and AI advice in one place.
                </p>
            </header>

            <SummaryCards
                totalSpent={totalSpent}
                totalStatus={totalStatus}
                savingGoal={summary?.savingGoal || 0}
                monthLabel={monthLabel}
            />

            <SpendingCharts byCategory={byCategory} timeline={timeline} />

            <section className="mt-4">
                <p className="text-sm font-medium mb-1">Latest AI advice</p>
                <div className="text-sm text-slate-200 space-y-1">
                    <p>{summary?.summaryText}</p>
                    <p>
                        <span className="font-semibold">Suggestions:</span>{" "}
                        {summary?.cutSuggestions}
                    </p>
                    {summary?.topCategories?.length ? (
                        <p className="text-xs text-slate-400">
                            Top categories: {summary.topCategories.join(", ")}
                        </p>
                    ) : null}
                </div>
            </section>

            <AlertsBlock
                totalStatus={totalStatus}
                perCategoryStatus={perCategoryStatus || {}}
            />
        </div>
    );
}
