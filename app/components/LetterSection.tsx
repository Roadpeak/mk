"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface LetterSectionProps {
  onComplete: () => void;
}

const PARAGRAPHS = [
  {
    heading: "Faith.",
    lines: [
      "Today the universe pauses — because twenty-four years ago, something irreplaceable arrived.",
      "",
      "You.",
      "",
      "Not just beautiful in the way that catches eyes — but beautiful in the way that changes rooms, shifts moods, and stays in memories.",
    ],
  },
  {
    heading: null,
    lines: [
      "You are the kind of person who sets a goal and doesn't look for reasons it won't work. You look for the way through. You always find it.",
      "",
      "When the world got heavy — and it has — you didn't fold. You found hope. You found a reason. You kept going. That's not normal. That's extraordinary.",
      "",
      "Your heart is one of the warmest things this world holds. The way you give, the way you care, the way you show up for the people you love — it doesn't go unnoticed.",
    ],
  },
  {
    heading: null,
    lines: [
      "Those eyes. That smile. There is no combination more dangerous, more disarming, more unforgettable.",
      "",
      "You get to decide what your life becomes. No story is written for you. You write it. And everything in you is built for something great.",
      "",
      "So on this day — your day — know that you are seen. You are celebrated. You are deeply, deeply loved.",
      "",
      "Happy 24th Birthday, Faith.",
      "The world is better with you in it. 🌹",
    ],
  },
];

const FloatingPetal = ({ index }: { index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    gsap.set(el, { x: Math.random() * window.innerWidth, y: -30 });
    gsap.to(el, {
      y: window.innerHeight + 50,
      x: `+=${(Math.random() - 0.5) * 200}`,
      rotation: `+=${360 + Math.random() * 360}`,
      opacity: 0,
      duration: 7 + Math.random() * 5,
      delay: Math.random() * 8,
      ease: "none",
      repeat: -1,
      repeatDelay: Math.random() * 4,
      onStart: () => gsap.set(el, { opacity: 0.45 }),
    });
  }, []);
  const petals = ["🌸", "🌹", "✿", "❀", "🌺", "🌷"];
  return (
    <div ref={ref} className="fixed pointer-events-none z-0 text-xl" style={{ opacity: 0 }}>
      {petals[index % petals.length]}
    </div>
  );
};

