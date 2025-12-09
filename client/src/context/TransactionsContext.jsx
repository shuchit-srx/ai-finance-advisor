import { createContext, useContext, useState, useCallback } from "react";
import api from "../lib/api";

const TransactionsContext = createContext(null);

export const TransactionsProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    category: "all",
  });
  const [loading, setLoading] = useState(false);

  const fetchTransactions = useCallback(
    async (override = {}) => {
      try {
        setLoading(true);
        const params = { ...filters, ...override };
        const { data } = await api.get("/transactions", { params });
        setTransactions(data || []);
      } catch (err) {
        console.error("Fetch transactions error:", err);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  const addTransaction = async (payload, duplicateMode = "skip") => {
    try {
      const { data } = await api.post("/transactions", {
        ...payload,
        duplicateMode,
      });

      setTransactions((prev) => [data, ...(prev || [])]);

      return { success: true, data };
    } catch (err) {
      console.error("Add transaction error:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to add transaction",
      };
    }
  };

  const uploadCSV = async (file, mode = "skip") => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await api.post(
        `/transactions/upload?mode=${mode}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      await fetchTransactions();

      return {
        success: true,
        data,
        status: 200,
      };
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;

      if (status === 409) {
        console.warn("CSV upload: all rows duplicate or invalid", data);

        await fetchTransactions();

        return {
          success: true,
          status: 409,
          data,
        };
      }

      console.error("CSV upload error:", err);
      return {
        success: false,
        status,
        message: data?.message || "CSV upload failed",
      };
    }
  };

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        filters,
        setFilters,
        loading,
        fetchTransactions,
        addTransaction,
        uploadCSV,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const ctx = useContext(TransactionsContext);
  if (!ctx) throw new Error("useTransactions must be used within provider");
  return ctx;
};
