"use client";

import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    query,
    where,
} from "firebase/firestore";

export default function AdminCleanup() {
    const [results, setResults] = useState([]);
    const [done, setDone] = useState(false);
    const [loading, setLoading] = useState(false);

    const runCleanup = async () => {
        setLoading(true);
        setResults([]);
        const log = [];

        try {
            // Get all docs in 'lawyers' collection
            const lawyerSnap = await getDocs(collection(db, "lawyers"));

            for (const docSnap of lawyerSnap.docs) {
                const data = docSnap.data();

                // A real lawyer must have role === "lawyer" AND a non-empty lawyerid
                const isRealLawyer =
                    data.role === "lawyer" &&
                    data.lawyerid &&
                    data.lawyerid.trim() !== "";

                if (!isRealLawyer) {
                    // Move to 'users' collection
                    const userPayload = { ...data, role: "user" };
                    delete userPayload.lawyerid;
                    delete userPayload.officeAddress;
                    delete userPayload.languages;
                    delete userPayload.experience;

                    await addDoc(collection(db, "users"), userPayload);
                    await deleteDoc(doc(db, "lawyers", docSnap.id));

                    log.push({
                        name: data.name || data.uid,
                        action: "✅ Moved to users collection",
                    });
                } else {
                    log.push({
                        name: data.name || data.uid,
                        action: "⚡ Kept in lawyers collection (valid lawyer)",
                    });
                }
            }

            setResults(log);
        } catch (err) {
            setResults([{ name: "ERROR", action: err.message }]);
        }

        setDone(true);
        setLoading(false);
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "#050505",
            color: "#fff",
            fontFamily: "monospace",
            padding: "60px 40px",
        }}>
            <h1 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "8px" }}>
                🛠 NEETHI — Database Cleanup
            </h1>
            <p style={{ color: "#aaa", marginBottom: "32px", fontSize: "14px" }}>
                Moves any non-lawyer profiles from the <code>lawyers</code> collection back to <code>users</code>.
            </p>

            <button
                onClick={runCleanup}
                disabled={loading}
                style={{
                    padding: "12px 28px",
                    background: loading ? "#333" : "#fff",
                    color: "#000",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontSize: "15px",
                    marginBottom: "32px",
                }}
            >
                {loading ? "Running…" : "Run Cleanup Now"}
            </button>

            {results.length > 0 && (
                <div style={{
                    background: "#111",
                    border: "1px solid #333",
                    borderRadius: "12px",
                    padding: "24px",
                }}>
                    <p style={{ color: "#888", marginBottom: "16px", fontSize: "13px" }}>
                        Processed {results.length} document(s):
                    </p>
                    {results.map((r, i) => (
                        <div key={i} style={{
                            display: "flex",
                            gap: "16px",
                            padding: "10px 0",
                            borderBottom: "1px solid #222",
                            fontSize: "14px",
                        }}>
                            <span style={{ color: "#fff", fontWeight: "600", minWidth: "160px" }}>{r.name}</span>
                            <span style={{ color: "#aaa" }}>{r.action}</span>
                        </div>
                    ))}
                    {done && (
                        <p style={{ color: "#4ade80", marginTop: "20px", fontWeight: "bold" }}>
                            ✅ Cleanup complete! Refresh the lawyers page to verify.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
