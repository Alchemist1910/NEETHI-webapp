"use client";

import { useState, useRef } from "react";
import { storage } from "../lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function AvatarUpload({ uid, currentUrl, name, onUpload }) {
    const [progress, setProgress]   = useState(0);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview]     = useState(currentUrl || null);
    const inputRef                  = useRef(null);

    const fallback = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name || uid}&backgroundColor=transparent`;

    const handleFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) return;

        // Local preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        // Upload to Firebase Storage
        setUploading(true);
        const storageRef = ref(storage, `avatars/${uid}`);
        const task = uploadBytesResumable(storageRef, file);

        task.on(
            "state_changed",
            (snap) => setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
            (err) => { console.error(err); setUploading(false); },
            async () => {
                const url = await getDownloadURL(task.snapshot.ref);
                setPreview(url);
                setUploading(false);
                setProgress(0);
                onUpload?.(url);
            }
        );
    };

    const circumference = 2 * Math.PI * 44; // radius 44

    return (
        <div
            onClick={() => !uploading && inputRef.current?.click()}
            style={{
                position: "relative",
                width: "110px",
                height: "110px",
                cursor: uploading ? "wait" : "pointer",
                flexShrink: 0,
            }}
            title="Click to change photo"
        >
            {/* Progress ring */}
            {uploading && (
                <svg
                    style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}
                    width="110" height="110"
                >
                    <circle cx="55" cy="55" r="44" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                    <circle
                        cx="55" cy="55" r="44" fill="none" stroke="#fff" strokeWidth="4"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - (progress / 100) * circumference}
                        style={{ transition: "stroke-dashoffset 0.2s" }}
                    />
                </svg>
            )}

            {/* Avatar image */}
            <div style={{
                width: "100px", height: "100px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "3px solid rgba(255,255,255,0.15)",
                position: "absolute", top: "5px", left: "5px",
                background: "#1a1a1a",
            }}>
                {preview ? (
                    <img src={preview} alt={name || "Avatar"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                    <img src={fallback} alt={name || "Avatar"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                )}
            </div>

            {/* Camera overlay */}
            {!uploading && (
                <div style={{
                    position: "absolute", bottom: "5px", right: "5px",
                    background: "#fff", borderRadius: "50%",
                    width: "28px", height: "28px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#000" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                    </svg>
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFile}
            />
        </div>
    );
}
