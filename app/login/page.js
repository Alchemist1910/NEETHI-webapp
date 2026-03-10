"use client";

import Navbar from "../components/Navbar";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { auth, db } from "../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Login() {

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {

            // 1️⃣ Authenticate user
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = userCredential.user;

            // 2️⃣ Retrieve user data from Firestore
            const q = query(
                collection(db, "users"),
                where("uid", "==", user.uid)
            );

            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => {
                console.log("User Data:", doc.data());
            });

            // 3️⃣ Redirect after login
            router.push("/home");

        } catch (error) {

            alert(error.message);

        }

    };

    return (
        <>
            <Navbar />

            <div className="flex justify-center items-center min-h-screen">

                <form
                    onSubmit={handleLogin}
                    className="bg-neutral-900 p-8 rounded-xl w-96 border border-white/20"
                >

                    <h2 className="text-2xl font-bold mb-6 text-center">
                        Login
                    </h2>

                    <input
                        type="email"
                        placeholder="Email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mb-4 p-3 bg-black border border-white/20 rounded"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mb-6 p-3 bg-black border border-white/20 rounded"
                    />

                    <button
                        type="submit"
                        className="w-full py-3 bg-white text-black rounded-lg"
                    >
                        Login
                    </button>

                    <p className="text-gray-400 text-sm mt-4 text-center">

                        <Link href="/role" className="hover:underline">
                            New user? Register
                        </Link>

                    </p>

                </form>

            </div>
        </>
    );
}