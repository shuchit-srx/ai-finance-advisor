import { useState } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import api from "../../lib/api";

export default function CsvUpload({ onUploaded }) {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => setFile(e.target.files[0]);

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        try {
            const { data } = await api.post("/transactions/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            onUploaded && onUploaded(data);
            setFile(null);
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Card className="p-4 mt-4">
            <p className="text-sm font-medium mb-1">Upload bank statement (CSV)</p>
            <p className="text-xs text-slate-400 mb-3">
                Expected columns: <span className="font-mono">date, description, amount</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <label className="inline-flex items-center px-3 py-2 rounded-lg border border-slate-700 text-sm text-slate-200 hover:bg-slate-800 cursor-pointer">
                    Choose file
                    <input type="file" hidden accept=".csv" onChange={handleFileChange} />
                </label>
                <Button
                    variant="primary"
                    onClick={handleUpload}
                    disabled={!file || uploading}
                >
                    {uploading ? "Uploading..." : "Upload CSV"}
                </Button>
                {file && (
                    <span className="text-xs text-slate-400">{file.name}</span>
                )}
            </div>
        </Card>
    );
}
