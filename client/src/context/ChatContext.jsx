import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
    const [open, setOpen] = useState(false);

    const openChat = () => setOpen(true);
    const closeChat = () => setOpen(false);
    const toggleChat = () => setOpen((v) => !v);

    return (
        <ChatContext.Provider value={{ open, openChat, closeChat, toggleChat }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const ctx = useContext(ChatContext);
    if (!ctx) throw new Error("useChat must be used inside ChatProvider");
    return ctx;
}
