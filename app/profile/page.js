"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
    collection, query, where, getDocs,
    updateDoc, doc, serverTimestamp,
} from "firebase/firestore";
import AvatarUpload from "../components/AvatarUpload";
import EditProfileForm from "../components/EditProfileForm";

// ─── Sidebar link ─────────────────────────────────────────────────────────────

function SideLink({ icon, label, href, active, onClick }) {
    const sharedStyle = {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "11px 16px",
        borderRadius: "10px",
        background: active ? "rgba(255,255,255,0.08)" : "transparent",
        color: active ? "#fff" : "rgba(255,255,255,0.5)",
        fontSize: "14px",
        fontWeight: active ? "600" : "400",
        textDecoration: "none",
        transition: "background .2s, color .2s",
        cursor: "pointer",
        border: "none",
        width: "100%",
        fontFamily: "inherit",
    };

    if (href) {
        return (
            <Link href={href} style={sharedStyle}>
                {icon}
                <span>{label}</span>
            </Link>
        );
    }

    return (
        <button onClick={onClick} style={sharedStyle}>
            {icon}
            <span>{label}</span>
        </button>
    );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const Icon = ({ d, size = 18 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} style={{ flexShrink: 0 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
);

// ─── Stat/info chip ───────────────────────────────────────────────────────────

function InfoChip({ icon, label, value }) {
    if (!value) return null;
    return (
        <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "10px",
            padding: "12px 16px",
        }}>
            <span style={{ color: "rgba(255,255,255,0.45)", flexShrink: 0 }}>{icon}</span>
            <div>
                <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</p>
                <p style={{ fontSize: "14px", fontWeight: "500", color: "#fff" }}>{value}</p>
            </div>
        </div>
    );
}

// ─── Availability toggle (lawyers only) ───────────────────────────────────────

function AvailabilityToggle({ value, onChange }) {
    const online = value === "online";
    return (
        <div
            onClick={() => onChange(online ? "offline" : "online")}
            style={{
                display: "inline-flex", alignItems: "center", gap: "10px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "20px",
                padding: "8px 16px",
                cursor: "pointer",
                userSelect: "none",
                transition: "background .2s",
            }}
        >
            <span style={{
                width: "10px", height: "10px", borderRadius: "50%",
                background: online ? "#22c55e" : "#555",
                boxShadow: online ? "0 0 8px #22c55e" : "none",
                transition: "all .3s",
            }} />
            <span style={{ fontSize: "13px", fontWeight: "600", color: online ? "#22c55e" : "rgba(255,255,255,0.5)" }}>
                {online ? "Available" : "Unavailable"}
            </span>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProfilePage() {
    const router = useRouter();

    const [authUser, setAuthUser]   = useState(null);
    const [profile, setProfile]     = useState(null);
    const [docRef, setDocRef]       = useState(null);
    const [isLawyer, setIsLawyer]   = useState(false);
    const [tab, setTab]             = useState("overview");  // overview | edit
    const [saving, setSaving]       = useState(false);
    const [saveMsg, setSaveMsg]     = useState("");
    const [loading, setLoading]     = useState(true);
    const [mounted, setMounted]     = useState(false);

    useEffect(() => { setMounted(true); }, []);

    // ── Auth listener → fetch profile ─────────────────────────────────────────
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (!user) { router.push("/login"); return; }
            setAuthUser(user);

            // Try 'lawyers' collection first, then 'users'
            for (const colName of ["lawyers", "users"]) {
                const q   = query(collection(db, colName), where("uid", "==", user.uid));
                const snap = await getDocs(q);
                if (!snap.empty) {
                    const d = snap.docs[0];
                    setProfile(d.data());
                    setDocRef(doc(db, colName, d.id));
                    setIsLawyer(colName === "lawyers");
                    break;
                }
            }
            setLoading(false);
        });
        return () => unsub();
    }, [router]);

    // ── Save handler ──────────────────────────────────────────────────────────

    const handleSave = async (updatedForm) => {
        if (!docRef) return;
        setSaving(true);
        try {
            await updateDoc(docRef, { ...updatedForm, updatedAt: serverTimestamp() });
            setProfile(p => ({ ...p, ...updatedForm }));
            setSaveMsg("✅ Profile updated!");
            setTab("overview");
            setTimeout(() => setSaveMsg(""), 3000);
        } catch (err) {
            setSaveMsg("❌ " + err.message);
        }
        setSaving(false);
    };

    // ── Avatar upload callback ─────────────────────────────────────────────────

    const handleAvatarUpload = async (url) => {
        if (!docRef) return;
        await updateDoc(docRef, { photoURL: url, updatedAt: serverTimestamp() });
        setProfile(p => ({ ...p, photoURL: url }));
    };

    // ── Availability toggle ───────────────────────────────────────────────────

    const handleAvailability = async (val) => {
        if (!docRef) return;
        await updateDoc(docRef, { availability: val, updatedAt: serverTimestamp() });
        setProfile(p => ({ ...p, availability: val }));
    };

    // ── Styles ────────────────────────────────────────────────────────────────

    const css = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        .prof-wrap { font-family: 'Inter', sans-serif; min-height: 100vh; background: #050505; color: #fff; display: flex; flex-direction: column; }
        .prof-inner { display: flex; flex: 1; max-width: 1200px; margin: 0 auto; width: 100%; padding: 40px 24px; gap: 28px; }
        .prof-sidebar { width: 260px; flex-shrink: 0; display: flex; flex-direction: column; gap: 6px; }
        .prof-main { flex: 1; min-width: 0; }
        .prof-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 18px; padding: 28px; }
        .prof-tab-btn { padding: 8px 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: transparent; color: rgba(255,255,255,0.5); font-family: inherit; font-size: 14px; cursor: pointer; transition: all .2s; }
        .prof-tab-btn.active { background: rgba(255,255,255,0.08); color: #fff; border-color: rgba(255,255,255,0.2); }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 24px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn .3s ease both; }
        @media (max-width: 768px) {
            .prof-inner { flex-direction: column; padding: 20px 16px; }
            .prof-sidebar { width: 100%; flex-direction: row; flex-wrap: wrap; gap: 8px; }
            .info-grid { grid-template-columns: 1fr; }
        }
    `;

    if (!mounted || loading) {
        return (
            <>
                <style>{css}</style>
                <div className="prof-wrap" style={{ alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: "40px", height: "40px", border: "3px solid rgba(255,255,255,0.1)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
                </div>
            </>
        );
    }

    if (!profile) {
        return (
            <>
                <style>{css}</style>
                <div className="prof-wrap" style={{ alignItems: "center", justifyContent: "center" }}>
                    <p style={{ color: "rgba(255,255,255,0.4)" }}>Profile not found. <Link href="/register" style={{ color: "#fff" }}>Register here.</Link></p>
                </div>
            </>
        );
    }

    const fallbackAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name || authUser?.uid}&backgroundColor=transparent`;

    return (
        <>
            <style>{css}</style>
            <div className="prof-wrap">

                {/* Top bar */}
                <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Link href="/home" style={{ fontSize: "18px", fontWeight: "800", letterSpacing: "3px", color: "#fff", textDecoration: "none" }}>NEETHI</Link>
                    <Link href="/home" style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}>
                        <Icon d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" size={14} /> Back to Home
                    </Link>
                </div>

                <div className="prof-inner">

                    {/* ── Sidebar ─────────────────────────────────── */}
                    <aside className="prof-sidebar">
                        {/* Avatar + name */}
                        <div className="prof-card" style={{ alignItems: "center", display: "flex", flexDirection: "column", gap: "14px", marginBottom: "8px" }}>
                            <AvatarUpload
                                uid={authUser?.uid}
                                name={profile.name}
                                currentUrl={profile.photoURL}
                                onUpload={handleAvatarUpload}
                            />
                            <div style={{ textAlign: "center" }}>
                                <p style={{ fontWeight: "700", fontSize: "16px", margin: "0 0 4px" }}>{profile.name || "—"}</p>
                                <span style={{
                                    display: "inline-block",
                                    padding: "3px 12px",
                                    background: isLawyer ? "rgba(251,191,36,0.12)" : "rgba(99,102,241,0.12)",
                                    border: `1px solid ${isLawyer ? "rgba(251,191,36,0.3)" : "rgba(99,102,241,0.3)"}`,
                                    borderRadius: "20px",
                                    fontSize: "11px",
                                    fontWeight: "600",
                                    color: isLawyer ? "#fbbf24" : "#818cf8",
                                }}>
                                    {isLawyer ? "⚖ Lawyer" : "👤 User"}
                                </span>
                                {isLawyer && profile.specialization && (
                                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "6px" }}>{profile.specialization}</p>
                                )}
                            </div>

                            {/* Availability (lawyers only) */}
                            {isLawyer && (
                                <AvailabilityToggle value={profile.availability || "offline"} onChange={handleAvailability} />
                            )}
                        </div>

                        {/* Nav links */}
                        <div className="prof-card" style={{ padding: "12px", gap: "2px", display: "flex", flexDirection: "column" }}>
                            <SideLink active={tab === "overview"} onClick={(e) => { e.preventDefault(); setTab("overview"); }} icon={<Icon d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />} label="My Profile" />
                            <SideLink active={tab === "edit"} onClick={(e) => { e.preventDefault(); setTab("edit"); }} icon={<Icon d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />} label="Edit Profile" />
                            <SideLink href="/chat" icon={<Icon d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />} label="Chat" />
                            <SideLink href="/lawyers" icon={<Icon d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />} label="Find Lawyers" />
                        </div>
                    </aside>

                    {/* ── Main panel ──────────────────────────────── */}
                    <main className="prof-main">

                        {/* Tab bar */}
                        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
                            <button className={`prof-tab-btn ${tab === "overview" ? "active" : ""}`} onClick={() => setTab("overview")}>Overview</button>
                            <button className={`prof-tab-btn ${tab === "edit" ? "active" : ""}`} onClick={() => setTab("edit")}>Edit Profile</button>
                        </div>

                        {/* Save message */}
                        {saveMsg && (
                            <div style={{
                                background: saveMsg.startsWith("✅") ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                                border: `1px solid ${saveMsg.startsWith("✅") ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                                color: saveMsg.startsWith("✅") ? "#86efac" : "#fca5a5",
                                borderRadius: "10px",
                                padding: "12px 18px",
                                fontSize: "14px",
                                marginBottom: "16px",
                            }}>
                                {saveMsg}
                            </div>
                        )}

                        {/* ── OVERVIEW tab ─────────────────────────── */}
                        {tab === "overview" && (
                            <div className="fade-in">
                                <div className="prof-card">
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                                        <div>
                                            <h1 style={{ fontSize: "24px", fontWeight: "700", margin: "0 0 6px" }}>{profile.name || "—"}</h1>
                                            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", margin: 0 }}>{profile.email || authUser?.email}</p>
                                        </div>
                                        <button
                                            onClick={() => setTab("edit")}
                                            style={{
                                                padding: "9px 20px",
                                                background: "rgba(255,255,255,0.07)",
                                                border: "1px solid rgba(255,255,255,0.12)",
                                                borderRadius: "8px",
                                                color: "#fff",
                                                fontFamily: "inherit",
                                                fontSize: "13px",
                                                fontWeight: "600",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "6px",
                                            }}
                                        >
                                            <Icon d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" size={14} />
                                            Edit
                                        </button>
                                    </div>

                                    {/* Lawyer bio */}
                                    {isLawyer && profile.bio && (
                                        <p style={{ marginTop: "20px", fontSize: "14px", lineHeight: "1.7", color: "rgba(255,255,255,0.6)", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "20px" }}>
                                            {profile.bio}
                                        </p>
                                    )}

                                    {/* Info grid */}
                                    <div className="info-grid">
                                        <InfoChip icon={<Icon d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" size={16} />} label="Location" value={profile.place} />
                                        <InfoChip icon={<Icon d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5A2.25 2.25 0 0012.75 4.5h-1.5A2.25 2.25 0 009 6.75v1.5m3 9.75V12M9.75 12H6m6 0h3.75" size={16} />} label="Age" value={profile.age ? `${profile.age} years` : null} />
                                        <InfoChip icon={<Icon d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" size={16} />} label="Gender" value={profile.gender ? profile.gender.replace("_", " ") : null} />
                                        {isLawyer && <>
                                            <InfoChip icon={<Icon d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.97z" size={16} />} label="Bar Council ID" value={profile.lawyerid} />
                                            <InfoChip icon={<Icon d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" size={16} />} label="Experience" value={profile.experience} />
                                            <InfoChip icon={<Icon d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" size={16} />} label="Consultation Fee" value={profile.officeFee ? `₹${profile.officeFee}/hr` : null} />
                                            <InfoChip icon={<Icon d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" size={16} />} label="Languages" value={profile.languages} />
                                            <InfoChip icon={<Icon d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" size={16} />} label="Office Address" value={profile.officeAddress} />
                                        </>}
                                        {!isLawyer && (
                                            <InfoChip icon={<Icon d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" size={16} />} label="Role" value="General User" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── EDIT tab ─────────────────────────────── */}
                        {tab === "edit" && (
                            <div className="prof-card fade-in">
                                <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "24px" }}>Edit Profile</h2>
                                <EditProfileForm
                                    profileData={profile}
                                    isLawyer={isLawyer}
                                    onSave={handleSave}
                                    saving={saving}
                                />
                            </div>
                        )}

                    </main>
                </div>
            </div>
        </>
    );
}
