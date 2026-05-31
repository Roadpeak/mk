"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface CandleWishProps {
  onComplete: () => void;
}

// Use the first WhatsApp photo of her on the cake
const PHOTO = "/photos/WhatsApp Image 2026-05-31 at 02.47.54.jpeg";

const FIREWORK_COLORS = [
  "#e8637a","#d4af7a","#a855f7","#60a5fa","#34d399",
  "#f472b6","#fbbf24","#ffffff","#fb7185","#818cf8",
];

function launchFirework(x: number, y: number, container: HTMLElement) {
  const count = 32;
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    const angle = (i / count) * Math.PI * 2;
    const dist  = 60 + Math.random() * 90;
    const size  = 4 + Math.random() * 5;
    el.style.cssText = `
      position: fixed; left: ${x}px; top: ${y}px;
      width: ${size}px; height: ${size}px;
      border-radius: 50%;
      background: ${FIREWORK_COLORS[i % FIREWORK_COLORS.length]};
      pointer-events: none; z-index: 9999;
    `;
    container.appendChild(el);
    gsap.to(el, {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      opacity: 0,
      scale: 0.3,
      duration: 0.9 + Math.random() * 0.5,
      ease: "power2.out",
      onComplete: () => el.remove(),
    });
  }
}

function launchMultipleFireworks(container: HTMLElement) {
  const spots = [
    { x: window.innerWidth * 0.2,  y: window.innerHeight * 0.25 },
    { x: window.innerWidth * 0.8,  y: window.innerHeight * 0.2  },
    { x: window.innerWidth * 0.5,  y: window.innerHeight * 0.15 },
    { x: window.innerWidth * 0.15, y: window.innerHeight * 0.5  },
    { x: window.innerWidth * 0.85, y: window.innerHeight * 0.45 },
    { x: window.innerWidth * 0.35, y: window.innerHeight * 0.3  },
    { x: window.innerWidth * 0.65, y: window.innerHeight * 0.35 },
  ];
  spots.forEach((s, i) => {
    setTimeout(() => launchFirework(s.x, s.y, container), i * 180);
  });
  // Second wave
  setTimeout(() => {
    spots.forEach((s, i) => {
      setTimeout(() => launchFirework(
        s.x + (Math.random() - 0.5) * 60,
        s.y + (Math.random() - 0.5) * 40,
        container
      ), i * 160);
    });
  }, 1400);
}

