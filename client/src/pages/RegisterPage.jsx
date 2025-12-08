import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const { register, loading } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) =>
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await register(form.name, form.email, form.password);
        if (!res.success) setError(res.message);
        else navigate("/");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
            <div className="w-full max-w-md px-6">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-semibold">
                        Create your <span className="text-emerald-400">FinSightAI</span>{" "}
                        account
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Start tracking and improving your spending habits.
                    </p>
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 shadow-lg"
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium mb-1 text-slate-300">
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1 text-slate-300">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1 text-slate-300">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        {error && (
                            <p className="text-xs text-rose-400 bg-rose-950/40 border border-rose-900 rounded-lg px-3 py-2">
                                {error}
                            </p>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 py-2.5 rounded-lg bg-emerald-500 text-slate-950 text-sm font-medium hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
                        >
                            {loading ? "Creating..." : "Create account"}
                        </button>
                    </div>
                    <p className="text-xs text-slate-400 text-center mt-4">
                        Already have an account?{" "}
                        <Link to="/login" className="text-emerald-400 hover:underline">
                            Log in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
