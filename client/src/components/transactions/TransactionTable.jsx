import Card from "../common/Card";

export default function TransactionTable({ transactions }) {
    return (
        <Card className="p-4 mt-4">
            <p className="text-sm font-medium mb-2">Transactions</p>
            <div className="overflow-x-auto">
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
                                className="border-t border-slate-800 hover:bg-slate-900/70"
                            >
                                <td className="px-3 py-2">
                                    {new Date(t.date).toISOString().slice(0, 10)}
                                </td>
                                <td className="px-3 py-2">{t.description}</td>
                                <td className="px-3 py-2">{t.category}</td>
                                <td className="px-3 py-2 text-right">
                                    ₹{t.amount.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                        {!transactions.length && (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-3 py-4 text-center text-slate-500"
                                >
                                    No transactions yet. Upload a CSV or add one manually.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
