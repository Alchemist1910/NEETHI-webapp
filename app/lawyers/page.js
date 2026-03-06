import Navbar from "../components/Navbar";

export default function Lawyers() {
    const lawyers = [
        { name: "Adv. Rahul Menon", field: "Criminal Law", exp: "8 Years" },
        { name: "Adv. Priya Sharma", field: "Family Law", exp: "5 Years" },
    ];

    return (
        <>
            <Navbar />
            <div className="p-10 grid md:grid-cols-3 gap-6">
                {lawyers.map((lawyer, index) => (
                    <div
                        key={index}
                        className="bg-neutral-900 p-6 rounded-xl border border-white/20"
                    >
                        <h3 className="text-xl font-bold">{lawyer.name}</h3>
                        <p className="text-gray-400 mt-2">{lawyer.field}</p>
                        <p className="text-gray-500">{lawyer.exp}</p>

                        <button className="mt-4 w-full py-2 bg-white text-black rounded">
                            Connect
                        </button>
                    </div>
                ))}
            </div>
        </>
    );
}