"use client";
import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import { db } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

// ── Scroll-reveal hook ──────────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('reveal-visible'); }
      }),
      { threshold: 0.12 }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ── Chat Section ─────────────────────────────────────────────────────────────
function ChatSection() {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your AI legal assistant. Ask me anything about Indian law.", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: "I'm processing your legal query. Please consult a qualified lawyer for professional advice.",
        sender: 'bot'
      }]);
    }, 800);
  };

  useEffect(() => {
    if (messages.length > 1) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[70vh] max-w-3xl mx-auto w-full">
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-white text-black rounded-tr-none'
                : 'bg-white/10 text-gray-200 border border-white/10 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-3 mt-4">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          className="flex-1 bg-white/5 border border-white/15 rounded-xl px-5 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/40 transition"
          placeholder="Ask your legal question..."
        />
        <button
          onClick={sendMessage}
          className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}

// ── Lawyers Section ──────────────────────────────────────────────────────────
function LawyersSection() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), snap => {
      const list = [];
      snap.forEach(doc => {
        const d = doc.data();
        if (d.role === 'lawyer' || (d.lawyerid && d.lawyerid.trim() !== '')) list.push({ id: doc.id, ...d });
      });
      setLawyers(list);
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-40">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
    </div>
  );

  if (lawyers.length === 0) return (
    <p className="text-gray-400 text-center">No lawyers found in the system yet.</p>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {lawyers.map(lawyer => (
        <div key={lawyer.id} className="bg-[#222] rounded-3xl overflow-hidden shadow-lg border border-white/5 flex flex-col group">
          <div className="bg-[#e2e4b1] h-56 w-full flex justify-center items-end overflow-hidden">
            <div className="w-56 h-56 z-10 relative">
              <img
                src={`https://randomuser.me/api/portraits/${lawyer.gender === 'female' ? 'women' : 'men'}/${(lawyer.uid ? lawyer.uid.charCodeAt(lawyer.uid.length - 1) || 0 : 0) % 100}.jpg`}
                alt={lawyer.name || 'Lawyer'}
                className="w-full h-full object-cover object-bottom"
              />
            </div>
          </div>
          <div className="bg-[#2a2a2a] pt-6 pb-6 px-6 flex-grow flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2">Adv. {lawyer.name || 'Unknown'}</h3>
            <div className="space-y-1 mt-1 mb-8 text-sm text-gray-200">
              <p>Languages: {lawyer.languages || 'English, Hindi'}</p>
              {lawyer.experience && <p>Experience: {lawyer.experience}</p>}
              <p className="line-clamp-1">Location: {lawyer.officeAddress || 'Not specified'}</p>
              <p>ID: {lawyer.lawyerid}</p>
            </div>
            <div className="mt-auto flex justify-end">
              <button className="flex items-center gap-2 px-5 py-2 bg-black text-white rounded-full text-sm font-bold hover:bg-white hover:text-black transition">
                Connect
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Legal News Section ───────────────────────────────────────────────────────
function LegalNewsSection() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const cardColors = [
    'bg-gradient-to-br from-amber-900/40 to-[#1a1a1a]',
    'bg-gradient-to-br from-emerald-900/40 to-[#1a1a1a]',
    'bg-gradient-to-br from-blue-900/40 to-[#1a1a1a]',
    'bg-gradient-to-br from-rose-900/40 to-[#1a1a1a]',
    'bg-gradient-to-br from-purple-900/40 to-[#1a1a1a]',
    'bg-gradient-to-br from-cyan-900/40 to-[#1a1a1a]',
  ];

  useEffect(() => {
    fetch('/api/legal-news', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setNews(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-60">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
    </div>
  );

  if (news.length === 0) return <p className="text-gray-400 text-center">No news available right now.</p>;

  return (
    <div className="columns-1 md:columns-2 gap-5 space-y-5">
      {news.map((item, i) => (
        <a key={i} href={item.link || '#'} target="_blank" rel="noopener noreferrer" className="block break-inside-avoid group">
          <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/5 hover:border-white/15 transition-all duration-300">
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-700 rounded-full flex items-center justify-center font-bold text-white text-sm">L</div>
                <span className="text-sm font-medium">{item.source || 'LiveLaw.in'}</span>
              </div>
              <span className="text-xs text-gray-500 px-3 py-1 bg-white/5 rounded-full">Follow</span>
            </div>
            {item.image ? (
              <div className="w-full h-48 overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={e => { e.target.style.display = 'none'; }} />
              </div>
            ) : (
              <div className={`w-full h-32 ${cardColors[i % cardColors.length]} flex items-center justify-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.5} stroke="currentColor" className="w-16 h-16 text-white/10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6V7.5Z" />
                </svg>
              </div>
            )}
            <div className="px-4 pt-3 pb-4">
              <h2 className="text-base font-bold leading-snug group-hover:text-gray-200 transition">{item.title}</h2>
              {item.description && <p className="text-sm text-gray-400 mt-1 leading-relaxed">{item.description} <span className="text-gray-500">See more</span></p>}
              <span className="text-xs text-gray-500 mt-3 block">{item.time || '1d'}</span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function NeethiLandingPage() {
  useScrollReveal();

  return (
    <div className="bg-[#0a0a0a] font-sans text-white">
      <Navbar />

      {/* ── HERO ── */}
      <section id="hero" className="min-h-screen flex flex-col items-center justify-center overflow-hidden relative">
        <div className="flex flex-col items-center z-10 mt-4">
          <div className="relative flex justify-center items-end">
            <div className="absolute w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px]" />
            <div className="absolute w-[350px] h-[350px] bg-white/20 rounded-full blur-[70px]" />
            <img
              src="/icons/lady-justics.png"
              alt="Lady Justice holding scales"
              className="w-[340px] md:w-[480px] z-10 object-contain block leading-none reveal reveal-from-bottom"
            />
          </div>
          <h2 className="text-6xl md:text-[5.5rem] font-black tracking-[0.15em] mb-4 uppercase drop-shadow-lg z-20 leading-none reveal reveal-from-bottom" style={{ animationDelay: '0.1s' }}>
            NEETHI
          </h2>
          <div className="text-center mb-10 z-20 reveal reveal-from-bottom" style={{ animationDelay: '0.2s' }}>
            <p className="text-gray-300 italic text-xl md:text-2xl tracking-wide font-medium">
              "ഞാൻ ഒരു ക്രിമിനൽ വക്കീലാ... വെറും വക്കീലല്ല, ഒരു ഒന്നൊന്നര ക്രിമിനൽ!"
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 z-20 reveal reveal-from-bottom" style={{ animationDelay: '0.3s' }}>
            <a href="#chat">
              <button className="bg-white text-black px-8 py-3 rounded-md text-sm md:text-base font-bold tracking-wide hover:bg-gray-200 transition-colors shadow-lg">
                ASK LEGAL QUESTION
              </button>
            </a>
            <a href="#lawyers">
              <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-md text-sm md:text-base font-bold tracking-wide hover:bg-white/10 transition-colors shadow-lg">
                FIND LAWYER
              </button>
            </a>
          </div>
        </div>
        {/* Scroll hint */}
        <div className="absolute bottom-10 flex flex-col items-center gap-2 animate-bounce opacity-50">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="min-h-screen bg-[#0a0a0a] px-6 py-24 flex flex-col items-center">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-20 reveal reveal-from-bottom">
            <h1 className="text-5xl md:text-7xl font-black tracking-widest mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
              ABOUT NEETHI
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 font-light tracking-wide max-w-3xl mx-auto leading-relaxed">
              Where law meets technology to empower citizens with accessible legal knowledge and connect them with trusted professionals.
            </p>
          </div>

          <div className="w-full flex flex-col md:flex-row items-center gap-12 md:gap-20 mb-24 reveal reveal-from-left">
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-64 h-64 md:w-96 md:h-96">
                <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full" />
                <img src="/image-removebg-preview.png" alt="Neethi Mission" className="w-full h-full object-contain drop-shadow-2xl relative z-10" />
              </div>
            </div>
            <div className="md:w-1/2 space-y-6">
              <h2 className="text-3xl font-bold tracking-wider mb-4 border-b border-white/20 pb-4 inline-block">OUR MISSION</h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                The Indian legal system, while robust, often feels complex and inaccessible to the everyday citizen. NEETHI was born out of a desire to bridge this gap.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                We are an AI-powered legal awareness platform designed to democratize legal information. By translating dense legal concepts into plain language, we empower individuals to understand their rights and duties.
              </p>
            </div>
          </div>

          <div className="w-full mb-16 reveal reveal-from-bottom">
            <h2 className="text-3xl font-bold tracking-wider text-center mb-16">WHAT WE DO</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'AI Legal Assistant', desc: 'Ask everyday legal questions and get simplified, accurate answers powered by advanced artificial intelligence tailor-made for Indian Law.' },
                { title: 'Verified Network', desc: 'Browse our curated directory of verified legal professionals and advocates to find the right representation for your specific needs.', offset: true },
                { title: 'Real-time News', desc: 'Keep up with the latest legal happenings, judgements, and amendments from the Supreme Court and High Courts across India.' },
              ].map((card, i) => (
                <div key={i} className={`bg-[#151515] border border-white/10 p-8 rounded-2xl hover:bg-[#1a1a1a] hover:border-white/30 transition-all duration-300 flex flex-col items-center text-center group ${card.offset ? 'md:-translate-y-4' : ''}`}>
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6V7.5Z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 tracking-wide">{card.title}</h3>
                  <p className="text-gray-400 flex-grow">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── LAWYERS ── */}
      <section id="lawyers" className="min-h-screen bg-[#0a0a0a] px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="reveal reveal-from-bottom mb-12">
            <h1 className="text-5xl md:text-6xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 mb-4">
              FIND A LAWYER
            </h1>
            <p className="text-gray-400 text-lg">Connect with verified legal professionals across India.</p>
          </div>
          <div className="reveal reveal-from-bottom">
            <LawyersSection />
          </div>
        </div>
      </section>

      {/* ── CHAT ── */}
      <section id="chat" className="min-h-screen bg-[#0f0f0f] px-6 py-24 flex flex-col">
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
          <div className="reveal reveal-from-bottom mb-10">
            <h1 className="text-5xl md:text-6xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 mb-4">
              AI LEGAL CHAT
            </h1>
            <p className="text-gray-400 text-lg">Ask any legal question — get plain-language answers instantly.</p>
          </div>
          <div className="reveal reveal-from-bottom flex-1">
            <ChatSection />
          </div>
        </div>
      </section>

      {/* ── LEGAL NEWS ── */}
      <section id="legal-news" className="min-h-screen bg-[#0a0a0a] px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="reveal reveal-from-bottom mb-12">
            <h1 className="text-5xl md:text-6xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 mb-4">
              LEGAL NEWS
            </h1>
            <p className="text-gray-400 text-lg">Latest judgements, amendments and legal happenings across India.</p>
          </div>
          <div className="reveal reveal-from-bottom">
            <LegalNewsSection />
          </div>
        </div>
      </section>

    </div>
  );
}