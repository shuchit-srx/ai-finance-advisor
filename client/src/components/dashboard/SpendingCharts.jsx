import Card from "../common/Card";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

const ALL_CATEGORIES = [
    "food",
    "rent",
    "transport",
    "shopping",
    "subscriptions",
    "others",
];

const COLORS = [
    "#6366F1", // indigo
    "#10B981", // emerald
    "#F59E0B", // amber
    "#EF4444", // red
    "#3B82F6", // blue
    "#EC4899", // pink
    "#84CC16", // lime
];

export default function SpendingCharts({ byCategory, timeline }) {
    const categoryData = ALL_CATEGORIES.map((cat) => ({
        name: cat.charAt(0).toUpperCase() + cat.slice(1),
        value: byCategory[cat] || 0,
    }));


    const timelineData = Array.isArray(timeline) ? timeline : [];

    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-4">

            {/* Pie Chart for Categories */}
            <Card className="p-4 md:col-span-2 h-72">
                <p className="text-sm font-medium text-slate-100 mb-2">
                    Spending by category
                </p>

                <div className="w-full h-[85%]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius="80%"
                                label
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>

                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#020617",
                                    border: "1px solid #1e293b",
                                    borderRadius: "0.5rem",
                                    fontSize: "12px",
                                }}
                            />

                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Timeline Chart */}
            <Card className="p-4 md:col-span-3 h-72">
                <p className="text-sm font-medium text-slate-100 mb-2">
                    Activity over time
                </p>

                <div className="w-full h-[85%]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={timelineData}>
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
                                cursor={{ stroke: "#334155" }}
                            />
                            <Line
                                type="monotone"
                                dataKey="amount"
                                stroke="#22c55e"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>

        </div>
    );
}
