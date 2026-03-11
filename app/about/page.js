"use client";
import Navbar from "../components/Navbar";
import Link from "next/link";
import Image from "next/image";

export default function About() {
    return (
        <div className="bg-[#0a0a0a] text-white min-h-screen font-serif flex flex-col">
            <Navbar />

            <main className="flex-grow flex flex-col items-center px-6 py-16 max-w-6xl mx-auto w-full">

                {/* Hero Section */}
                <div className="text-center mb-20 animate-fade-in-up">
                    <h1 className="text-5xl md:text-7xl font-anton tracking-widest mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
                        ABOUT NEETHI
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 font-light tracking-wide max-w-3xl mx-auto leading-relaxed">
                        Where law meets technology to empower citizens with accessible legal knowledge and connect them with trusted professionals.
                    </p>
                </div>

                {/* Mission Section */}
                <div className="w-full flex flex-col md:flex-row items-center gap-12 md:gap-20 mb-24">
                    <div className="md:w-1/2 flex justify-center">
                        <div className="relative w-64 h-64 md:w-96 md:h-96">
                            {/* Decorative glow behind image */}
                            <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full"></div>
                            <Image
                                src="/image-removebg-preview.png"
                                fill
                                alt="Neethi Mission"
                                className="object-contain drop-shadow-2xl relative z-10"
                            />
                        </div>
                    </div>
                    <div className="md:w-1/2 space-y-6">
                        <h2 className="text-3xl font-bold tracking-wider mb-4 border-b border-white/20 pb-4 inline-block">OUR MISSION</h2>
                        <p className="text-lg text-gray-300 leading-relaxed">
                            The Indian legal system, while robust, often feels complex and inaccessible to the everyday citizen. NEETHI was born out of a desire to bridge this gap.
                        </p>
                        <p className="text-lg text-gray-300 leading-relaxed">
                            We are an AI-powered legal awareness platform designed to democratize legal information. By translating dense legal concepts into plain language, we empower individuals to understand their rights and duties.
                        </p>
                    </div>
                </div>

                {/* Offerings Grid */}
                <div className="w-full mb-24">
                    <h2 className="text-3xl font-bold tracking-wider text-center mb-16">WHAT WE DO</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="bg-[#151515] border border-white/10 p-8 rounded-2xl hover:bg-[#1a1a1a] hover:border-white/30 transition-all duration-300 flex flex-col items-center text-center group">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 tracking-wide">AI Legal Assistant</h3>
                            <p className="text-gray-400 flex-grow">
                                Ask everyday legal questions and get simplified, accurate answers powered by advanced artificial intelligence tailor-made for Indian Law.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-[#151515] border border-white/10 p-8 rounded-2xl hover:bg-[#1a1a1a] hover:border-white/30 transition-all duration-300 flex flex-col items-center text-center group md:-translate-y-4">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 tracking-wide">Verified Network</h3>
                            <p className="text-gray-400 flex-grow">
                                Browse our curated directory of verified legal professionals and advocates to find the right representation for your specific needs.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-[#151515] border border-white/10 p-8 rounded-2xl hover:bg-[#1a1a1a] hover:border-white/30 transition-all duration-300 flex flex-col items-center text-center group">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6V7.5Z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 tracking-wide">Real-time News</h3>
                            <p className="text-gray-400 flex-grow">
                                Keep up with the latest legal happenings, judgements, and amendments from the Supreme Court and High Courts across India.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center bg-white/5 border border-white/10 p-10 md:p-16 rounded-3xl w-full mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-widest mb-6">READY TO EXPLORE?</h2>
                    <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
                        Whether you need legal advice, want to find a lawyer, or just wish to stay informed, NEETHI is your gateway.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link href="/role">
                            <button className="px-10 py-4 bg-white text-black font-bold tracking-wider rounded-full hover:bg-gray-200 transition-colors shadow-lg shadow-white/10 w-full sm:w-auto">
                                GET STARTED
                            </button>
                        </Link>
                        <Link href="/lawyers">
                            <button className="px-10 py-4 bg-transparent border border-white/50 text-white font-bold tracking-wider rounded-full hover:bg-white/10 transition-colors w-full sm:w-auto">
                                FIND A LAWYER
                            </button>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
