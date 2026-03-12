"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/Navbar";
import { db, auth } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Register() {

    const router = useRouter();

    const [isLawyer, setIsLawyer] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            setIsLawyer(params.get("role") === "lawyer");
        }
    }, []);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        gender: "",
        lawyerId: "",
        officeAddress: "",
        languages: "",
        experience: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {

            // create login account
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            const user = userCredential.user;

            // store user data
            const userData = {
                uid: user.uid,
                name: formData.fullName,
                email: formData.email,
                gender: formData.gender,
                role: isLawyer ? "lawyer" : "user",
            };

            if (isLawyer) {
                userData.lawyerid = formData.lawyerId;
                userData.officeAddress = formData.officeAddress;
                userData.languages = formData.languages;
                userData.experience = formData.experience;
            }

            await addDoc(collection(db, "users"), userData);

            alert("Registration Successful");

            router.push("/home");

        } catch (error) {
            console.log(error);
            alert(error.message);
        }

    };

    return (
        <div className="bg-black text-white min-h-screen flex flex-col">


            <div className="flex-grow flex items-center justify-center">

                <div className="w-full max-w-6xl flex justify-between items-center px-12">

                    {/* LEFT SIDE */}

                    <div className="w-1/2 flex flex-col items-center justify-center">

                        <h1 className="text-6xl font-bold mb-8 tracking-widest">
                            WELCOME!
                        </h1>

                        <Image
                            src="/neethi-logo.svg"
                            width={300}
                            height={300}
                            alt="Neethi Logo"
                        />

                    </div>

                    {/* RIGHT SIDE */}

                    <div className="w-1/2 flex justify-center">

                        <form
                            onSubmit={handleRegister}
                            className="bg-[#111] p-10 rounded-2xl w-[450px] border border-white/5 shadow-2xl"
                        >

                            <div className="space-y-5 mb-8">

                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Full Name"
                                    required
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full p-4 bg-[#1a1a1a] border border-white/10 rounded-lg"
                                />

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-4 bg-[#1a1a1a] border border-white/10 rounded-lg"
                                />

                                <select
                                    name="gender"
                                    required
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full p-4 bg-[#1a1a1a] border border-white/10 rounded-lg text-gray-400 focus:text-white"
                                >
                                    <option value="" disabled>Select Gender *</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>

                                <input
                                    type="text"
                                    name="lawyerId"
                                    placeholder={isLawyer ? "Lawyer ID *" : "Lawyer ID (Optional)"}
                                    required={isLawyer}
                                    value={formData.lawyerId}
                                    onChange={handleChange}
                                    className="w-full p-4 bg-[#1a1a1a] border border-white/10 rounded-lg"
                                />

                                <input
                                    type="text"
                                    name="officeAddress"
                                    placeholder="Office Address (Optional)"
                                    value={formData.officeAddress}
                                    onChange={handleChange}
                                    className="w-full p-4 bg-[#1a1a1a] border border-white/10 rounded-lg"
                                />

                                {isLawyer && (
                                    <>
                                        <input
                                            type="text"
                                            name="languages"
                                            placeholder="Languages Known (e.g., English, Hindi, Malayalam)"
                                            value={formData.languages}
                                            onChange={handleChange}
                                            className="w-full p-4 bg-[#1a1a1a] border border-white/10 rounded-lg"
                                        />
        
                                        <input
                                            type="text"
                                            name="experience"
                                            placeholder="Years of Experience (e.g., 5 Years)"
                                            value={formData.experience}
                                            onChange={handleChange}
                                            className="w-full p-4 bg-[#1a1a1a] border border-white/10 rounded-lg"
                                        />
                                    </>
                                )}

                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full p-4 bg-[#1a1a1a] border border-white/10 rounded-lg"
                                />

                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full p-4 bg-[#1a1a1a] border border-white/10 rounded-lg"
                                />

                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 border border-white rounded-xl font-bold hover:bg-white hover:text-black transition"
                            >

                                Sign Up

                            </button>

                            <p className="text-gray-500 text-sm mt-6 text-center">

                                <Link href="/login" className="hover:text-white">
                                    Already have an account? Login
                                </Link>

                            </p>

                        </form>

                    </div>

                </div>

            </div>

        </div>
    );
}