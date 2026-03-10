"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function LegalNews() {

    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/legal-news", { cache: "no-store" })
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setNews(data);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    // Color palette for cards without images
    const cardColors = [
        "bg-gradient-to-br from-amber-900/40 to-[#1a1a1a]",
        "bg-gradient-to-br from-emerald-900/40 to-[#1a1a1a]",
        "bg-gradient-to-br from-blue-900/40 to-[#1a1a1a]",
        "bg-gradient-to-br from-rose-900/40 to-[#1a1a1a]",
        "bg-gradient-to-br from-purple-900/40 to-[#1a1a1a]",
        "bg-gradient-to-br from-cyan-900/40 to-[#1a1a1a]",
    ];

    return (
        <div className="bg-[#0a0a0a] min-h-screen text-white">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-8">

                <h1 className="text-3xl font-bold mb-8">Latest Legal News</h1>

                {loading ? (
                    <div className="flex justify-center items-center h-60">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    </div>
                ) : news.length === 0 ? (
                    <p className="text-gray-400 text-center">No news available right now.</p>
                ) : (
                    <div className="columns-1 md:columns-2 gap-5 space-y-5">
                        {news.map((item, index) => (
                            <a
                                key={index}
                                href={item.link || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block break-inside-avoid group"
                            >
                                <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/5 hover:border-white/15 transition-all duration-300">

                                    {/* Source Header */}
                                    <div className="flex items-center justify-between px-4 pt-4 pb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-red-700 rounded-full flex items-center justify-center font-bold text-white text-sm">
                                                L
                                            </div>
                                            <span className="text-sm font-medium text-white">{item.source || "LiveLaw.in"}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500 px-3 py-1 bg-white/5 rounded-full">Follow</span>
                                            <button className="text-gray-500 hover:text-white transition" onClick={(e) => e.preventDefault()}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Image Area */}
                                    {item.image ? (
                                        <div className="w-full h-48 overflow-hidden relative">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                            {/* Source overlay on image */}
                                            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
                                                {item.source || "livelaw.in"}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={`w-full h-32 ${cardColors[index % cardColors.length]} flex items-center justify-center`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.5} stroke="currentColor" className="w-16 h-16 text-white/10">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6V7.5Z" />
                                            </svg>
                                        </div>
                                    )}

                                    {/* Title & Description */}
                                    <div className="px-4 pt-3 pb-2">
                                        <h2 className="text-base font-bold leading-snug group-hover:text-gray-200 transition">
                                            {item.title}
                                        </h2>
                                        {item.description && (
                                            <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                                                {item.description} <span className="text-gray-500">See more</span>
                                            </p>
                                        )}
                                    </div>

                                    {/* Footer Actions */}
                                    <div className="flex items-center justify-between px-4 pb-4 pt-1">
                                        <span className="text-xs text-gray-500">{item.time || "1d"}</span>
                                        <div className="flex items-center gap-4">
                                            {/* Heart icon */}
                                            <button className="text-gray-500 hover:text-red-400 transition" onClick={(e) => e.preventDefault()}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                                </svg>
                                            </button>
                                            {/* Share icon */}
                                            <button className="text-gray-500 hover:text-white transition" onClick={(e) => e.preventDefault()}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}