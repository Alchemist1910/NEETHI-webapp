import Link from "next/link";
import Navbar from "../components/Navbar";

export default function RoleSelection() {
    return (
        <>
            <Navbar />
            <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-black text-white">
                <div className="bg-neutral-900 p-8 rounded-xl w-96 border border-white/20">
                    <h2 className="text-2xl font-bold text-center mb-8">Select Your Role</h2>

                    <div className="space-y-4">
                        <Link href="/home" className="block text-center w-full py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition">
                            Citizen
                        </Link>

                        <Link href="/register?role=lawyer" className="block text-center w-full py-3 bg-black border border-white/20 text-white font-medium rounded-lg hover:bg-white/10 transition">
                            Lawyer
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}