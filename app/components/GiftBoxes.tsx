"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { giftMessages } from "../data/assets";

interface GiftBoxesProps {
  onComplete: () => void;
}

const confettiColors = ["#e8637a", "#d4af7a", "#6b3fa0", "#f5a0b0", "#fff9", "#a855f7", "#34d399", "#60a5fa"];

function launchConfetti(x: number, y: number) {
  const container = document.getElementById("confetti-container");
  if (!container) return;
  for (let i = 0; i < 48; i++) {
    const el = document.createElement("div");
    const isRect = Math.random() > 0.5;
    el.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: ${isRect ? 8 + Math.random() * 6 : 6 + Math.random() * 5}px;
      height: ${isRect ? 4 + Math.random() * 3 : 6 + Math.random() * 5}px;
      background: ${confettiColors[Math.floor(Math.random() * confettiColors.length)]};
      border-radius: ${isRect ? "2px" : "50%"};
      pointer-events: none;
      z-index: 9999;
    `;
    container.appendChild(el);
    gsap.to(el, {
      x: (Math.random() - 0.5) * 320,
      y: -80 + Math.random() * -220,
      opacity: 0,
      rotation: Math.random() * 900,
      duration: 1 + Math.random() * 0.8,
      ease: "power2.out",
      onComplete: () => el.remove(),
    });
  }
}

// Box color schemes: [lid, body, ribbon, text]
const BOX_SCHEMES = [
  { lid: ["#f87171", "#dc2626"], body: ["#fca5a5", "#f87171"], ribbon: "#fff", accent: "#7f1d1d" },
  { lid: ["#fbbf24", "#d97706"], body: ["#fde68a", "#fbbf24"], ribbon: "#fff", accent: "#78350f" },
  { lid: ["#a78bfa", "#7c3aed"], body: ["#c4b5fd", "#a78bfa"], ribbon: "#fff", accent: "#3b0764" },
  { lid: ["#34d399", "#059669"], body: ["#6ee7b7", "#34d399"], ribbon: "#fff", accent: "#064e3b" },
  { lid: ["#f472b6", "#db2777"], body: ["#fbcfe8", "#f472b6"], ribbon: "#fff", accent: "#831843" },
  { lid: ["#60a5fa", "#2563eb"], body: ["#bfdbfe", "#60a5fa"], ribbon: "#fff", accent: "#1e3a8a" },
];

interface GiftCardProps {
  index: number;
  emoji: string;
  title: string;
  message: string;
  delay: number;
  onOpened: () => void;
}

function GiftCard({ index, emoji, title, message, delay, onOpened }: GiftCardProps) {
  const cardRef    = useRef<HTMLDivElement>(null);
  const lidRef     = useRef<HTMLDivElement>(null);
  const [opened, setOpened]   = useState(false);
  const [revealed, setRevealed] = useState(false);
  const scheme = BOX_SCHEMES[index % BOX_SCHEMES.length];

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 50, scale: 0.75, rotation: (index % 2 === 0 ? -3 : 3) },
      { opacity: 1, y: 0, scale: 1, rotation: 0, duration: 0.7, delay, ease: "back.out(1.8)" }
    );
    gsap.to(cardRef.current, {
      y: -5, yoyo: true, repeat: -1,
      duration: 1.8 + index * 0.25, ease: "sine.inOut", delay: delay + 0.8,
    });
  }, [delay, index]);

  const handleOpen = () => {
    if (opened) return;
    setOpened(true);
    onOpened();
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) launchConfetti(rect.left + rect.width / 2, rect.top + rect.height / 3);

    // Lid flies off upward
    gsap.to(lidRef.current, {
      y: -70, opacity: 0, rotation: (index % 2 === 0 ? -20 : 20), scale: 0.8,
      duration: 0.45, ease: "power3.out",
      onComplete: () => setRevealed(true),
    });
  };

  return (
    <div
      ref={cardRef}
      className="relative cursor-pointer select-none w-full"
      style={{ opacity: 0, aspectRatio: "3/4" }}
      onClick={handleOpen}
    >
      {/* ── BOX BODY ── */}
      <div className="absolute inset-0 rounded-2xl overflow-visible flex flex-col"
        style={{
          background: `linear-gradient(160deg, ${scheme.body[0]}, ${scheme.body[1]})`,
          boxShadow: `0 6px 24px ${scheme.body[1]}66, 0 2px 8px rgba(0,0,0,0.18)`,
          border: `2px solid ${scheme.body[1]}`,
        }}
      >
        {/* Vertical ribbon on body */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2"
          style={{ width: "14%", background: scheme.ribbon, opacity: 0.35, borderRadius: "2px" }} />

        {/* Content inside box (shown after lid removed) */}
        <div className="flex-1 flex flex-col items-center justify-center px-3 pt-2"
          style={{ opacity: revealed ? 1 : 0, transition: "opacity 0.4s 0.1s" }}>
          <div className="text-3xl mb-2" style={{ filter: `drop-shadow(0 2px 6px ${scheme.body[1]})` }}>
            {emoji}
          </div>
          <p className="text-center font-bold leading-tight mb-2"
            style={{
              fontSize: "clamp(0.65rem, 2.8vw, 0.78rem)",
              color: scheme.accent,
              fontFamily: "Georgia, serif",
              letterSpacing: "0.01em",
            }}>
            {title}
          </p>
          <p className="text-center leading-snug"
            style={{
              fontSize: "clamp(0.6rem, 2.4vw, 0.72rem)",
              color: scheme.accent,
              opacity: 0.85,
            }}>
            {message}
          </p>
        </div>

        {/* Tap hint */}
        {!opened && (
          <p className="absolute bottom-2 left-0 right-0 text-center"
            style={{
              fontSize: "clamp(0.6rem, 2.5vw, 0.7rem)",
              color: scheme.accent,
              opacity: 0.6,
              fontWeight: 600,
              letterSpacing: "0.08em",
            }}>
            Tap ✦
          </p>
        )}
      </div>

      {/* ── LID ── */}
      <div
        ref={lidRef}
        className="absolute left-0 right-0 rounded-t-2xl overflow-hidden flex items-center justify-center"
        style={{
          top: "-10%",
          height: "42%",
          background: `linear-gradient(145deg, ${scheme.lid[0]}, ${scheme.lid[1]})`,
          boxShadow: `0 4px 16px ${scheme.lid[1]}55, 0 2px 6px rgba(0,0,0,0.2)`,
          border: `2px solid ${scheme.lid[1]}`,
          zIndex: 10,
        }}
      >
        {/* Vertical ribbon on lid */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2"
          style={{ width: "14%", background: scheme.ribbon, opacity: 0.4 }} />
        {/* Bow */}
        <div className="relative z-10 flex items-center gap-0" style={{ marginTop: "-4px" }}>
          {/* Left loop */}
          <div style={{
            width: 20, height: 16,
            borderRadius: "50% 0 0 50%",
            background: scheme.ribbon,
            opacity: 0.9,
            transform: "rotate(-10deg) translateX(4px)",
            boxShadow: `0 1px 4px ${scheme.lid[1]}88`,
          }} />
          {/* Knot */}
          <div style={{
            width: 10, height: 10, borderRadius: "50%",
            background: scheme.ribbon,
            zIndex: 1,
            boxShadow: `0 1px 4px ${scheme.lid[1]}88`,
          }} />
          {/* Right loop */}
          <div style={{
            width: 20, height: 16,
            borderRadius: "0 50% 50% 0",
            background: scheme.ribbon,
            opacity: 0.9,
            transform: "rotate(10deg) translateX(-4px)",
            boxShadow: `0 1px 4px ${scheme.lid[1]}88`,
          }} />
        </div>
        {/* Ribbon tails */}
        <div className="absolute bottom-0 left-1/2" style={{
          width: 5, height: "40%",
          background: scheme.ribbon, opacity: 0.6,
          transform: "translateX(-50%) rotate(8deg)",
          transformOrigin: "top center",
        }} />
        <div className="absolute bottom-0 left-1/2" style={{
          width: 5, height: "40%",
          background: scheme.ribbon, opacity: 0.6,
          transform: "translateX(-50%) rotate(-8deg)",
          transformOrigin: "top center",
        }} />
        {/* Emoji peek */}
        <div className="absolute bottom-1 right-3 text-xl"
          style={{ filter: `drop-shadow(0 1px 3px ${scheme.lid[1]})` }}>
          {emoji}
        </div>
      </div>
    </div>
  );
}

export default function GiftBoxes({ onComplete }: GiftBoxesProps) {
  const containerRef  = useRef<HTMLDivElement>(null);
  const btnRef        = useRef<HTMLButtonElement>(null);
  const btnWrapRef    = useRef<HTMLDivElement>(null);
  const openedCount   = useRef(0);

  useEffect(() => {
    gsap.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 1.2 });
  }, []);

  const handleOpened = () => {
    openedCount.current += 1;
    if (openedCount.current === giftMessages.length) {
      // All opened — reveal button and smooth-scroll to it
      if (btnRef.current) {
        gsap.fromTo(btnRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 });
      }
      setTimeout(() => {
        btnWrapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 400);
    }
  };

  const handleContinue = () => {
    gsap.to(containerRef.current, { opacity: 0, duration: 0.8, onComplete });
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-40 flex flex-col items-center overflow-y-auto"
      style={{
        background: "radial-gradient(ellipse at top, #1a0830 0%, #0a0118 60%, #060010 100%)",
        opacity: 0,
        height: "100dvh",
        WebkitOverflowScrolling: "touch",
        paddingTop: "max(40px, env(safe-area-inset-top, 40px))",
        paddingBottom: "max(32px, env(safe-area-inset-bottom, 32px))",
      }}
    >
      {/* Confetti container */}
      <div id="confetti-container" className="fixed inset-0 pointer-events-none z-50" />

      {/* Floating petals */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="absolute text-xl"
            style={{
              left: `${8 + i * 9}%`, top: "-5%",
              animation: `petalFall ${5 + i * 0.8}s linear ${i * 0.7}s infinite`,
              opacity: 0.35,
            }}>
            {["🌸","🌹","✿","❀","🌺","🌷","💮","🌹","✿","❀"][i]}
          </div>
        ))}
      </div>

      {/* Heading */}
      <div className="relative z-10 text-center mb-5 px-4 w-full flex-shrink-0">
        <p className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: "#d4af7a" }}>
          ✦ For You ✦
        </p>
        <h2 className="font-bold"
          style={{ color: "rgba(255,240,248,0.97)", fontSize: "clamp(1.25rem, 6vw, 1.8rem)", fontFamily: "Georgia, serif" }}>
          Six gifts, all for Faith
        </h2>
        <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
          Tap each box to open it
        </p>
      </div>

      {/* Gift grid */}
      <div className="relative z-10 grid grid-cols-2 gap-4 w-full px-4 flex-shrink-0"
        style={{ maxWidth: "min(92vw, 480px)" }}>
        {giftMessages.map((gift, i) => (
          <GiftCard
            key={i}
            index={i}
            emoji={gift.emoji}
            title={gift.title}
            message={gift.message}
            delay={0.3 + i * 0.12}
            onOpened={handleOpened}
          />
        ))}
      </div>

      {/* Continue — hidden until all opened */}
      <div ref={btnWrapRef} className="relative z-10 w-full flex-shrink-0"
        style={{ maxWidth: "min(92vw, 360px)", margin: "32px auto 0", padding: "0 24px" }}>
        <button
          ref={btnRef}
          onClick={handleContinue}
          className="w-full rounded-full tracking-[0.25em] uppercase font-bold active:scale-95 transition-transform"
          style={{
            background: "linear-gradient(135deg, #e8637a, #d4af7a)",
            color: "white",
            border: "none",
            opacity: 0,
            boxShadow: "0 0 30px rgba(232,99,122,0.5)",
            minHeight: "52px",
            fontSize: "clamp(0.8rem, 3.5vw, 0.95rem)",
            fontFamily: "Georgia, serif",
          }}
        >
          🎂 Make a Wish ✦
        </button>
      </div>
    </div>
  );
}
