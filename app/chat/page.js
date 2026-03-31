"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";

export default function ChatPage() {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Hello! I'm your AI legal assistant. Ask me anything about Indian law."
        }
    ]);
    const [input, setInput]   = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef             = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    async function sendMessage() {
        if (!input.trim() || loading) return;
        const question = input.trim();
        setMessages(prev => [...prev, { role: "user", content: question }]);
        setInput("");
        setLoading(true);

        try {
            const res  = await fetch("http://127.0.0.1:8000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question }),
            });
            const data = await res.json();
            setMessages(prev => [...prev, { role: "assistant", content: data.answer }]);
        } catch {
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "⚠️ AI server not reachable. Please make sure the backend is running.",
            }]);
        }
        setLoading(false);
    }

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                .chat-page { font-family: 'Inter', sans-serif; min-height: 100vh; background: #0a0a0a; color: #fff; display: flex; flex-direction: column; }
                .chat-body  { flex: 1; display: flex; flex-direction: column; max-width: 800px; width: 100%; margin: 0 auto; padding: 32px 20px 20px; }
                .chat-header { margin-bottom: 28px; }
                .chat-messages { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; padding-bottom: 20px; }
                .msg-row { display: flex; }
                .msg-row.user { justify-content: flex-end; }
                .msg-row.assistant { justify-content: flex-start; }
                .msg-bubble { max-width: 72%; padding: 13px 18px; border-radius: 18px; font-size: 14px; line-height: 1.65; }
                .msg-bubble.user { background: #fff; color: #000; border-bottom-right-radius: 4px; }
                .msg-bubble.assistant { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); color: #e2e2e2; border-bottom-left-radius: 4px; }
                .chat-input-row { display: flex; gap: 12px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08); margin-top: 8px; }
                .chat-input { flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 13px 18px; color: #fff; font-family: inherit; font-size: 14px; outline: none; transition: border-color .2s; }
                .chat-input:focus { border-color: rgba(255,255,255,0.35); }
                .chat-input::placeholder { color: rgba(255,255,255,0.3); }
                .chat-send-btn { padding: 13px 24px; background: #fff; color: #000; border: none; border-radius: 12px; font-weight: 700; font-family: inherit; font-size: 14px; cursor: pointer; transition: background .2s, transform .1s; flex-shrink: 0; }
                .chat-send-btn:hover:not(:disabled) { background: #e8e8e8; transform: translateY(-1px); }
                .chat-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
                @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:1} }
                .typing-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: rgba(255,255,255,0.5); animation: pulse 1.2s infinite; }
                .typing-dot:nth-child(2) { animation-delay: .2s; }
                .typing-dot:nth-child(3) { animation-delay: .4s; }
            `}</style>

            <div className="chat-page">
                <Navbar />

                <div className="chat-body">
                    {/* Header */}
                    <div className="chat-header">
                        <h1 style={{ fontSize: "28px", fontWeight: "800", margin: "0 0 6px", letterSpacing: "1px" }}>
                            AI Legal Chat
                        </h1>
                        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: 0 }}>
                            Ask anything about Indian law — get simplified, accurate answers instantly.
                        </p>
                    </div>

                    {/* Messages */}
                    <div className="chat-messages">
                        {messages.map((msg, i) => (
                            <div key={i} className={`msg-row ${msg.role}`}>
                                {msg.role === "assistant" && (
                                    <div style={{
                                        width: "30px", height: "30px", borderRadius: "50%",
                                        background: "rgba(255,255,255,0.08)",
                                        border: "1px solid rgba(255,255,255,0.12)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        flexShrink: 0, marginRight: "10px", marginTop: "4px", fontSize: "13px"
                                    }}>⚖</div>
                                )}
                                <div className={`msg-bubble ${msg.role}`}>{msg.content}</div>
                            </div>
                        ))}

                        {loading && (
                            <div className="msg-row assistant">
                                <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginRight: "10px", marginTop: "4px", fontSize: "13px" }}>⚖</div>
                                <div className="msg-bubble assistant" style={{ display: "flex", gap: "5px", alignItems: "center", padding: "16px 18px" }}>
                                    <span className="typing-dot" />
                                    <span className="typing-dot" />
                                    <span className="typing-dot" />
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <div className="chat-input-row">
                        <input
                            className="chat-input"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && sendMessage()}
                            placeholder="Ask your legal question…"
                            disabled={loading}
                        />
                        <button className="chat-send-btn" onClick={sendMessage} disabled={loading}>
                            Send ↑
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}