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
        setError("");
        const res = await register(form.name, form.email, form.password);
        if (!res.success) setError(res.message);
        else navigate("/");
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden">
            {/* Background gradients */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-32 -left-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="absolute -bottom-32 -right-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
                <div className="absolute top-1/2 -translate-y-1/2 right-1/3 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
            </div>

            <div className="relative w-full max-w-md px-4 sm:px-6">
                {/* Logo + heading */}
                <div className="mb-6 text-center">
                    <div className="inline-flex items-center justify-center mb-3">
                        <img src="/icon.png" alt="icon" className="h-12" />
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Create your{" "}
                        <span className="text-emerald-400">FinSightAI</span>{" "}
                        account
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Set up your profile to start getting personal spending insights.
                    </p>
                </div>

                {/* Card */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 shadow-[0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-xl"
                >
                    <div className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-xs font-medium mb-1.5 text-slate-300">
                                Name
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Swishy"
                                    className="w-full rounded-lg bg-slate-900/80 border border-slate-700 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-500"
                                />
                            </div>
                        </div>

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
                                    placeholder="At least 6 characters"
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
                            {loading ? "Creating..." : "Create account"}
                        </button>
                    </div>

                    <p className="text-xs text-slate-400 text-center mt-4">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-emerald-400 hover:text-emerald-300 hover:underline"
                        >
                            Log in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
