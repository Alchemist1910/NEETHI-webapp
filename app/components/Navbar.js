"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { usePathname } from "next/navigation";

const NAV_SECTIONS = [
  { label: "Home",        href: "#hero" },
  { label: "About",       href: "#about" },
  { label: "Lawyers",     href: "#lawyers" },
  { label: "Chat",        href: "#chat" },
  { label: "Legal News",  href: "#legal-news" },
];

export default function Navbar() {
  const [user, setUser]           = useState(null);
  const [active, setActive]       = useState("hero");
  const [scrolled, setScrolled]   = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname                  = usePathname();
  const isHomePage                = pathname === "/home";
  const dropdownRef               = useRef(null);

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u));
    return () => unsub();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll-spy + shadow on scroll
  useEffect(() => {
    if (!isHomePage) return;
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = NAV_SECTIONS.map(s => document.getElementById(s.href.slice(1)));
      let current = "hero";
      sections.forEach(sec => {
        if (sec && window.scrollY >= sec.offsetTop - 100) current = sec.id;
      });
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHomePage]);

  const handleLogout = async () => {
    setDropdownOpen(false);
    try { await signOut(auth); } catch (e) { console.error(e); }
  };

  const scrollTo = (e, href) => {
    if (!isHomePage || !href.startsWith("#")) return;
    e.preventDefault();
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={`sticky top-0 z-50 w-full px-10 py-4 flex justify-between items-center transition-all duration-300 ${
      scrolled ? "bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10 shadow-xl" : "bg-transparent border-b border-white/10"
    }`}>
      {/* Logo */}
      <button
        onClick={e => scrollTo(e, "#hero")}
        className="text-2xl font-black tracking-wider hover:opacity-80 transition cursor-pointer"
      >
        NEETHI
      </button>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-7">
        {NAV_SECTIONS.map(({ label, href }) => {
          const sectionId = href.slice(1);
          const isActive  = isHomePage && active === sectionId;
          return isHomePage ? (
            <a
              key={href}
              href={href}
              onClick={e => scrollTo(e, href)}
              className={`relative text-sm font-medium tracking-wide transition-colors duration-200 ${
                isActive ? "text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {label}
              <span className={`absolute -bottom-1 left-0 h-[2px] bg-white rounded-full transition-all duration-300 ${
                isActive ? "w-full" : "w-0"
              }`} />
            </a>
          ) : (
            <Link
              key={href}
              href={`/home${href}`}
              className="text-sm font-medium tracking-wide text-gray-400 hover:text-white transition-colors"
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* Auth */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="relative" ref={dropdownRef}>
            {/* Click-toggle avatar button */}
            <button
              onClick={() => setDropdownOpen(prev => !prev)}
              className="w-10 h-10 bg-white/5 border border-white/20 rounded-full flex justify-center items-center hover:bg-white hover:text-black transition focus:outline-none"
              aria-label="User menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </button>

            {/* Dropdown — renders in DOM only when open */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                <Link
                  href="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-800 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0" />
                  </svg>
                  My Profile
                </Link>
                <div className="border-t border-white/5" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-red-400 hover:bg-neutral-800 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link href="/login" className="text-sm text-gray-400 hover:text-white transition">Login</Link>
            <Link href="/register" className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-gray-200 transition">
              Create Account
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}