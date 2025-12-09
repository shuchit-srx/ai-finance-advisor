import { useEffect, useState } from "react";
import api from "../lib/api.js";
import TransactionForm from "../components/transactions/TransactionForm.jsx";
import TransactionBlock from "../components/transactions/TransactionBlock.jsx";
import CsvUpload from "../components/transactions/CsvUpload.jsx";

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        category: "all",
    });

    const loadTransactions = async (overrideFilters = filters) => {
        try {
            const { data } = await api.get("/transactions", {
                params: overrideFilters,
            });
            setTransactions(data);
        } catch (err) {
            console.error("Failed to fetch transactions:", err);
        }
    };

    useEffect(() => {
        loadTransactions();
    }, []);

    const applyFilters = () => {
        loadTransactions(filters);
    };

    return (
        <div className="max-w-6xl mx-auto mt-6 space-y-6">
            <header>
                <h1 className="text-2xl font-semibold tracking-tight">
                    Transactions
                </h1>
                <p className="text-sm text-slate-400">
                    Upload CSV, add entries manually, and review everything in one place.
                </p>
            </header>

            <CsvUpload onUploaded={loadTransactions} />

            <TransactionForm onAdded={loadTransactions} />

            <TransactionBlock
                filters={filters}
                setFilters={setFilters}
                onApply={applyFilters}
                transactions={transactions}
            />
        </div>
    );
}
