"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Navbar() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    return (
        <nav className="w-full border-b border-white/20 px-10 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-wider">NEETHI</h1>

            <div className="space-x-6 flex items-center">
                <Link href="/home" className="hover:text-gray-300 transition">Home</Link>
                <Link href="/lawyers" className="hover:text-gray-300 transition">Lawyers</Link>
                <Link href="/chat" className="hover:text-gray-300 transition">Chat</Link>
                <Link href="/legal-news" className="hover:text-gray-300 transition">Legal News</Link>

                {user ? (
                    <div className="relative group cursor-pointer ml-4">
                        <div className="w-10 h-10 bg-[#1a1a1a] border border-white/20 text-white rounded-full flex justify-center items-center hover:bg-white hover:text-black transition">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                        </div>
                        {/* Dropdown for logout */}
                        <div className="absolute right-0 mt-2 w-32 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none group-hover:pointer-events-auto z-50">
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-3 text-sm font-semibold text-red-500 hover:bg-neutral-800 rounded-lg transition"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center space-x-4 ml-4">
                        <Link href="/login" className="text-gray-300 hover:text-white transition">
                            Login
                        </Link>
                        <Link href="/role" className="px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition">
                            Create Account
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}