"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { photos } from "../data/assets";

interface MosaicClosingProps {
  onReplay: () => void;
}

export default function MosaicClosing({ onReplay }: MosaicClosingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mosaicRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const finalTextRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const tilesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 1 });

    // Animate tiles in one by one, then reveal "24" overlay
    const tl = gsap.timeline();

    tilesRef.current.forEach((el, i) => {
      if (!el) return;
      tl.fromTo(
        el,
        { opacity: 0, scale: 0.7, rotation: (Math.random() - 0.5) * 20 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: "back.out(1.5)",
        },
        i * 0.04
      );
    });

    // Zoom mosaic out to reveal "24"
    tl.to(
      mosaicRef.current,
      { scale: 0.9, duration: 1.5, ease: "power2.inOut" },
      `+=${tilesRef.current.length * 0.04 + 0.2}`
    );

    // Overlay "24"
    tl.fromTo(
      overlayRef.current,
      { opacity: 0, scale: 1.3 },
      { opacity: 1, scale: 1, duration: 1, ease: "power2.out" },
      "-=0.8"
    );

    // Final text
    tl.fromTo(
      finalTextRef.current,
      { opacity: 0, y: 30, filter: "blur(10px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, ease: "power2.out" },
      "-=0.3"
    );

    tl.fromTo(
      btnRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      "-=0.4"
    );

    // Launch confetti
    tl.call(() => {
      launchFireworks();
    }, undefined, `-=${1}`);
  }, []);

  function launchFireworks() {
    const colors = ["#e8637a", "#d4af7a", "#6b3fa0", "#f5a0b0", "#ffffff", "#a855f7"];
    const container = document.getElementById("fireworks-container");
    if (!container) return;

    for (let burst = 0; burst < 8; burst++) {
      setTimeout(() => {
        const bx = Math.random() * window.innerWidth;
        const by = Math.random() * (window.innerHeight * 0.6);

        for (let i = 0; i < 25; i++) {
          const el = document.createElement("div");
          el.style.cssText = `
            position: fixed;
            left: ${bx}px;
            top: ${by}px;
            width: ${3 + Math.random() * 5}px;
            height: ${3 + Math.random() * 5}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
          `;
          container.appendChild(el);

          const angle = (i / 25) * 360;
          const distance = 60 + Math.random() * 120;
          gsap.to(el, {
            x: Math.cos((angle * Math.PI) / 180) * distance,
            y: Math.sin((angle * Math.PI) / 180) * distance + 60,
            opacity: 0,
            duration: 1 + Math.random() * 0.5,
            ease: "power2.out",
            onComplete: () => el.remove(),
          });
        }
      }, burst * 400);
    }
  }

  // Build mosaic grid — fewer cols on mobile
  const COLS = typeof window !== "undefined" && window.innerWidth < 640 ? 5 : 8;
  const ROWS = typeof window !== "undefined" && window.innerWidth < 640 ? 8 : 6;
  const total = COLS * ROWS;
  const tiles = Array.from({ length: total }, (_, i) => photos[i % photos.length]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-40 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at center, #1a0830 0%, #060010 100%)",
        opacity: 0,
        height: "100dvh",
      }}
    >
      {/* Fireworks container */}
      <div id="fireworks-container" className="fixed inset-0 pointer-events-none z-50" />

      {/* Floating petals */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-xl"
            style={{
              left: `${6 + i * 6}%`,
              top: "-5%",
              animation: `petalFall ${4 + i * 0.6}s linear ${i * 0.5}s infinite`,
              opacity: 0.5,
            }}
          >
            {["🌸", "🌹", "✿", "❀", "🌺", "🌷", "💮", "🌸", "🌹", "✿", "❀", "🌺", "🌷", "🌸", "🌹", "✿"][i]}
          </div>
        ))}
      </div>

      {/* Mosaic */}
      <div
        ref={mosaicRef}
        className="absolute inset-0"
        style={{ display: "grid", gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}
      >
        {tiles.map((src, i) => (
          <div
            key={i}
            ref={(el) => { tilesRef.current[i] = el; }}
            className="overflow-hidden"
            style={{
              backgroundImage: `url("${src}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0,
            }}
          />
        ))}
      </div>

      {/* Dark overlay on mosaic */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: "rgba(10,1,24,0.55)" }}
      />

      {/* "24" overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
        style={{ opacity: 0 }}
      >
        <span
          style={{
            fontSize: "clamp(200px, 35vw, 400px)",
            fontWeight: 800,
            color: "transparent",
            WebkitTextStroke: "2px rgba(212,175,122,0.5)",
            textShadow: "0 0 80px rgba(232,99,122,0.3)",
            lineHeight: 1,
            fontFamily: "Georgia, serif",
            letterSpacing: "-0.02em",
          }}
        >
          24
        </span>
      </div>

      {/* Final message */}
      <div
        ref={finalTextRef}
        className="relative z-30 text-center px-5 max-w-sm sm:max-w-2xl"
        style={{ opacity: 0 }}
      >
        <p
          className="text-2xl sm:text-4xl md:text-5xl font-light leading-tight mb-4"
          style={{
            color: "rgba(255,240,248,0.97)",
            textShadow: "0 0 40px rgba(232,99,122,0.6)",
          }}
        >
          The world is better
          <br />
          <span className="shimmer-text font-semibold">with you in it.</span>
        </p>
        <p
          className="text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase mt-4 sm:mt-6"
          style={{ color: "rgba(212,175,122,0.7)" }}
        >
          Happy 24th Birthday, Faith Makolla ✦ May 31, 2026
        </p>

        <div className="mt-10">
          <button
            ref={btnRef}
            onClick={() => {
              gsap.to(containerRef.current, {
                opacity: 0,
                duration: 0.8,
                onComplete: onReplay,
              });
            }}
            className="px-8 py-3 rounded-full text-xs tracking-[0.3em] uppercase hover:scale-105 active:scale-95 transition-transform"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.6)",
              opacity: 0,
            }}
          >
            ↺ Experience it again
          </button>
        </div>
      </div>
    </div>
  );
}
