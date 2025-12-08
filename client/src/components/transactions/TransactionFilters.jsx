import Card from "../common/Card";
import Button from "../common/Button";

const categories = [
    "all",
    "food",
    "rent",
    "transport",
    "shopping",
    "subscriptions",
    "others",
];

export default function TransactionFilters({ filters, setFilters, onApply }) {
    const handleChange = (e) =>
        setFilters((f) => ({ ...f, [e.target.name]: e.target.value }));

    return (
        <Card className="p-4 mt-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-end">
                <div className="flex-1">
                    <label className="block text-xs text-slate-400 mb-1">From</label>
                    <input
                        type="date"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleChange}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-xs text-slate-400 mb-1">To</label>
                    <input
                        type="date"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleChange}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        {categories.map((c) => (
                            <option key={c} value={c}>
                                {c.charAt(0).toUpperCase() + c.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
                <Button variant="outline" onClick={onApply}>
                    Apply
                </Button>
            </div>
        </Card>
    );
}
