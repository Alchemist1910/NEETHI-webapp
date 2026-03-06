import Navbar from "../components/Navbar";

export default function Register() {
    return (
        <>
            <Navbar />
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-neutral-900 p-8 rounded-xl w-96 border border-white/20">
                    <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

                    <select className="w-full mb-4 p-3 bg-black border border-white/20 rounded">
                        <option>User</option>
                        <option>Lawyer</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full mb-4 p-3 bg-black border border-white/20 rounded"
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full mb-4 p-3 bg-black border border-white/20 rounded"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full mb-6 p-3 bg-black border border-white/20 rounded"
                    />

                    <button className="w-full py-3 bg-white text-black rounded-lg">
                        Register
                    </button>
                </div>
            </div>
        </>
    );
}