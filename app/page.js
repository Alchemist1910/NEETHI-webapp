import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">

      <div className="flex items-center gap-12">

        <Image
          src="/neethi-logo.svg"
          width={260}
          height={260}
          alt="Neethi Logo"
        />

        <div>

          <h1 className="text-6xl font-serif font-bold">
            NEETHI
          </h1>

          <p className="text-gray-300 mt-2 tracking-widest">
            WHERE LAW MEETS TECHNOLOGY
          </p>

          <Link href="/role">
            <button className="mt-8 px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-800 transition">
              GET STARTED →
            </button>
          </Link>

        </div>

      </div>

    </div>
  )
}