export default function CandleWish({ onComplete }: CandleWishProps) {
  const containerRef  = useRef<HTMLDivElement>(null);
  const fxContainerRef= useRef<HTMLDivElement>(null);
  const cakeRef       = useRef<HTMLDivElement>(null);
  const flameRef      = useRef<HTMLDivElement>(null);
  const smokeRef      = useRef<HTMLDivElement>(null);
  const bouquetRef    = useRef<HTMLDivElement>(null);
  const wishRef       = useRef<HTMLDivElement>(null);
  const btnRef        = useRef<HTMLButtonElement>(null);
  const flameAnimRef  = useRef<gsap.core.Tween | null>(null);
  const [blown, setBlown]       = useState(false);
  const [showWish, setShowWish] = useState(false);

  useEffect(() => {
    gsap.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 1.2 });
    gsap.fromTo(cakeRef.current,
      { y: 80, opacity: 0, scale: 0.82 },
      { y: 0, opacity: 1, scale: 1, duration: 1.1, delay: 0.5, ease: "back.out(1.6)" }
    );
    // Flame flicker
    flameAnimRef.current = gsap.to(flameRef.current, {
      scaleX: 0.8, scaleY: 1.2, x: 2,
      yoyo: true, repeat: -1, duration: 0.13, ease: "none",
    });
  }, []);

  const blowCandle = () => {
    if (blown) return;
    setBlown(true);

    // Kill flicker
    flameAnimRef.current?.kill();

    // Flame snuffs out
    gsap.to(flameRef.current, { scaleY: 0, opacity: 0, duration: 0.25, ease: "power3.in" });

    // Smoke curls up
    gsap.to(smokeRef.current, { opacity: 1, y: -50, duration: 1.8, ease: "power1.out" });
    gsap.to(smokeRef.current, { opacity: 0, duration: 1.0, delay: 1.8 });

    // Fireworks after short pause
    setTimeout(() => {
      if (fxContainerRef.current) launchMultipleFireworks(fxContainerRef.current);
    }, 600);

    // Bouquet rises from bottom
    setTimeout(() => {
      if (bouquetRef.current) {
        gsap.fromTo(bouquetRef.current,
          { y: 120, opacity: 0, scale: 0.7 },
          { y: 0, opacity: 1, scale: 1, duration: 1.0, ease: "back.out(1.5)" }
        );
      }
    }, 900);

    // Second firework wave
    setTimeout(() => {
      if (fxContainerRef.current) launchMultipleFireworks(fxContainerRef.current);
    }, 2200);

    // Wish text
    setTimeout(() => {
      setShowWish(true);
      if (wishRef.current) {
        gsap.fromTo(wishRef.current,
          { opacity: 0, y: 24, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power2.out" }
        );
      }
      setTimeout(() => {
        if (btnRef.current)
          gsap.fromTo(btnRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8 });
      }, 1800);
    }, 2400);
  };

  const handleContinue = () => {
    gsap.to(containerRef.current, { opacity: 0, duration: 0.8, onComplete });
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-40 overflow-y-auto"
      style={{
        background: "radial-gradient(ellipse at center, #1a0a30 0%, #0a0118 60%, #060010 100%)",
        opacity: 0, height: "100dvh", WebkitOverflowScrolling: "touch",
      }}
    >
      {/* Firework / FX container */}
      <div ref={fxContainerRef} className="fixed inset-0 pointer-events-none z-50" />

      {/* Stars */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {Array.from({ length: 55 }).map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white" style={{
            width: "1px", height: "1px",
            left: `${(i * 19 + 5) % 100}%`,
            top: `${(i * 13 + 8) % 100}%`,
            opacity: 0.1 + (i % 5) * 0.05,
          }} />
        ))}
      </div>

      {/* Petals */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="absolute text-xl" style={{
            left: `${10 + i * 9}%`, top: "-5%",
            animation: `petalFall ${6 + i}s linear ${i * 0.9}s infinite`,
            opacity: 0.35,
          }}>
            {["🌸","🌹","✿","❀","🌺","🌷","💮","🌸","🌹","✿"][i]}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-sm mx-auto px-5"
        style={{ paddingTop: "max(36px, env(safe-area-inset-top, 36px))", paddingBottom: "max(32px, env(safe-area-inset-bottom, 32px))" }}>

        <p className="text-xs tracking-[0.4em] uppercase mb-5" style={{ color: "#d4af7a" }}>
          ✦ A wish, just for you ✦
        </p>

        {/* ── CAKE ── */}
        <div ref={cakeRef} className="relative flex flex-col items-center" style={{ opacity: 0 }}>

          {/* Candle + flame */}
          <div className="relative flex justify-center mb-0" style={{ height: "68px" }}>
            {/* Candle */}
            <div style={{
              width: "18px", height: "54px",
              background: "linear-gradient(180deg, #fef3c7 0%, #f5d76e 40%, #f0c040 100%)",
              borderRadius: "9px 9px 4px 4px",
              boxShadow: "inset -3px 0 6px rgba(0,0,0,0.12), 0 0 12px rgba(240,192,64,0.3)",
              position: "relative",
            }}>
              {/* Wax drip */}
              <div style={{
                position: "absolute", bottom: -4, left: "20%",
                width: "5px", height: "8px",
                background: "#f5d76e", borderRadius: "0 0 4px 4px",
              }} />
            </div>

            {/* Flame group */}
            <div ref={flameRef} className="absolute"
              style={{ bottom: "52px", left: "50%", transform: "translateX(-50%)", transformOrigin: "bottom center" }}>
              {/* Outer glow */}
              <div style={{
                width: "24px", height: "38px",
                background: "radial-gradient(ellipse at 50% 80%, #fff700 0%, #ff8c00 40%, #ff2200 80%, transparent 100%)",
                borderRadius: "50% 50% 35% 35% / 55% 55% 45% 45%",
                filter: "blur(2px)",
                boxShadow: "0 0 24px rgba(255,140,0,0.9), 0 0 48px rgba(255,80,0,0.5)",
              }} />
              {/* Inner bright core */}
              <div className="absolute" style={{
                bottom: "4px", left: "50%", transform: "translateX(-50%)",
                width: "11px", height: "20px",
                background: "radial-gradient(ellipse at bottom, #ffffff 0%, #fff700 60%, transparent 100%)",
                borderRadius: "50% 50% 35% 35% / 55% 55% 45% 45%",
              }} />
            </div>

            {/* Smoke */}
            <div ref={smokeRef} className="absolute flex flex-col items-center gap-0.5"
              style={{ bottom: "90px", left: "50%", transform: "translateX(-50%)", opacity: 0 }}>
              {[8,10,13,9,11].map((s, i) => (
                <div key={i} className="rounded-full" style={{
                  width: `${s}px`, height: `${s}px`,
                  background: "rgba(200,200,200,0.25)",
                  filter: "blur(3px)",
                  marginLeft: `${(i % 3 - 1) * 3}px`,
                }} />
              ))}
            </div>
          </div>

          {/* ── Tier 1 — top (photo frame) ── */}
          <div style={{
            width: "clamp(110px, 34vw, 140px)",
            background: "linear-gradient(160deg, #fce7f3, #fbcfe8, #f9a8d4)",
            borderRadius: "14px 14px 10px 10px",
            padding: "6px 6px 8px",
            boxShadow: "0 4px 20px rgba(244,114,182,0.5), inset 0 1px 0 rgba(255,255,255,0.6)",
            border: "2px solid rgba(244,114,182,0.4)",
            position: "relative",
          }}>
            {/* Decorative dots on tier */}
            {[15,35,55,75,90].map((x, i) => (
              <div key={i} style={{
                position: "absolute", bottom: 4, left: `${x}%`,
                width: 5, height: 5, borderRadius: "50%",
                background: i % 2 === 0 ? "#e8637a" : "#d4af7a",
                transform: "translateX(-50%)",
              }} />
            ))}
            {/* Her photo in a circle */}
            <div style={{
              width: "100%", paddingBottom: "100%", position: "relative",
              borderRadius: "10px", overflow: "hidden",
              border: "3px solid rgba(255,255,255,0.9)",
              boxShadow: "0 2px 12px rgba(232,99,122,0.4)",
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PHOTO} alt="Faith"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            {/* "24" badge */}
            <div style={{
              position: "absolute", top: -10, right: -10,
              background: "linear-gradient(135deg, #e8637a, #d4af7a)",
              color: "white", fontWeight: 800,
              fontSize: "11px", borderRadius: "50%",
              width: 28, height: 28,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 8px rgba(232,99,122,0.6)",
              fontFamily: "Georgia, serif",
            }}>24</div>
          </div>

          {/* ── Tier 2 — middle ── */}
          <div style={{
            width: "clamp(160px, 50vw, 200px)",
            height: "clamp(52px, 13vw, 68px)",
            marginTop: "-2px",
            background: "linear-gradient(160deg, #e0e7ff, #c7d2fe, #a5b4fc)",
            borderRadius: "10px",
            boxShadow: "0 4px 20px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.5)",
            border: "2px solid rgba(165,180,252,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", overflow: "hidden",
          }}>
            {/* Frosting swirls */}
            {[20,50,80].map((x, i) => (
              <div key={i} style={{
                position: "absolute", top: -8, left: `${x}%`, transform: "translateX(-50%)",
                width: 18, height: 18, borderRadius: "50%",
                background: "rgba(255,255,255,0.7)",
                boxShadow: "0 2px 6px rgba(99,102,241,0.3)",
              }} />
            ))}
            <span style={{ fontSize: "clamp(1.1rem, 5vw, 1.4rem)", position: "relative" }}>✨ 🎂 ✨</span>
          </div>

          {/* ── Tier 3 — base ── */}
          <div style={{
            width: "clamp(210px, 65vw, 260px)",
            height: "clamp(58px, 15vw, 76px)",
            marginTop: "-2px",
            background: "linear-gradient(160deg, #fef9c3, #fde68a, #fbbf24)",
            borderRadius: "10px 10px 8px 8px",
            boxShadow: "0 6px 24px rgba(251,191,36,0.5), inset 0 1px 0 rgba(255,255,255,0.6)",
            border: "2px solid rgba(251,191,36,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", overflow: "hidden",
          }}>
            {/* Polka dots */}
            {[12,28,44,60,76,92].map((x, i) => (
              <div key={i} style={{
                position: "absolute", top: "50%", left: `${x}%`, transform: "translate(-50%,-50%)",
                width: 8, height: 8, borderRadius: "50%",
                background: i % 2 === 0 ? "rgba(232,99,122,0.4)" : "rgba(107,63,160,0.35)",
              }} />
            ))}
            <p style={{
              fontFamily: "Georgia, serif", fontWeight: 700,
              fontSize: "clamp(0.72rem, 3.2vw, 0.9rem)",
              color: "rgba(120,60,0,0.85)", letterSpacing: "0.06em",
              position: "relative",
            }}>
              Happy Birthday Faith 🌹
            </p>
          </div>

          {/* Plate */}
          <div style={{
            width: "clamp(230px, 72vw, 290px)",
            height: "12px", marginTop: "-2px",
            background: "linear-gradient(90deg, #e8d5b7, #d4af7a, #e8d5b7)",
            borderRadius: "0 0 20px 20px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
          }} />
        </div>

        {/* ── BOUQUET — rises after blow ── */}
        <div ref={bouquetRef} className="mt-6 text-center" style={{ opacity: 0 }}>
          <div style={{ fontSize: "clamp(2.5rem, 12vw, 4rem)", lineHeight: 1.1, filter: "drop-shadow(0 4px 16px rgba(232,99,122,0.6))" }}>
            💐🌹🌸
          </div>
          <div style={{ fontSize: "clamp(1.8rem, 8vw, 2.8rem)", marginTop: "-4px", filter: "drop-shadow(0 2px 8px rgba(212,175,122,0.5))" }}>
            🌷🌺🌼
          </div>
        </div>

        {/* Blow button */}
        {!blown && (
          <button
            onClick={blowCandle}
            className="mt-8 w-full rounded-full tracking-[0.25em] uppercase font-bold active:scale-95 transition-transform"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.22)",
              color: "rgba(255,255,255,0.85)",
              animation: "pulse-glow 2s ease-in-out infinite",
              minHeight: "54px",
              fontSize: "clamp(0.82rem, 3.5vw, 0.95rem)",
            }}
          >
            🕯️ Blow out the candle
          </button>
        )}

        {/* Wish message */}
        {showWish && (
          <div ref={wishRef} className="mt-8 text-center w-full" style={{ opacity: 0 }}>
            <p style={{
              fontSize: "clamp(1.1rem, 5vw, 1.4rem)",
              fontWeight: 700, fontFamily: "Georgia, serif",
              color: "rgba(255,240,248,0.97)",
              textShadow: "0 0 30px rgba(232,99,122,0.6)",
              lineHeight: 1.5,
            }}>
              ✦ Your wish is already on its way ✦
            </p>
            <p className="mt-3" style={{ fontSize: "clamp(0.85rem, 3.5vw, 1rem)", color: "rgba(212,175,122,0.85)" }}>
              The universe heard you, Faith.
              <br />
              Everything you&apos;re dreaming of — it&apos;s coming.
            </p>
            <button
              ref={btnRef}
              onClick={handleContinue}
              className="mt-8 w-full rounded-full tracking-[0.25em] uppercase font-bold active:scale-95 transition-transform"
              style={{
                background: "linear-gradient(135deg, #e8637a, #d4af7a)",
                color: "white", border: "none", opacity: 0,
                boxShadow: "0 0 30px rgba(232,99,122,0.5)",
                minHeight: "54px",
                fontSize: "clamp(0.82rem, 3.5vw, 0.95rem)",
                fontFamily: "Georgia, serif",
              }}
            >
              ✦ One last thing ✦
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
