"use client";

import { useState } from "react";

export default function ChatPage() {

    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Hello! I'm your AI legal assistant. Ask me anything about Indian law."
        }
    ]);

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    async function sendMessage() {

        if (!input.trim()) return;

        const question = input.trim();

        setMessages(prev => [
            ...prev,
            { role: "user", content: question }
        ]);

        setInput("");
        setLoading(true);

        try {

            const response = await fetch("http://127.0.0.1:8000/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    question: question
                })
            });

            const data = await response.json();

            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content: data.answer
                }
            ]);

        } catch (error) {

            console.error(error);

            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content: "⚠️ AI server not reachable."
                }
            ]);

        }

        setLoading(false);
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    }

    return (

        <div style={{ padding: "40px", fontFamily: "Arial" }}>

            <h1>AI Legal Chat</h1>

            <div
                style={{
                    border: "1px solid #ccc",
                    height: "400px",
                    overflowY: "auto",
                    padding: "20px",
                    marginBottom: "20px"
                }}
            >

                {messages.map((msg, i) => (
                    <div
                        key={i}
                        style={{
                            textAlign: msg.role === "user" ? "right" : "left",
                            marginBottom: "10px"
                        }}
                    >
                        <b>{msg.role === "user" ? "You" : "AI"}:</b> {msg.content}
                    </div>
                ))}

                {loading && <p>AI is thinking...</p>}

            </div>

            <div style={{ display: "flex", gap: "10px" }}>

                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a legal question..."
                    style={{ flex: 1, padding: "10px" }}
                />

                <button
                    onClick={sendMessage}
                    style={{ padding: "10px 20px" }}
                >
                    Send
                </button>

            </div>

        </div>
    );
}