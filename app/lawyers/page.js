"use client";

import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function Lawyers() {
    const [lawyers, setLawyers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Real-time listener on all users, filter client-side for lawyers
        // This avoids the need for a Firestore composite index on "lawyerid"
        const unsubscribe = onSnapshot(
            collection(db, "users"),
            (snapshot) => {
                const lawyersList = [];
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    // Only include users who have a non-empty lawyerid
                    if (data.lawyerid && data.lawyerid.trim() !== "") {
                        lawyersList.push({ id: doc.id, ...data });
                    }
                });
                console.log("Lawyers fetched:", lawyersList.length, lawyersList);
                setLawyers(lawyersList);
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching lawyers:", error);
                setLoading(false);
            }
        );

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, []);

    return (
        <div className="bg-[#0a0a0a] min-h-screen text-white">
            <Navbar />
            
            <div className="p-10 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold mb-8">Available Lawyers</h2>
                
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    </div>
                ) : lawyers.length === 0 ? (
                    <p className="text-gray-400">No lawyers found in the system yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {lawyers.map((lawyer) => (
                            <div
                                key={lawyer.id}
                                className="bg-[#222] rounded-3xl overflow-hidden shadow-lg border border-white/5 flex flex-col relative group"
                            >
                                {/* Top colored section */}
                                <div className="bg-[#e2e4b1] h-56 w-full relative flex justify-center items-end overflow-hidden">
                                   <div className="w-56 h-56 z-10 relative">
                                        {/* Using regular img to avoid Next.js image optimization issues with SVG */}
                                        <img 
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${lawyer.uid || lawyer.name}&backgroundColor=transparent`}
                                            alt={lawyer.name || "Lawyer"}
                                            className="w-full h-full object-cover object-bottom"
                                        />
                                   </div>
                                </div>
                                
                                {/* Bottom dark section */}
                                <div className="bg-[#2a2a2a] pt-6 pb-6 px-6 flex-grow flex flex-col relative z-0">
                                    <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                                        Adv. {lawyer.name || "Unknown"}
                                    </h3>
                                    
                                    <div className="space-y-1 mt-1 mb-8">
                                        <p className="text-sm text-gray-200 font-medium">
                                            Languages: English, Hindi
                                        </p>
                                        <p className="text-sm text-gray-200 font-medium line-clamp-1">
                                            Location: {lawyer.officeAddress || "Not specified"}
                                        </p>
                                        <p className="text-sm text-gray-200 font-medium">
                                            ID: {lawyer.lawyerid}
                                        </p>
                                    </div>
                                    
                                    <div className="mt-auto flex justify-end">
                                        <button className="flex items-center gap-2 px-5 py-2 bg-black text-white rounded-full text-sm font-bold hover:bg-white hover:text-black transition">
                                            Connect
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}