import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        .logo img {
            width: 300px;
        }

        .title {
            font-size: 95px;
            letter-spacing: 5px;
            margin: 0;
            display: flex;
        }

        .title span {
            opacity: 0;
            transform: translateY(-150px);
            text-shadow: 0 0 6px #ffffff, 0 0 10px #cccccc;
            animation: drop 0.8s forwards;
        }

        .title span:nth-child(1) { animation-delay: 0.2s; }
        .title span:nth-child(2) { animation-delay: 0.4s; }
        .title span:nth-child(3) { animation-delay: 0.6s; }
        .title span:nth-child(4) { animation-delay: 0.8s; }
        .title span:nth-child(5) { animation-delay: 1s; }
        .title span:nth-child(6) { animation-delay: 1.2s; }

        @keyframes drop {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .tagline {
            margin-top: 8px;
            letter-spacing: 3px;
            font-size: 16px;
            color: #d0d0d0;
        }

        .start-btn {
            margin-top: 30px;
            padding: 12px 35px;
            font-size: 16px;
            border-radius: 25px;
            border: 2px solid #bfbfbf;
            background: transparent;
            color: white;
            cursor: pointer;
            opacity: 0;
            transform: scale(0);
            animation: popup 0.5s forwards;
            animation-delay: 1.8s;
            transition: 0.3s;
        }

        .start-btn:hover {
            background: white;
            color: black;
        }

        @keyframes popup {
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        `
      }} />
      <div className="flex items-center justify-center min-h-screen bg-black text-white overflow-hidden w-full font-serif">
        <div className="flex items-center gap-[60px] md:flex-row flex-col text-center md:text-left px-4">

          {/* LEFT LOGO */}
          <div className="logo relative">
            <Image
              src="/image-removebg-preview.png"
              width={300}
              height={300}
              alt="Neethi Logo"
              className="w-[200px] md:w-[300px] h-auto mx-auto"
            />
          </div>

          {/* RIGHT TEXT */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="title font-anton">
              <span>N</span>
              <span>E</span>
              <span>E</span>
              <span>T</span>
              <span>H</span>
              <span>I</span>
            </h1>

            <p className="tagline font-serif">
              WHERE LAW MEETS TECHNOLOGY
            </p>

            <Link href="/role">
              <button className="start-btn font-serif">
                GET STARTED →
              </button>
            </Link>
          </div>

        </div>
      </div>
    </>
  )
}