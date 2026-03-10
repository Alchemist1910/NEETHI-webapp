"use client";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function HomeDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-[#111] text-white min-h-screen">
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center px-6">
        <h1 className="text-6xl font-bold tracking-wide mb-6">NEETHI</h1>

        <p className="text-gray-400 max-w-2xl text-lg mb-10 leading-relaxed">
          AI-Powered Legal Awareness Platform designed to simplify Indian
          legal knowledge and connect citizens with verified lawyers.
        </p>

        <div className="flex gap-4 mb-4">
          <Link href="/chat">
            <button className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition">
              Ask Legal Question
            </button>
          </Link>

          <Link href="/lawyers">
            <button className="px-6 py-3 border border-white bg-transparent text-white font-semibold rounded-lg hover:bg-white/10 transition">
              Find a Lawyer
            </button>
          </Link>
        </div>

        {/* Create Account Box - Only visible to non-logged-in users (citizens) */}
        {!loading && !user && (
          <div className="mt-12 bg-[#1a1a1a] p-8 rounded-2xl border border-white/10 max-w-md w-full shadow-2xl relative z-0">
            <h3 className="text-2xl font-bold mb-3 text-white">Join as a Citizen</h3>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Create a free account to securely save your legal queries, track progress, and seamlessly connect with verified lawyers.
            </p>
            <Link href="/register?role=citizen">
              <button className="w-full py-4 bg-transparent border border-white text-white font-bold rounded-xl hover:bg-white hover:text-black transition duration-300">
                Create Account
              </button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
