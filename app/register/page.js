"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { db, auth } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(pw) {
    const checks = {
        length: pw.length >= 8,
        upper: /[A-Z]/.test(pw),
        number: /[0-9]/.test(pw),
        symbol: /[!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`\-]/.test(pw),
    };
    const failed = [];
    if (!checks.length) failed.push("at least 8 characters");
    if (!checks.upper) failed.push("an uppercase letter");
    if (!checks.number) failed.push("a number");
    if (!checks.symbol) failed.push("a special character");
    return failed;
}

function PasswordStrengthBar({ password }) {
    const score = [
        password.length >= 8,
        /[A-Z]/.test(password),
        /[0-9]/.test(password),
        /[!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`\-]/.test(password),
    ].filter(Boolean).length;

    const colours = ["#ef4444", "#f97316", "#eab308", "#22c55e"];
    const labels  = ["Weak", "Fair", "Good", "Strong"];

    if (!password) return null;

    return (
        <div style={{ marginTop: "6px" }}>
            <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                {[0, 1, 2, 3].map(i => (
                    <div
                        key={i}
                        style={{
                            flex: 1,
                            height: "4px",
                            borderRadius: "99px",
                            background: i < score ? colours[score - 1] : "rgba(255,255,255,0.1)",
                            transition: "background 0.3s",
                        }}
                    />
                ))}
            </div>
            <span style={{ fontSize: "11px", color: colours[score - 1] || "#aaa" }}>
                {score > 0 ? labels[score - 1] : ""}
            </span>
        </div>
    );
}

