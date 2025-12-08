import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <header className="fixed top-0 inset-x-0 z-40 border-b border-slate-800 bg-slate-950/70 backdrop-blur-xl">
            <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-400 flex items-center justify-center text-xs font-bold">
                        ₹
                    </div>
                    <span className="text-lg font-semibold tracking-tight">
                        FinSight<span className="text-emerald-400">AI</span>
                    </span>
                </div>

                {user && (
                    <div className="flex items-center gap-3 text-sm">
                        <span className="text-slate-300 hidden sm:inline">
                            {user.name}
                        </span>
                        <button
                            onClick={logout}
                            className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-200 hover:bg-slate-800 transition text-xs"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
