"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

// ─── Human-readable Firebase error messages ───────────────────────────────────
function friendlyError(code) {
    switch (code) {
        case "auth/user-not-found":
        case "auth/invalid-credential":
            return "No account found with this email. Please check and try again.";
        case "auth/wrong-password":
            return "Incorrect password. Please try again.";
        case "auth/invalid-email":
            return "Please enter a valid email address.";
        case "auth/too-many-requests":
            return "Too many failed attempts. Please wait a moment and try again.";
        case "auth/user-disabled":
            return "This account has been disabled. Please contact support.";
        case "auth/network-request-failed":
            return "Network error. Please check your internet connection.";
        default:
            return "Login failed. Please check your credentials and try again.";
    }
}

export default function Login() {
    const router = useRouter();

    const [email, setEmail]       = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email.trim(), password);
            router.push("/home");
        } catch (err) {
            setError(friendlyError(err.code));
        } finally {
            setLoading(false);
        }
    };

    const css = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .login-page { font-family: 'Inter', sans-serif; min-height: 100vh; background: #050505; color: #fff; display: flex; align-items: center; justify-content: center; padding: 24px; position: relative; overflow: hidden; }
        .glow-orb { position: absolute; border-radius: 50%; filter: blur(120px); pointer-events: none; }
        .login-card { position: relative; z-index: 10; width: 100%; max-width: 420px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; padding: 44px 40px; }
        .login-label { display: block; font-size: 11px; font-weight: 600; letter-spacing: 0.6px; text-transform: uppercase; color: rgba(255,255,255,0.4); margin-bottom: 8px; }
        .login-input { width: 100%; padding: 12px 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #fff; font-size: 14px; font-family: inherit; outline: none; transition: border-color .2s; }
        .login-input:focus { border-color: rgba(255,255,255,0.35); }
        .login-input::placeholder { color: rgba(255,255,255,0.25); }
        .login-btn { width: 100%; padding: 14px; background: #fff; color: #000; border: none; border-radius: 10px; font-weight: 700; font-size: 15px; font-family: inherit; cursor: pointer; transition: background .2s, transform .1s; margin-top: 8px; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .login-btn:hover:not(:disabled) { background: #e8e8e8; transform: translateY(-1px); }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .error-box { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); border-radius: 10px; padding: 12px 16px; font-size: 13px; color: #fca5a5; margin-bottom: 20px; display: flex; align-items: flex-start; gap: 8px; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        .fade-in { animation: fadeIn .3s ease both; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { width:16px; height:16px; border:2px solid rgba(0,0,0,0.2); border-top-color:#000; border-radius:50%; animation:spin .6s linear infinite; }
    `;

    return (
        <>
            <style>{css}</style>
            <div className="login-page">
                {/* Background orbs */}
                <div className="glow-orb" style={{ width: 500, height: 500, background: "rgba(255,255,255,0.03)", top: "-100px", left: "-150px" }} />
                <div className="glow-orb" style={{ width: 400, height: 400, background: "rgba(255,255,255,0.02)", bottom: "-80px", right: "-100px" }} />

                <div className="login-card fade-in">
                    {/* Logo */}
                    <div style={{ textAlign: "center", marginBottom: "36px" }}>
                        <Link href="/" style={{ textDecoration: "none" }}>
                            <p style={{ fontSize: "22px", fontWeight: "800", letterSpacing: "4px", color: "#fff" }}>NEETHI</p>
                        </Link>
                        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", marginTop: "8px" }}>Sign in to your account</p>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="error-box fade-in">
                            <span style={{ flexShrink: 0, marginTop: "1px" }}>⚠</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        {/* Email */}
                        <div style={{ marginBottom: "18px" }}>
                            <label className="login-label">Email Address</label>
                            <input
                                className="login-input"
                                type="email"
                                placeholder="you@example.com"
                                required
                                value={email}
                                onChange={e => { setEmail(e.target.value); setError(""); }}
                                disabled={loading}
                            />
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: "24px" }}>
                            <label className="login-label">Password</label>
                            <div style={{ position: "relative" }}>
                                <input
                                    className="login-input"
                                    type={showPass ? "text" : "password"}
                                    placeholder="Enter your password"
                                    required
                                    value={password}
                                    onChange={e => { setPassword(e.target.value); setError(""); }}
                                    disabled={loading}
                                    style={{ paddingRight: "46px" }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(p => !p)}
                                    style={{
                                        position: "absolute", right: "14px", top: "50%",
                                        transform: "translateY(-50%)",
                                        background: "none", border: "none",
                                        color: "rgba(255,255,255,0.4)", cursor: "pointer",
                                        fontSize: "13px", padding: 0,
                                    }}
                                >
                                    {showPass ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? <><span className="spinner" /> Signing in…</> : "Sign In"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0" }}>
                        <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
                        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>or</span>
                        <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
                    </div>

                    {/* Register links */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <Link href="/register" style={{
                            display: "block", width: "100%", padding: "12px",
                            background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "10px", textAlign: "center",
                            color: "rgba(255,255,255,0.7)", fontSize: "14px",
                            fontWeight: "600", textDecoration: "none",
                            transition: "border-color .2s, color .2s",
                        }}>
                            New user? Create Account
                        </Link>
                        <Link href="/role" style={{
                            display: "block", width: "100%", padding: "12px",
                            background: "transparent", border: "1px solid rgba(251,191,36,0.2)",
                            borderRadius: "10px", textAlign: "center",
                            color: "#fbbf24", fontSize: "14px",
                            fontWeight: "600", textDecoration: "none",
                            transition: "border-color .2s",
                        }}>
                            ⚖ Register as a Lawyer
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}