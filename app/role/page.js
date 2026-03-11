import Link from "next/link";
import Image from "next/image";

export default function RoleSelection() {
    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                .question {
                    font-size: 40px;
                    letter-spacing: 4px;
                    margin-bottom: 50px;
                    animation: bounce 1.5s infinite;
                }
                
                @media (min-width: 768px) {
                    .question {
                        font-size: 70px;
                        letter-spacing: 6px;
                    }
                }

                @keyframes bounce {
                    0%,
                    100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                }

                .role-buttons {
                    display: flex;
                    gap: 20px;
                    flex-direction: column;
                }

                @media (min-width: 768px) {
                    .role-buttons {
                        gap: 40px;
                        flex-direction: row;
                    }
                }

                .role-buttons button {
                    padding: 14px 35px;
                    font-size: 18px;
                    border-radius: 25px;
                    border: 2px solid white;
                    background: transparent;
                    color: white;
                    cursor: pointer;
                    transition: 0.3s;
                    min-width: 150px;
                }

                .role-buttons button:hover {
                    background: white;
                    color: black;
                }
                `
            }} />
            <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white font-serif p-4">

                <div className="logo mb-[30px]">
                    <Image
                        src="/image-removebg-preview.png"
                        alt="Logo"
                        width={200}
                        height={200}
                        className="w-[150px] md:w-[200px] h-auto"
                    />
                </div>

                <h1 className="question font-serif text-center font-bold font-serif uppercase">ARE YOU?</h1>

                <div className="role-buttons">
                    <Link href="/home">
                        <button className="font-serif font-bold tracking-widest uppercase">USER</button>
                    </Link>

                    <Link href="/register?role=lawyer">
                        <button className="font-serif font-bold tracking-widest uppercase">LAWYER</button>
                    </Link>
                </div>

            </div>
        </>
    );
}