// client/src/components/chat/ChatWidget.jsx
import React, { useEffect, useRef, useState } from "react";
import { useChat } from "../../context/ChatContext.jsx";
import api from "../../lib/api.js";

function Avatar({ who = "bot" }) {
  return (
    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold ${who === "bot" ? "bg-emerald-400 text-slate-900" : "bg-slate-800 text-slate-200"}`}>
      {who === "bot" ? "AI" : "U"}
    </div>
  );
}

function Bubble({ who = "bot", text }) {
  const isBot = who === "bot";
  const bubble = isBot ? "bg-slate-800 text-slate-200" : "bg-emerald-500 text-slate-900";
  return (
    <div className={`max-w-[85%] ${isBot ? "self-start" : "self-end"} ${bubble} px-4 py-2 rounded-2xl text-sm`} style={{ whiteSpace: "pre-wrap" }}>
      {text}
    </div>
  );
}

export default function ChatWidget() {
  const { open, closeChat, toggleChat } = useChat();
  const [messages, setMessages] = useState([
    { id: "b0", who: "bot", text: "Hi — ask me about your spending, e.g. 'How much did I spend on food today?'" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [includeContext, setIncludeContext] = useState(true);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open, loading]);

  const sendMessage = async (ev) => {
    if (ev) ev.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    const userMsg = { id: `u-${Date.now()}`, who: "user", text: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await api.post("/chat/query", { message: trimmed, includeContext });
      const reply = data?.reply || "I couldn't compute a reply.";
      setMessages((m) => [...m, { id: `b-${Date.now()}`, who: "bot", text: reply }]);
    } catch (err) {
      console.error("Chat error", err);
      const msg = err?.response?.data?.message || err.message || "Chat failed";
      setMessages((m) => [...m, { id: `b-err-${Date.now()}`, who: "bot", text: `⚠ ${msg}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed right-5 bottom-5 z-50">
      <div className="flex justify-end mb-2">
        <button onClick={toggleChat} className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-sm text-slate-200 shadow">
          {open ? "Close" : "Chat"}
        </button>
      </div>

      {open && (
        <div className="w-[360px] md:w-[420px] flex flex-col bg-slate-950 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-xl bg-linear-to-br from-emerald-500/80 to-cyan-400/80 flex items-center justify-center text-[11px] font-semibold text-slate-950 shadow-[0_0_18px_rgba(45,212,191,0.5)]">
                AI
              </div>
              <div>
                <div className="text-sm font-semibold">Fin AI</div>
                <div className="text-xs text-slate-400">Ask about your spending</div>
              </div>
            </div>
            <div className="text-xs text-slate-400">{includeContext ? "Context: on" : "Context: off"}</div>
          </div>

          {/* Messages */}
          <div ref={listRef} className="h-72 px-4 py-3 overflow-auto space-y-3 bg-slate-950">
            <div className="flex flex-col gap-3">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.who === "bot" ? "justify-start" : "justify-end"} items-start gap-3`}>
                  {m.who === "bot" && <Avatar who="bot" />}
                  <Bubble who={m.who === "bot" ? "bot" : "user"} text={m.text} />
                  {m.who !== "bot" && <Avatar who="user" />}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-3">
                  <Avatar who="bot" />
                  <div className="bg-slate-800 px-4 py-2 rounded-xl text-slate-300 text-sm animate-pulse">AI typing...</div>
                </div>
              )}
            </div>
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="px-3 py-3 border-t border-slate-800 bg-slate-950/90">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='e.g. "Spent on food today?"'
                className="flex-1 bg-slate-900 border border-slate-700 rounded-full px-4 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button type="submit" disabled={loading} className="px-3 py-2 rounded-full bg-emerald-500 text-slate-900 font-semibold text-sm hover:bg-emerald-400 disabled:opacity-60">
                Send
              </button>
            </div>

            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={includeContext} onChange={(e) => setIncludeContext(e.target.checked)} className="accent-emerald-400" />
                Include recent transactions
              </label>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setInput("How much did I spend on food today?"); setTimeout(() => sendMessage(), 150); }}
                  className="text-xs px-2 py-1 rounded border border-slate-700 bg-slate-800 text-slate-200"
                >
                  Example
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
