import Navbar from "../components/layout/Navbar.jsx";
import Sidebar from "../components/layout/Sidebar.jsx";
import ChatWidget from "../components/chat/ChatWidget.jsx";

export default function AppLayout({ children }) {
    return (
        <>
            <Navbar />
            <div className="flex pt-16">
                <Sidebar />
                <main className="flex-1 px-4 md:px-8 lg:px-10 pb-10 md:ml-56">
                    {children}
                </main>
                <ChatWidget />
            </div>
        </>
    );
}