export default function LetterSection({ onComplete }: LetterSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef    = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const isLast = page === PARAGRAPHS.length - 1;

  useEffect(() => {
    gsap.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 1.2 });
  }, []);

  useEffect(() => {
    if (!scrollRef.current) return;
    const lines = scrollRef.current.querySelectorAll<HTMLElement>(".letter-line");
    gsap.fromTo(
      lines,
      { opacity: 0, y: 22, filter: "blur(5px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.65, stagger: 0.09, ease: "power2.out", delay: 0.1 }
    );
  }, [page]);

  const handleNext = () => {
    if (!scrollRef.current) return;
    const lines = scrollRef.current.querySelectorAll<HTMLElement>(".letter-line");
    gsap.to(lines, {
      opacity: 0, y: -18, filter: "blur(5px)",
      duration: 0.35, stagger: 0.04, ease: "power2.in",
      onComplete: () => setPage((p) => p + 1),
    });
  };

  const handleContinue = () => {
    gsap.to(containerRef.current, {
      opacity: 0, y: -20, duration: 0.8, ease: "power2.inOut", onComplete,
    });
  };

  const para = PARAGRAPHS[page];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-40 flex flex-col"
      style={{
        background: "radial-gradient(ellipse at top, #1a0830 0%, #0a0118 50%, #060010 100%)",
        opacity: 0,
        height: "100dvh",
      }}
    >
      {/* Background stars */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {Array.from({ length: 60 }).map((_, i) => (
          <div key={i} className="absolute rounded-full" style={{
            width: `${1 + (i % 3) * 0.8}px`,
            height: `${1 + (i % 3) * 0.8}px`,
            left: `${(i * 17 + 3) % 100}%`,
            top: `${(i * 13 + 7) % 100}%`,
            background: "white",
            opacity: 0.15 + (i % 5) * 0.06,
            animation: `pulse-glow ${2 + (i % 4)}s ease-in-out ${(i % 5) * 0.6}s infinite alternate`,
          }} />
        ))}
      </div>

      {/* Floating petals */}
      {Array.from({ length: 8 }).map((_, i) => (
        <FloatingPetal key={i} index={i} />
      ))}

      {/* Top badge */}
      <div className="relative z-10 flex justify-center flex-shrink-0"
        style={{ paddingTop: "max(20px, env(safe-area-inset-top, 20px))", paddingBottom: "8px" }}>
        <div className="px-4 py-1.5 rounded-full text-xs tracking-[0.3em] uppercase" style={{
          background: "rgba(107,63,160,0.3)",
          border: "1px solid rgba(107,63,160,0.5)",
          color: "rgba(200,160,255,0.85)",
        }}>
          ♪ A letter to you
        </div>
      </div>

      {/* Page indicator dots */}
      <div className="relative z-10 flex justify-center gap-2 pb-2 flex-shrink-0">
        {PARAGRAPHS.map((_, i) => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: "50%",
            background: i === page ? "rgba(212,175,122,0.9)" : "rgba(212,175,122,0.25)",
            transition: "background 0.4s",
          }} />
        ))}
      </div>

      {/* ── LETTER SCROLL — fills remaining screen ── */}
      <div className="relative z-10 flex-1 mx-3 mb-3 overflow-hidden flex flex-col"
        style={{
          minHeight: 0,
          borderRadius: "20px",
          background: "linear-gradient(160deg, #fdf8f0 0%, #faeee0 50%, #f5e3d0 100%)",
          boxShadow: "0 10px 50px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.95)",
          /* Scroll curl effect at top */
        }}
      >
        {/* Top curl shadow */}
        <div className="absolute top-0 left-0 right-0 h-3 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, rgba(180,140,100,0.12), transparent)",
            zIndex: 2,
            borderRadius: "20px 20px 0 0",
          }}
        />

        {/* Rose medallion */}
        <div className="flex-shrink-0 flex items-center justify-center pt-6 pb-3 relative z-10">
          <div className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #e8637a, #d4af7a)",
              boxShadow: "0 3px 16px rgba(232,99,122,0.55)",
            }}>
            <span style={{ fontSize: "1.4rem" }}>🌹</span>
          </div>
        </div>

        {/* Text content — scrollable */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto relative z-10"
          style={{
            WebkitOverflowScrolling: "touch",
            padding: "0 clamp(20px, 7vw, 40px) 16px",
          }}>

          {/* Heading */}
          {para.heading && (
            <p className="letter-line text-center mb-5 font-bold" style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1.6rem, 7vw, 2.2rem)",
              background: "linear-gradient(135deg, #c0445c, #8b2a40)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "0.05em",
            }}>
              {para.heading}
            </p>
          )}

          {/* Body lines — centered, bold */}
          <div>
            {para.lines.map((line, i) => {
              if (line === "") return (
                <div key={i} className="letter-line" style={{ height: "0.75rem" }} />
              );
              const isHappy = line.startsWith("Happy 24th");
              const isWorld = line.startsWith("The world");
              const isYou   = line === "You.";
              return (
                <p key={i} className="letter-line text-center"
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: isHappy || isYou
                      ? "clamp(1.15rem, 5vw, 1.4rem)"
                      : "clamp(0.95rem, 4vw, 1.15rem)",
                    fontWeight: isHappy || isYou ? 700 : 600,
                    color: isHappy   ? "#8b2a40"
                         : isWorld   ? "#6b3fa0"
                         : isYou     ? "#c0445c"
                         : "#2e1508",
                    lineHeight: 1.9,
                    fontStyle: isWorld ? "italic" : "normal",
                  }}>
                  {line}
                </p>
              );
            })}
          </div>

          {/* Flourish on last page */}
          {isLast && (
            <div className="letter-line mt-6 text-center">
              <div className="w-20 h-px mx-auto mb-3"
                style={{ background: "linear-gradient(90deg, transparent, rgba(192,68,92,0.45), transparent)" }}
              />
              <p className="text-xs tracking-[0.35em] uppercase"
                style={{ color: "rgba(139,42,64,0.4)", fontFamily: "Georgia, serif" }}>
                Written in the stars ✦ May 31
              </p>
            </div>
          )}
        </div>

        {/* Pinned button */}
        <div className="flex-shrink-0 flex justify-center relative z-10"
          style={{
            padding: "12px clamp(20px,7vw,40px) max(20px, env(safe-area-inset-bottom, 20px))",
            borderTop: "1px solid rgba(180,150,120,0.18)",
          }}>
          {isLast ? (
            <button
              onClick={handleContinue}
              className="w-full max-w-xs rounded-full tracking-[0.25em] uppercase font-bold active:scale-95 transition-transform"
              style={{
                background: "linear-gradient(135deg, #c0445c, #d4af7a)",
                color: "white",
                border: "none",
                fontFamily: "Georgia, serif",
                fontSize: "clamp(0.8rem, 3.5vw, 0.9rem)",
                boxShadow: "0 4px 20px rgba(192,68,92,0.45)",
                minHeight: "52px",
              }}
            >
              Continue ✦
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full max-w-xs rounded-full tracking-[0.25em] uppercase font-bold active:scale-95 transition-transform"
              style={{
                background: "linear-gradient(135deg, #8b2a40, #c0445c)",
                color: "#fdf6ec",
                border: "none",
                fontFamily: "Georgia, serif",
                fontSize: "clamp(0.8rem, 3.5vw, 0.9rem)",
                boxShadow: "0 4px 20px rgba(139,42,64,0.4)",
                minHeight: "52px",
              }}
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
