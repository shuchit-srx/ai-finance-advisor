import { NavLink } from "react-router-dom";

const links = [
    { label: "Dashboard", to: "/" },
    { label: "Transactions", to: "/transactions" },
    { label: "History", to: "/history" },
    { label: "Settings", to: "/settings" },
];

export default function Sidebar() {
    return (
        <aside className="hidden md:flex fixed top-16 left-0 h-[calc(100vh-4rem)] w-56 border-r border-slate-800 bg-slate-950/70 backdrop-blur-xl">
            <nav className="w-full py-4">
                <ul className="space-y-1">
                    {links.map((item) => (
                        <li key={item.to}>
                            <NavLink
                                to={item.to}
                                className={({ isActive }) =>
                                    [
                                        "flex items-center gap-2 px-5 py-2.5 text-sm transition",
                                        isActive
                                            ? "bg-slate-800 text-slate-50"
                                            : "text-slate-400 hover:bg-slate-900 hover:text-slate-100",
                                    ].join(" ")
                                }
                            >
                                <span>{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}
