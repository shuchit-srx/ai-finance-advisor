import { useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useChat } from "../../context/ChatContext";


const links = [
    { label: "Dashboard", to: "/" },
    { label: "Transactions", to: "/transactions" },
    { label: "History", to: "/history" },
    { label: "Settings", to: "/settings" },
];

export default function Navbar() {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);

    const initials = useMemo(() => {
        if (!user?.name) return "";
        return user.name
            .split(" ")
            .map((p) => p[0]?.toUpperCase())
            .slice(0, 2)
            .join("");
    }, [user]);

    const toggle = () => setOpen((v) => !v);
    const close = () => setOpen(false);

    const { openChat } = useChat();

    return (
        <header className="fixed top-0 inset-x-0 z-40">
            {/* Main bar */}
            <div className="border-b border-slate-800/90 bg-linear-to-r from-slate-950/95 via-slate-950/90 to-slate-900/95 backdrop-blur-xl shadow-[0_10px_40px_rgba(15,23,42,0.9)]">
                <div className="mx-auto px-6 py-3 flex items-center justify-between gap-3 md:px-10">
                    {/* Brand */}
                    <div className="flex items-center gap-2">
                        <img src="/icon.png" alt="icon" className="h-7" />
                        <div className="flex flex-col leading-tight">
                            <span className="text-sm font-semibold tracking-tight">
                                FinSight<span className="text-emerald-400">AI</span>
                            </span>
                            <span className="text-[11px] text-slate-400">
                                AI-powered financial advisor
                            </span>
                        </div>
                    </div>

                    {/* Desktop right side */}
                    {user && (
                        <div className="hidden md:flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[11px] font-semibold text-slate-100">
                                    {initials || "U"}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-medium text-slate-100">
                                        {user.name}
                                    </span>
                                    <span className="text-[11px] text-slate-400">
                                        Signed in · {new Date().toLocaleDateString("en-IN", {
                                            day: "2-digit",
                                            month: "short",
                                        })}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={logout}
                                className="px-3 py-1.5 rounded-lg 
    border border-red-600/40 
    bg-red-600/10
    text-xs font-medium text-red-300 
    backdrop-blur-sm
    transition-all duration-200
    hover:bg-red-600/20 
    hover:border-red-500/60 
    hover:text-red-200
    active:bg-red-600/30
    cursor-pointer
  "
                            >
                                Logout
                            </button>
                        </div>
                    )}

                    {/* Mobile controls */}
                    {user && (
                        <div className="flex items-center gap-2 md:hidden">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[11px] font-semibold text-slate-100">
                                    {initials || "U"}
                                </div>

                            </div>
                            <button
                                onClick={logout}
                                className="px-3 py-1.5 rounded-lg 
    border border-red-600/40 
    bg-red-600/10
    text-xs font-medium text-red-300 
    backdrop-blur-sm
    transition-all duration-200
    hover:bg-red-600/20 
    hover:border-red-500/60 
    hover:text-red-200
    active:bg-red-600/30
    cursor-pointer"
                            >
                                Logout
                            </button>
                            <button
                                onClick={toggle}
                                className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-slate-700 text-slate-200 hover:bg-slate-800 transition"
                            >
                                <span className="sr-only">Toggle navigation</span>
                                <div className="space-y-1.5">
                                    <span className="block h-0.5 w-5 bg-slate-200 rounded-full" />
                                    <span className="block h-0.5 w-5 bg-slate-200 rounded-full" />
                                    <span className="block h-0.5 w-5 bg-slate-200 rounded-full" />
                                </div>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile dropdown menu */}
            {
                user && open && (
                    <nav className="md:hidden border-b border-slate-800/90 bg-slate-950/98 backdrop-blur-xl">
                        <ul className="max-w-6xl mx-auto px-2 py-2 space-y-1">
                            {links.map((item) => (
                                <li key={item.to}>
                                    <NavLink
                                        to={item.to}
                                        onClick={close}
                                        className={({ isActive }) =>
                                            [
                                                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
                                                isActive
                                                    ? "bg-slate-800 text-slate-50"
                                                    : "text-slate-300 hover:bg-slate-900 hover:text-slate-50",
                                            ].join(" ")
                                        }
                                    >
                                        <span>{item.label}</span>
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4 mb-3 px-3">
                            <button
                                onClick={() => {
                                    setOpen(false);
                                    openChat();
                                }}
                                className="cursor-pointer mt-4 mb-3 flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-slate-900/60 text-slate-200 bg-linear-to-r from-slate-800/40 to-slate-900/40 border border-slate-800"
                                title="Ask AI about your spending"
                            >
                                <span className="text-lg">💬</span>
                                <span className="font-medium">Fin AI</span>
                                <span className="ml-auto text-xs text-slate-400">Chat</span>
                            </button>
                        </div>
                    </nav>
                )
            }
        </header >
    );
}
