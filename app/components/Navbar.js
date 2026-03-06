"use client";
import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="w-full border-b border-white/20 px-10 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-wider">NEETHI</h1>

            <div className="space-x-6">
                <Link href="/">Home</Link>
                <Link href="/lawyers">Lawyers</Link>
                <Link href="/chat">Chat</Link>
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/login">
                    <button className="px-4 py-2 bg-white text-black rounded-lg">
                        Login
                    </button>
                </Link>
            </div>
        </nav>
    );
}