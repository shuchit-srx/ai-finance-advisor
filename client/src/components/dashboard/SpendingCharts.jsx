import Card from "../common/Card";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    LineChart,
    Line,
    CartesianGrid,
} from "recharts";

export default function SpendingCharts({ byCategory, timeline }) {
    const categoryData = Object.entries(byCategory || {}).map(([category, amount]) => ({
        category,
        amount,
    }));

    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
            <Card className="p-4 md:col-span-2 h-72">
                <p className="text-sm font-medium text-slate-100 mb-2">
                    Spending by category
                </p>
                <div className="w-full h-[85%]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryData}>
                            <XAxis dataKey="category" stroke="#64748b" />
                            <YAxis stroke="#64748b" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#020617",
                                    border: "1px solid #1e293b",
                                    borderRadius: "0.5rem",
                                    fontSize: "12px",
                                }}
                            />
                            <Bar dataKey="amount" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card className="p-4 md:col-span-3 h-72">
                <p className="text-sm font-medium text-slate-100 mb-2">
                    Activity over time
                </p>
                <div className="w-full h-[85%]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={timeline}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                            <XAxis dataKey="date" stroke="#64748b" />
                            <YAxis stroke="#64748b" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#020617",
                                    border: "1px solid #1e293b",
                                    borderRadius: "0.5rem",
                                    fontSize: "12px",
                                }}
                            />
                            <Line type="monotone" dataKey="amount" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
}
