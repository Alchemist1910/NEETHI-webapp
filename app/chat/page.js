"use client";
import { useState } from "react";
import Navbar from "../components/Navbar";

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const sendMessage = () => {
        if (!input) return;
        setMessages([...messages, { text: input, sender: "user" }]);
        setInput("");
    };

    return (
        <>
            <Navbar />
            <div className="p-10 max-w-3xl mx-auto">
                <div className="bg-neutral-900 h-96 overflow-y-auto p-4 rounded-lg border border-white/20">
                    {messages.map((msg, index) => (
                        <div key={index} className="mb-3 text-white">
                            {msg.text}
                        </div>
                    ))}
                </div>

                <div className="flex mt-4">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 p-3 bg-black border border-white/20 rounded-l"
                        placeholder="Ask your legal question..."
                    />

                    <button
                        onClick={sendMessage}
                        className="px-6 bg-white text-black rounded-r"
                    >
                        Send
                    </button>
                </div>
            </div>
        </>
    );
}