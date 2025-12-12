// client/src/components/layout/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { useChat } from "../../context/ChatContext";

const navItems = [
    { label: "Dashboard", to: "/", icon: "📊" },
    { label: "Transactions", to: "/transactions", icon: "📄" },
    { label: "History", to: "/history", icon: "🕒" },
    { label: "Set Budget", to: "/settings", icon: "⚙️" },
];

export default function Sidebar() {
    const { openChat } = useChat();

    return (
        <aside className="hidden md:flex fixed top-16 left-0 h-[calc(100vh-4rem)] w-60 border-r border-slate-800 bg-linear-to-b from-slate-950/95 via-slate-950/90 to-slate-900/95 backdrop-blur-xl z-30">
            <div className="flex flex-col w-full">
                <div className="px-5 py-4">
                    <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
                        Overview
                    </p>
                </div>

                <nav className="space-y-1 flex-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                [
                                    "group flex items-center gap-3 mx-2 px-4 py-2.5 text-sm rounded-xl border transition-all duration-200",
                                    isActive
                                        ? "active border-emerald-500/50 bg-slate-900/90 text-slate-50 shadow-[0_0_10px_rgba(16,185,129,0.25)]"
                                        : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 hover:border-slate-800",
                                ].join(" ")
                            }
                        >
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-4 mb-3 px-3">
                    <button
                        onClick={openChat}
                        className="cursor-pointer mt-4 mb-3 flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-slate-900/60 text-slate-200 bg-gradient-to-r from-slate-800/40 to-slate-900/40 border border-slate-800"
                        title="Ask AI about your spending"
                    >
                        <span className="text-lg">💬</span>
                        <span className="font-medium">Fin AI</span>
                        <span className="ml-auto text-xs text-slate-400">Chat</span>
                    </button>
                </div>

                <div className="border-t border-slate-800/80 px-4 py-4">
                    <div className="rounded-2xl bg-slate-900/80 border border-slate-800 px-3 py-3">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="h-6 w-6 rounded-xl bg-linear-to-br from-emerald-500/80 to-cyan-400/80 flex items-center justify-center text-[11px] font-semibold text-slate-950 shadow-[0_0_18px_rgba(45,212,191,0.5)]">
                                AI
                            </div>
                            <p className="text-xs font-medium text-slate-100">Spending coach</p>
                        </div>
                        <p className="text-[11px] leading-snug text-slate-400">
                            Analyses your activity and suggests smarter ways to spend & save.
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
