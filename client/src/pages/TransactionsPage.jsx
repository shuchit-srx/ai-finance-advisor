import { useEffect, useState } from "react";
import api from "../lib/api.js";
import CsvUpload from "../components/transactions/CsvUpload.jsx";
import TransactionForm from "../components/transactions/TransactionForm.jsx";
import TransactionFilters from "../components/transactions/TransactionFilters.jsx";
import TransactionTable from "../components/transactions/TransactionTable.jsx";

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        category: "all",
    });

    const loadTransactions = async () => {
        try {
            const { data } = await api.get("/transactions", { params: filters });
            setTransactions(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadTransactions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="max-w-6xl mx-auto mt-6">
            <h1 className="text-2xl font-semibold tracking-tight mb-2">
                Transactions
            </h1>
            <p className="text-sm text-slate-400 mb-2">
                Upload a CSV or add entries manually, then filter by date or category.
            </p>
            <CsvUpload onUploaded={loadTransactions} />
            <TransactionForm onAdded={loadTransactions} />
            <TransactionFilters
                filters={filters}
                setFilters={setFilters}
                onApply={loadTransactions}
            />
            <TransactionTable transactions={transactions} />
        </div>
    );
}
