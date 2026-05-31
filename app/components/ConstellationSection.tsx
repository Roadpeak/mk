"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { constellationStars } from "../data/assets";

interface ConstellationSectionProps {
  onComplete: () => void;
}

export default function ConstellationSection({ onComplete }: ConstellationSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const starRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const lineCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    gsap.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 1.2 });

    // Stagger stars in
    starRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(
        el,
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          delay: 0.3 + i * 0.12,
          ease: "back.out(2)",
        }
      );

      // Continuous twinkle
      gsap.to(el, {
        opacity: 0.6,
        scale: 0.95,
        yoyo: true,
        repeat: -1,
        duration: 1.5 + Math.random() * 1.5,
        delay: Math.random() * 2,
        ease: "sine.inOut",
      });
    });

    // Draw constellation lines on canvas
    const canvas = lineCanvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = "rgba(212,175,122,0.15)";
        ctx.lineWidth = 1;
        // Draw some connecting lines
        const connections = [
          [0, 4], [4, 8], [8, 11], [1, 5], [5, 10], [2, 6], [6, 9], [3, 7], [7, 11],
        ];
        connections.forEach(([a, b]) => {
          const sa = constellationStars[a];
          const sb = constellationStars[b];
          ctx.beginPath();
          ctx.moveTo((sa.x / 100) * canvas.width, (sa.y / 100) * canvas.height);
          ctx.lineTo((sb.x / 100) * canvas.width, (sb.y / 100) * canvas.height);
          ctx.stroke();
        });
      }
    }

    // Show button after stars animate in
    const t = setTimeout(() => {
      if (btnRef.current) {
        gsap.fromTo(btnRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 });
      }
    }, 2500);

    return () => clearTimeout(t);
  }, []);

  const handleStarClick = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
    const el = starRefs.current[index];
    if (el) {
      gsap.to(el, {
        scale: 1.4,
        duration: 0.2,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      });
    }
  };

  const handleContinue = () => {
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.8,
      onComplete,
    });
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-40 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at center, #0d0525 0%, #060010 100%)",
        opacity: 0,
        height: "100dvh",
      }}
    >
      {/* Background stars */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 120 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() < 0.8 ? 1 : 2}px`,
              height: `${Math.random() < 0.8 ? 1 : 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.1 + Math.random() * 0.3,
            }}
          />
        ))}
      </div>

      {/* Title */}
      <div className="relative z-10 text-center px-4 w-full"
        style={{ paddingTop: "max(20px, env(safe-area-inset-top, 20px))", marginBottom: "8px" }}>
        <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: "#d4af7a" }}>
          ✦ The Constellation of You ✦
        </p>
        <h2 className="font-light" style={{ color: "rgba(255,240,248,0.9)", fontSize: "clamp(1rem, 4.5vw, 1.5rem)" }}>
          Every star is a part of who you are
        </h2>
        <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
          Tap a star to discover it
        </p>
      </div>

      {/* Constellation canvas + stars */}
      <div className="relative w-full flex-1 max-w-3xl" style={{ minHeight: "380px" }}>
        <canvas ref={lineCanvasRef} className="absolute inset-0 w-full h-full" />

        {constellationStars.map((star, i) => (
          <div key={i} style={{ position: "absolute", left: `${star.x}%`, top: `${star.y}%` }}>
            <button
              ref={(el) => { starRefs.current[i] = el; }}
              onClick={() => handleStarClick(i)}
              className="relative flex items-center justify-center rounded-full transition-colors"
              style={{
                width: "48px",
                height: "48px",
                transform: "translate(-50%, -50%)",
                background: activeIndex === i
                  ? "rgba(212,175,122,0.3)"
                  : "rgba(255,255,255,0.05)",
                border: `1px solid ${activeIndex === i ? "#d4af7a" : "rgba(255,255,255,0.2)"}`,
                opacity: 0,
                touchAction: "manipulation",
              }}
            >
              {/* Glow */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  boxShadow: activeIndex === i
                    ? "0 0 20px rgba(212,175,122,0.8), 0 0 40px rgba(212,175,122,0.4)"
                    : "0 0 10px rgba(255,255,255,0.2)",
                }}
              />
              <span style={{ fontSize: "10px", color: "white", position: "relative", zIndex: 1 }}>✦</span>
            </button>

            {/* Label tooltip */}
            {activeIndex === i && (
              <div
                className="absolute pointer-events-none"
                style={{
                  left: "50%",
                  top: "-42px",
                  transform: "translateX(-50%)",
                  whiteSpace: "nowrap",
                  zIndex: 20,
                }}
              >
                <span
                  className="px-3 py-1 rounded-full text-xs tracking-widest uppercase"
                  style={{
                    background: "rgba(0,0,0,0.7)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(212,175,122,0.5)",
                    color: "#d4af7a",
                  }}
                >
                  {star.label}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Continue */}
      <div className="relative z-10 px-6 w-full max-w-xs mx-auto"
        style={{ paddingBottom: "max(24px, env(safe-area-inset-bottom, 24px))" }}>
        <button
          ref={btnRef}
          onClick={handleContinue}
          className="w-full py-4 rounded-full text-sm tracking-[0.3em] uppercase font-medium active:scale-95 transition-transform"
          style={{
            background: "linear-gradient(135deg, #6b3fa0, #e8637a)",
            color: "white",
            border: "none",
            opacity: 0,
            minHeight: "52px",
          }}
        >
          ✦ Open Your Gifts ✦
        </button>
      </div>
    </div>
  );
}
