import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-6xl font-bold">NEETHI</h1>

        <p className="mt-6 text-gray-400 max-w-2xl">
          AI-Powered Legal Awareness Platform designed to simplify Indian
          legal knowledge and connect citizens with verified lawyers.
        </p>

        <div className="mt-10 space-x-4">
          <button className="px-6 py-3 bg-white text-black rounded-lg">
            Ask Legal Question
          </button>

          <button className="px-6 py-3 border border-white rounded-lg">
            Find a Lawyer
          </button>
        </div>
      </main>
    </>
  );
}
