import Card from "../common/Card";
import Button from "../common/Button";
import { Scrollbar } from "react-scrollbars-custom";

const categories = [
    "All",
    "Food",
    "Rent",
    "Transport",
    "Shopping",
    "Subscriptions",
    "Others",
];

export default function TransactionBlock({
    filters,
    setFilters,
    onApply,
    transactions,
}) {
    const handleChange = (e) =>
        setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    return (
        <Card className="p-5 mt-4 space-y-6">
            {/* FILTERS */}
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                {/* Date + Category Filters */}
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    <div className="flex-1">
                        <label className="block text-xs text-slate-400 mb-1">From</label>
                        <input
                            type="date"
                            name="startDate"
                            value={filters.startDate}
                            onChange={handleChange}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="flex-1">
                        <label className="block text-xs text-slate-400 mb-1">To</label>
                        <input
                            type="date"
                            name="endDate"
                            value={filters.endDate}
                            onChange={handleChange}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="flex-1">
                        <label className="block text-xs text-slate-400 mb-1">
                            Category
                        </label>
                        <select
                            name="category"
                            value={filters.category}
                            onChange={handleChange}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            {categories.map((c) => (
                                <option key={c} value={c.toLowerCase()}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Apply Button */}
                <Button variant="outline" onClick={onApply}>
                    Apply
                </Button>
            </div>

            {/* TRANSACTIONS TABLE */}
            <div>
                <p className="text-sm text-slate-300 mb-2 font-bold">Transactions</p>

                <div className="overflow-x-auto border border-slate-800 rounded-lg bg-slate-950">
                    <Scrollbar
                        style={{ width: "100%", height: 360 }}
                        trackYProps={{
                            style: {
                                backgroundColor: "#020617",
                                borderRadius: "9999px",
                                width: "6px",
                                right: "2px",
                            },
                        }}
                        thumbYProps={{
                            style: {
                                backgroundColor: "#22c55e",
                                borderRadius: "9999px",
                            },
                        }}
                    >
                        <table className="min-w-full text-xs">
                            <thead className="bg-slate-900">
                                <tr>
                                    <th className="text-left px-3 py-2 font-medium text-slate-300">
                                        Date
                                    </th>
                                    <th className="text-left px-3 py-2 font-medium text-slate-300">
                                        Description
                                    </th>
                                    <th className="text-left px-3 py-2 font-medium text-slate-300">
                                        Category
                                    </th>
                                    <th className="text-right px-3 py-2 font-medium text-slate-300">
                                        Amount
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {transactions.map((t) => (
                                    <tr
                                        key={t._id}
                                        className="border-t border-slate-800 hover:bg-slate-900/60"
                                    >
                                        <td className="px-3 py-2">
                                            {new Date(t.date).toISOString().slice(0, 10)}
                                        </td>
                                        <td className="px-3 py-2">{t.description}</td>
                                        <td className="px-3 py-2 capitalize">{t.category}</td>
                                        <td className="px-3 py-2 text-right text-emerald-400">
                                            ₹{Number(t.amount).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}

                                {!transactions.length && (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-3 py-4 text-center text-slate-500"
                                        >
                                            No transactions found. Try adjusting filters or upload a CSV.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </Scrollbar>
                </div>
            </div>
        </Card>
    );
}
