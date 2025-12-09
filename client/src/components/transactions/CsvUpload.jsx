import { useState } from "react";
import { useTransactions } from "../../context/TransactionsContext";

export default function CsvUpload({ onUploaded }) {   // ✅ accept callback
    const { uploadCSV } = useTransactions();

    const [file, setFile] = useState(null);
    const [duplicateMode, setDuplicateMode] = useState("skip");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");

    const handleUpload = async () => {
        if (!file) return setResult("Please select a CSV file first.");

        setLoading(true);
        setResult("");

        try {
            const res = await uploadCSV(file, duplicateMode);
            setResult(`Uploaded ${res.insertedCount} rows successfully`);

            if (onUploaded) onUploaded();   // ✅ refresh transactions
        } catch (err) {
            console.error("Upload Error:", err);

            if (err.response?.status === 409) {
                setResult("Duplicate transactions detected. Change mode to 'allow' to upload.");
            } else {
                setResult("Upload failed.");
            }
        }

        setLoading(false);
    };

    return (
        <div className="p-4 mt-4 rounded-xl border border-slate-800 bg-slate-900/70">
            <div className="flex gap-1 mb-3 items-end font-bold text-slate-400">
                <p className="text-sm uppercase ">Upload CSV </p>
                <p className="text-[8px] italic"> [YYYY-MM-DD, description, amount]</p>
            </div>

            <div className="flex items-center gap-3 mb-4">
                <label
                    className="px-4 py-2 rounded-lg cursor-pointer bg-slate-800 
                     border border-slate-700 text-slate-200 text-sm hover:bg-slate-700"
                >
                    Choose File
                    <input type="file" accept=".csv" className="hidden"
                        onChange={(e) => setFile(e.target.files[0])} />
                </label>

                <span className="text-xs text-slate-400">
                    {file ? file.name : "No file selected"}
                </span>
            </div>

            <div className="text-xs text-slate-400 mb-3">
                <label className="mr-3">
                    <input type="radio" value="skip"
                        checked={duplicateMode === "skip"}
                        onChange={() => setDuplicateMode("skip")}
                        className="mr-1"
                    />
                    Skip duplicates
                </label>

                <label>
                    <input type="radio" value="allow"
                        checked={duplicateMode === "allow"}
                        onChange={() => setDuplicateMode("allow")}
                        className="mr-1"
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
                <p className="mt-3 text-xs text-slate-300">{result}</p>
            )}
        </div>
    );
}
