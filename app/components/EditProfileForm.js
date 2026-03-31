"use client";

import { useState } from "react";

const SPECIALIZATIONS = [
    "Criminal Law", "Civil Law", "Corporate Law", "Family Law",
    "Property Law", "Labour Law", "Tax Law", "Constitutional Law",
    "Cyber Law", "Intellectual Property", "Environmental Law", "Other"
];

const inputStyle = (err) => ({
    width: "100%",
    padding: "11px 14px",
    background: "rgba(255,255,255,0.05)",
    border: `1px solid ${err ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"}`,
    borderRadius: "10px",
    color: "#fff",
    fontSize: "14px",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color .2s",
});

const labelStyle = {
    display: "block",
    fontSize: "11px",
    fontWeight: "600",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.4)",
    marginBottom: "6px",
};

function Field({ label, children, error }) {
    return (
        <div style={{ marginBottom: "18px" }}>
            <label style={labelStyle}>{label}</label>
            {children}
            {error && <p style={{ fontSize: "11px", color: "#f87171", marginTop: "4px" }}>⚠ {error}</p>}
        </div>
    );
}

export default function EditProfileForm({ profileData, isLawyer, onSave, saving }) {
    const [form, setForm]     = useState({ ...profileData });
    const [errors, setErrors] = useState({});

    const set = (key, val) => {
        setForm(f => ({ ...f, [key]: val }));
        setErrors(e => ({ ...e, [key]: "" }));
    };

    const validate = () => {
        const e = {};
        if (!form.name?.trim())  e.name  = "Name is required.";
        if (!form.place?.trim()) e.place = "Location is required.";
        if (form.age && (isNaN(form.age) || Number(form.age) < 18))
            e.age = "Age must be 18 or above.";
        if (isLawyer && !form.lawyerid?.trim())
            e.lawyerid = "Bar Council ID is required.";
        return e;
    };

    const handleSave = () => {
        const e = validate();
        if (Object.keys(e).length > 0) { setErrors(e); return; }
        onSave(form);
    };

    return (
        <div>
            {/* ── Personal ──────────────────────────────── */}
            <p style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "20px" }}>
                Personal Information
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                <Field label="Full Name *" error={errors.name}>
                    <input style={inputStyle(errors.name)} value={form.name || ""} onChange={e => set("name", e.target.value)} placeholder="Your full name" />
                </Field>
                <Field label="Age" error={errors.age}>
                    <input style={inputStyle(errors.age)} type="number" value={form.age || ""} onChange={e => set("age", e.target.value)} placeholder="e.g. 32" min="18" />
                </Field>
            </div>

            <Field label="Location / Place *" error={errors.place}>
                <input style={inputStyle(errors.place)} value={form.place || ""} onChange={e => set("place", e.target.value)} placeholder="e.g. Kochi, Kerala" />
            </Field>

            <Field label="Gender">
                <select style={inputStyle()} value={form.gender || ""} onChange={e => set("gender", e.target.value)}>
                    <option value="" disabled>Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not">Prefer not to say</option>
                </select>
            </Field>

            {/* ── Lawyer-specific ───────────────────────── */}
            {isLawyer && (
                <>
                    <div style={{ height: "1px", background: "rgba(255,255,255,0.07)", margin: "8px 0 24px" }} />
                    <p style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "20px" }}>
                        Professional Details
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                        <Field label="Bar Council ID *" error={errors.lawyerid}>
                            <input style={inputStyle(errors.lawyerid)} value={form.lawyerid || ""} onChange={e => set("lawyerid", e.target.value)} placeholder="e.g. KER/1234/2020" />
                        </Field>
                        <Field label="Years of Experience">
                            <input style={inputStyle()} value={form.experience || ""} onChange={e => set("experience", e.target.value)} placeholder="e.g. 7 years" />
                        </Field>
                    </div>

                    <Field label="Specialization">
                        <select style={inputStyle()} value={form.specialization || ""} onChange={e => set("specialization", e.target.value)}>
                            <option value="">Select specialization</option>
                            {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </Field>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                        <Field label="Consultation Fee (₹/hr)">
                            <input style={inputStyle()} type="number" value={form.officeFee || ""} onChange={e => set("officeFee", e.target.value)} placeholder="e.g. 1500" />
                        </Field>
                        <Field label="Languages Known">
                            <input style={inputStyle()} value={form.languages || ""} onChange={e => set("languages", e.target.value)} placeholder="English, Hindi…" />
                        </Field>
                    </div>

                    <Field label="Office Address">
                        <input style={inputStyle()} value={form.officeAddress || ""} onChange={e => set("officeAddress", e.target.value)} placeholder="Chamber / office address" />
                    </Field>

                    <Field label="Bio / About">
                        <textarea
                            style={{ ...inputStyle(), resize: "vertical", minHeight: "100px", paddingTop: "12px" }}
                            value={form.bio || ""}
                            onChange={e => set("bio", e.target.value)}
                            placeholder="Brief description about yourself and your practice…"
                        />
                    </Field>
                </>
            )}

            {/* Save button */}
            <button
                onClick={handleSave}
                disabled={saving}
                style={{
                    marginTop: "8px",
                    padding: "12px 32px",
                    background: saving ? "rgba(255,255,255,0.2)" : "#fff",
                    color: "#000",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: "700",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    cursor: saving ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "background .2s",
                }}
            >
                {saving ? (
                    <>
                        <span style={{ width: "14px", height: "14px", border: "2px solid #000", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .6s linear infinite", display: "inline-block" }} />
                        Saving…
                    </>
                ) : "Save Changes"}
            </button>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
