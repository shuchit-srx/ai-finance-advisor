import { useState } from "react";
import { useTransactions } from "../../context/TransactionsContext";

export default function CsvUpload({ onUploaded }) {
  const { uploadCSV } = useTransactions();

  const [file, setFile] = useState(null);
  const [duplicateMode, setDuplicateMode] = useState("skip");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setResult("Please select a CSV file first.");
      return;
    }

    setLoading(true);
    setResult("");

    const res = await uploadCSV(file, duplicateMode);

    if (!res.success) {
      setResult(res.message || "Upload failed.");
    } else {
      if (res.status === 409) {
        setResult(
          res.data?.message ||
          "No new transactions added (all rows were duplicates)."
        );
      } else {
        const inserted = res.data?.insertedCount ?? 0;
        const dup = res.data?.duplicateCount ?? 0;
        onUploaded();
        setResult(
          `Uploaded ${inserted} rows.`
        );
      }
    }

    setLoading(false);
  };

  return (
    <div className="p-4 mt-4 rounded-xl border border-slate-800 bg-slate-900/70">
      <div className="flex gap-1.5 mb-3 items-end font-bold text-slate-400">
        <p className="text-sm uppercase font-bold">Upload CSV</p>
        <p className="text-[9px] italic">[YYYY-MM-DD, description, amount]</p>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <label
          className="px-4 py-2 rounded-lg cursor-pointer bg-slate-800 
                     border border-slate-700 text-slate-200 text-sm hover:bg-slate-700"
        >
          Choose File
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>

        <span className="text-xs text-slate-400">
          {file ? file.name : "No file selected"}
        </span>
      </div>

      <div className="text-xs text-slate-400 mb-4">
        <label className="mr-3">
          <input
            type="radio"
            value="skip"
            checked={duplicateMode === "skip"}
            onChange={() => setDuplicateMode("skip")}
            className="mr-1 align-middle"
          />
          Skip duplicates
        </label>

        <label>
          <input
            type="radio"
            value="allow"
            checked={duplicateMode === "allow"}
            onChange={() => setDuplicateMode("allow")}
            className="mr-1 align-middle"
          />
          Allow duplicates
        </label>
      </div>

      <button
        onClick={handleUpload}
        disabled={loading}
        className="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-500 
                   text-slate-950 hover:bg-emerald-400 
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Uploading..." : "Upload CSV"}
      </button>

      {result && (
        <p className="mt-3 text-xs text-amber-200 whitespace-pre-line">
          {result}
        </p>
      )}
    </div>
  );
}
