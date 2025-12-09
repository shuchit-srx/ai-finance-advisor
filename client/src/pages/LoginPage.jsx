import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
    const { login, loading } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) =>
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const res = await login(form.email, form.password);
        if (!res.success) setError(res.message);
        else navigate("/");
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden">
            {/* Background gradients */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-32 -left-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="absolute -bottom-32 -right-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
                <div className="absolute top-1/2 -translate-y-1/2 left-1/4 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
            </div>

            <div className="relative w-full max-w-md px-4 sm:px-6">
                {/* Logo + heading */}
                <div className="mb-6 text-center">
                    <div className="inline-flex items-center justify-center mb-3">
                        <img src="/icon.png" alt="icon" className="h-12" />
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Welcome back to{" "}
                        <span className="text-emerald-400">FinSightAI</span>
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Log in to see your dashboard and spending insights.
                    </p>
                </div>

                {/* Card */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 shadow-[0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-xl"
                >
                    <div className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block text-xs font-medium mb-1.5 text-slate-300">
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className="w-full rounded-lg bg-slate-900/80 border border-slate-700 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-500"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-medium mb-1.5 text-slate-300">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    className="w-full rounded-lg bg-slate-900/80 border border-slate-700 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-500"
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-xs text-rose-400 bg-rose-950/40 border border-rose-900 rounded-lg px-3 py-2">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="cursor-pointer w-full mt-2 py-2.5 rounded-lg bg-emerald-500 text-slate-950 text-sm font-medium hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-[0_0_25px_rgba(16,185,129,0.55)]"
                        >
                            {loading ? "Logging in..." : "Log in"}
                        </button>
                    </div>

                    <p className="text-xs text-slate-400 text-center mt-4">
                        Don&apos;t have an account yet?{" "}
                        <Link
                            to="/register"
                            className="text-emerald-400 hover:text-emerald-300 hover:underline"
                        >
                            Create one
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