function EyeIcon({ visible }) {
    return visible ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Register() {
    const router = useRouter();

    const [isLawyer, setIsLawyer]         = useState(false);
    const [showPw, setShowPw]             = useState(false);
    const [showCpw, setShowCpw]           = useState(false);
    const [loading, setLoading]           = useState(false);
    const [success, setSuccess]           = useState(false);
    const [globalError, setGlobalError]   = useState("");
    const [mounted, setMounted]           = useState(false);
    const [touched, setTouched]           = useState({});

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        age: "",
        place: "",
        gender: "",
        lawyerId: "",
        officeAddress: "",
        languages: "",
        experience: "",
        password: "",
        confirmPassword: "",
    });

    useEffect(() => {
        setMounted(true);
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            setIsLawyer(params.get("role") === "lawyer");
        }
    }, []);

    // ── Derived validation errors ──────────────────────────────────────────────

    const errors = {};

    if (!formData.fullName.trim())
        errors.fullName = "Full name is required.";

    if (!formData.email)
        errors.email = "Email is required.";
    else if (!validateEmail(formData.email))
        errors.email = "Enter a valid email address.";

    if (!formData.age)
        errors.age = "Age is required.";
    else if (isNaN(formData.age) || Number(formData.age) < 18 || Number(formData.age) > 120)
        errors.age = "You must be at least 18 years old.";

    if (!formData.place.trim())
        errors.place = "Location is required.";

    if (!formData.gender)
        errors.gender = "Please select a gender.";

    if (isLawyer && !formData.lawyerId.trim())
        errors.lawyerId = "Lawyer ID is required.";

    const pwIssues = validatePassword(formData.password);
    if (!formData.password)
        errors.password = "Password is required.";
    else if (pwIssues.length > 0)
        errors.password = `Password needs ${pwIssues.join(", ")}.`;

    if (!formData.confirmPassword)
        errors.confirmPassword = "Please confirm your password.";
    else if (formData.password !== formData.confirmPassword)
        errors.confirmPassword = "Passwords do not match.";

    // ── Handlers ───────────────────────────────────────────────────────────────

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setGlobalError("");
    };

    const handleBlur = (e) => {
        setTouched({ ...touched, [e.target.name]: true });
    };

    const showError = (field) => touched[field] && errors[field];

    const handleRegister = async (e) => {
        e.preventDefault();
        // Touch all fields to trigger validation display
        const allFields = ["fullName","email","age","place","gender","lawyerId","password","confirmPassword"];
        const allTouched = {};
        allFields.forEach(f => allTouched[f] = true);
        setTouched(allTouched);

        if (Object.keys(errors).length > 0) return;

        setLoading(true);
        setGlobalError("");

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );
            const user = userCredential.user;

            const userData = {
                uid: user.uid,
                name: formData.fullName,
                email: formData.email,
                age: Number(formData.age),
                place: formData.place,
                gender: formData.gender,
                role: isLawyer ? "lawyer" : "user",
            };

            if (isLawyer) {
                userData.lawyerid      = formData.lawyerId;
                userData.officeAddress = formData.officeAddress;
                userData.languages     = formData.languages;
                userData.experience    = formData.experience;
            }

            // Lawyers go to the 'lawyers' collection; regular users go to 'users'
            const targetCollection = isLawyer ? "lawyers" : "users";
            await addDoc(collection(db, targetCollection), userData);

            setSuccess(true);
            setTimeout(() => router.push("/home"), 2000);
        } catch (error) {
            const msg =
                error.code === "auth/email-already-in-use"
                    ? "This email is already registered. Please login instead."
                    : error.code === "auth/network-request-failed"
                    ? "Network error. Please check your connection."
                    : error.message;
            setGlobalError(msg);
        } finally {
            setLoading(false);
        }
    };

    // ── Styles (inline, no extra dependencies) ─────────────────────────────────

    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        .reg-page {
            font-family: 'Inter', sans-serif;
            min-height: 100vh;
            background: #050505;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            padding: 40px 16px 60px;
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(32px); }
            to   { opacity: 1; transform: translateY(0); }
        }

        .reg-card {
            width: 100%;
            max-width: 500px;
            background: rgba(255,255,255,0.035);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 24px;
            padding: 48px 40px;
            box-shadow: 0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset;
            animation: slideUp 0.5s cubic-bezier(.22,.68,0,1.2) both;
        }

        .reg-logo-row {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 32px;
        }

        .reg-brand {
            font-size: 20px;
            font-weight: 800;
            letter-spacing: 3px;
            color: #fff;
        }

        .reg-title {
            font-size: 26px;
            font-weight: 700;
            color: #ffffff;
            margin: 0 0 4px;
        }

        .reg-subtitle {
            font-size: 13.5px;
            color: rgba(255,255,255,0.45);
            margin: 0 0 32px;
        }

        .reg-section-label {
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 1.8px;
            text-transform: uppercase;
            color: rgba(255,255,255,0.3);
            margin: 24px 0 12px;
        }

        .reg-field {
            margin-bottom: 14px;
        }

        .reg-label {
            display: block;
            font-size: 12px;
            font-weight: 500;
            color: rgba(255,255,255,0.55);
            margin-bottom: 6px;
            letter-spacing: 0.3px;
        }

        .reg-input-wrap {
            position: relative;
        }

        .reg-input {
            width: 100%;
            padding: 13px 16px;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px;
            color: #fff;
            font-size: 14px;
            font-family: inherit;
            outline: none;
            transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
            box-sizing: border-box;
        }

        .reg-input::placeholder { color: rgba(255,255,255,0.25); }

        .reg-input:focus {
            border-color: rgba(255,255,255,0.35);
            background: rgba(255,255,255,0.08);
            box-shadow: 0 0 0 3px rgba(255,255,255,0.06);
        }

        .reg-input.has-error {
            border-color: rgba(239,68,68,0.6);
        }

        .reg-input.has-error:focus {
            box-shadow: 0 0 0 3px rgba(239,68,68,0.15);
        }

        .reg-eye-btn {
            position: absolute;
            right: 14px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: rgba(255,255,255,0.4);
            cursor: pointer;
            padding: 0;
            display: flex;
            align-items: center;
            transition: color 0.2s;
        }

        .reg-eye-btn:hover { color: rgba(255,255,255,0.8); }

        .reg-error-msg {
            font-size: 11.5px;
            color: #f87171;
            margin-top: 5px;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .reg-two-col {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }

        .reg-submit-btn {
            width: 100%;
            padding: 15px;
            margin-top: 28px;
            background: #fff;
            color: #000;
            border: none;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 700;
            font-family: inherit;
            cursor: pointer;
            transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            letter-spacing: 0.3px;
        }

        .reg-submit-btn:hover:not(:disabled) {
            background: #e8e8e8;
            box-shadow: 0 0 0 4px rgba(255,255,255,0.12);
            transform: translateY(-1px);
        }

        .reg-submit-btn:disabled {
            opacity: 0.55;
            cursor: not-allowed;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .reg-spinner {
            width: 18px;
            height: 18px;
            border: 2px solid rgba(0,0,0,0.25);
            border-top-color: #000;
            border-radius: 50%;
            animation: spin 0.7s linear infinite;
        }

        .reg-global-error {
            background: rgba(239,68,68,0.12);
            border: 1px solid rgba(239,68,68,0.3);
            color: #fca5a5;
            border-radius: 10px;
            padding: 12px 16px;
            font-size: 13px;
            margin-top: 16px;
        }

        @keyframes successPop {
            0%   { opacity: 0; transform: scale(0.9); }
            60%  { transform: scale(1.03); }
            100% { opacity: 1; transform: scale(1); }
        }

        .reg-success-banner {
            background: rgba(34,197,94,0.12);
            border: 1px solid rgba(34,197,94,0.3);
            color: #86efac;
            border-radius: 12px;
            padding: 16px 20px;
            font-size: 14px;
            margin-top: 20px;
            text-align: center;
            animation: successPop 0.4s ease both;
        }

        .reg-footer-link {
            text-align: center;
            margin-top: 24px;
            font-size: 13px;
            color: rgba(255,255,255,0.35);
        }

        .reg-footer-link a {
            color: rgba(255,255,255,0.75);
            text-decoration: none;
            font-weight: 600;
            transition: color 0.2s;
        }

        .reg-footer-link a:hover { color: #fff; }

        .reg-role-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(255,255,255,0.06);
            border: 1px solid rgba(255,255,255,0.12);
            border-radius: 20px;
            padding: 4px 12px;
            font-size: 12px;
            font-weight: 600;
            color: rgba(255,255,255,0.7);
            margin-bottom: 24px;
        }

        .reg-divider {
            height: 1px;
            background: rgba(255,255,255,0.07);
            margin: 20px 0 4px;
        }

        select.reg-input option {
            background: #111;
            color: #fff;
        }

        @media (max-width: 540px) {
            .reg-card { padding: 32px 20px; }
            .reg-two-col { grid-template-columns: 1fr; }
        }
    `;

    if (!mounted) return null;

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: styles }} />

            <div className="reg-page">
                <div className="reg-card">

                    {/* Brand */}
                    <div className="reg-logo-row">
                        <Image
                            src="/image-removebg-preview.png"
                            width={32}
                            height={32}
                            alt="Neethi"
                            style={{ objectFit: "contain" }}
                        />
                        <span className="reg-brand">NEETHI</span>
                    </div>

                    <h1 className="reg-title">Create your account</h1>
                    <p className="reg-subtitle">Join NEETHI — where law meets technology.</p>

                    {/* Role badge */}
                    <div className="reg-role-badge">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                        Registering as: {isLawyer ? "Lawyer" : "General User"}
                    </div>

                    <form onSubmit={handleRegister} noValidate>

                        {/* ── Personal Info ─────────────────────────────── */}
                        <div className="reg-section-label">Personal Information</div>

                        {/* Full Name */}
                        <div className="reg-field">
                            <label className="reg-label">Full Name <span style={{color:"#f87171"}}>*</span></label>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                className={`reg-input ${showError("fullName") ? "has-error" : ""}`}
                                placeholder="e.g. Priya Menon"
                                value={formData.fullName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                autoComplete="name"
                            />
                            {showError("fullName") && <p className="reg-error-msg">⚠ {errors.fullName}</p>}
                        </div>

                        {/* Email */}
                        <div className="reg-field">
                            <label className="reg-label">Email Address <span style={{color:"#f87171"}}>*</span></label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className={`reg-input ${showError("email") ? "has-error" : ""}`}
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                autoComplete="email"
                            />
                            {showError("email") && <p className="reg-error-msg">⚠ {errors.email}</p>}
                        </div>

                        {/* Age + Place */}
                        <div className="reg-two-col">
                            <div className="reg-field">
                                <label className="reg-label">Age <span style={{color:"#f87171"}}>*</span></label>
                                <input
                                    id="age"
                                    name="age"
                                    type="number"
                                    min="18"
                                    max="120"
                                    className={`reg-input ${showError("age") ? "has-error" : ""}`}
                                    placeholder="25"
                                    value={formData.age}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {showError("age") && <p className="reg-error-msg">⚠ {errors.age}</p>}
                            </div>

                            <div className="reg-field">
                                <label className="reg-label">Gender <span style={{color:"#f87171"}}>*</span></label>
                                <select
                                    id="gender"
                                    name="gender"
                                    className={`reg-input ${showError("gender") ? "has-error" : ""}`}
                                    value={formData.gender}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                >
                                    <option value="" disabled>Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                    <option value="prefer_not">Prefer not to say</option>
                                </select>
                                {showError("gender") && <p className="reg-error-msg">⚠ {errors.gender}</p>}
                            </div>
                        </div>

                        {/* Place */}
                        <div className="reg-field">
                            <label className="reg-label">Location / Place <span style={{color:"#f87171"}}>*</span></label>
                            <input
                                id="place"
                                name="place"
                                type="text"
                                className={`reg-input ${showError("place") ? "has-error" : ""}`}
                                placeholder="e.g. Kochi, Kerala"
                                value={formData.place}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            {showError("place") && <p className="reg-error-msg">⚠ {errors.place}</p>}
                        </div>

                        {/* ── Lawyer-specific fields ────────────────────── */}
                        {isLawyer && (
                            <>
                                <div className="reg-divider" />
                                <div className="reg-section-label">Professional Details</div>

                                <div className="reg-field">
                                    <label className="reg-label">Bar Council / Lawyer ID <span style={{color:"#f87171"}}>*</span></label>
                                    <input
                                        id="lawyerId"
                                        name="lawyerId"
                                        type="text"
                                        className={`reg-input ${showError("lawyerId") ? "has-error" : ""}`}
                                        placeholder="e.g. KER/1234/2020"
                                        value={formData.lawyerId}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {showError("lawyerId") && <p className="reg-error-msg">⚠ {errors.lawyerId}</p>}
                                </div>

                                <div className="reg-field">
                                    <label className="reg-label">Office Address</label>
                                    <input
                                        name="officeAddress"
                                        type="text"
                                        className="reg-input"
                                        placeholder="Office / Chamber address"
                                        value={formData.officeAddress}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="reg-two-col">
                                    <div className="reg-field">
                                        <label className="reg-label">Languages Known</label>
                                        <input
                                            name="languages"
                                            type="text"
                                            className="reg-input"
                                            placeholder="English, Hindi…"
                                            value={formData.languages}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="reg-field">
                                        <label className="reg-label">Years of Experience</label>
                                        <input
                                            name="experience"
                                            type="text"
                                            className="reg-input"
                                            placeholder="e.g. 5 Years"
                                            value={formData.experience}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ── Security ──────────────────────────────────── */}
                        <div className="reg-divider" />
                        <div className="reg-section-label">Security</div>

                        {/* Password */}
                        <div className="reg-field">
                            <label className="reg-label">Password <span style={{color:"#f87171"}}>*</span></label>
                            <div className="reg-input-wrap">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPw ? "text" : "password"}
                                    className={`reg-input ${showError("password") ? "has-error" : ""}`}
                                    placeholder="Create a strong password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    style={{ paddingRight: "44px" }}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className="reg-eye-btn"
                                    onClick={() => setShowPw(!showPw)}
                                    aria-label={showPw ? "Hide password" : "Show password"}
                                >
                                    <EyeIcon visible={showPw} />
                                </button>
                            </div>
                            <PasswordStrengthBar password={formData.password} />
                            {showError("password") && <p className="reg-error-msg">⚠ {errors.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div className="reg-field">
                            <label className="reg-label">Confirm Password <span style={{color:"#f87171"}}>*</span></label>
                            <div className="reg-input-wrap">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showCpw ? "text" : "password"}
                                    className={`reg-input ${showError("confirmPassword") ? "has-error" : ""}`}
                                    placeholder="Repeat your password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    style={{ paddingRight: "44px" }}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className="reg-eye-btn"
                                    onClick={() => setShowCpw(!showCpw)}
                                    aria-label={showCpw ? "Hide confirm password" : "Show confirm password"}
                                >
                                    <EyeIcon visible={showCpw} />
                                </button>
                            </div>
                            {showError("confirmPassword") && (
                                <p className="reg-error-msg">⚠ {errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Global error */}
                        {globalError && (
                            <div className="reg-global-error">
                                ⚠ {globalError}
                            </div>
                        )}

                        {/* Success */}
                        {success && (
                            <div className="reg-success-banner">
                                ✅ Account created! Redirecting you to the home page…
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            className="reg-submit-btn"
                            disabled={loading || success}
                        >
                            {loading ? (
                                <>
                                    <span className="reg-spinner" />
                                    Creating Account…
                                </>
                            ) : (
                                "Create Account →"
                            )}
                        </button>

                    </form>

                    {/* Footer link */}
                    <p className="reg-footer-link">
                        Already have an account?{" "}
                        <Link href="/login">Sign in</Link>
                    </p>

                </div>
            </div>
        </>
    );
}