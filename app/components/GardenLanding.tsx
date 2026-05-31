"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface GardenLandingProps {
  onExplore: () => void;
}

const FloatingPetal = ({ index }: { index: number }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const startX = Math.random() * window.innerWidth;
    const duration = 5 + Math.random() * 6;
    const delay = Math.random() * 6;
    const drift = (Math.random() - 0.5) * 100;

    gsap.set(el, {
      x: startX,
      y: -50,
      rotation: Math.random() * 360,
      opacity: 0,
    });

    gsap.to(el, {
      y: window.innerHeight + 60,
      x: startX + drift,
      rotation: `+=${360 + Math.random() * 360}`,
      opacity: 0,
      duration,
      delay,
      ease: "none",
      repeat: -1,
      repeatDelay: Math.random() * 3,
      onStart: () => gsap.set(el, { opacity: 0.6 + Math.random() * 0.4 }),
    });
  }, []);

  const petals = ["🌸", "🌹", "🌺", "🌼", "✿", "❀", "🌷"];
  return (
    <div
      ref={ref}
      className="fixed pointer-events-none z-10 text-2xl"
    >
      {petals[index % petals.length]}
    </div>
  );
};

export default function GardenLanding({ onExplore }: GardenLandingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const vid = videoRef.current;
    if (vid) vid.play().catch(() => {});

    const tl = gsap.timeline({ delay: 0.2 });

    tl.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5, ease: "power2.out" }
    )
      .fromTo(
        cardRef.current,
        { opacity: 0, y: 40, scale: 0.95, filter: "blur(8px)" },
        { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 1.2, ease: "power3.out" },
        "-=0.8"
      )
      .fromTo(
        headingRef.current,
        { opacity: 0, y: 16, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power2.out" },
        "-=0.5"
      )
      .fromTo(
        btnRef.current,
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.7)" },
        "-=0.3"
      );

    // Pulse button
    gsap.to(btnRef.current, {
      boxShadow: "0 0 60px rgba(232,99,122,0.9), 0 0 100px rgba(212,175,122,0.4)",
      yoyo: true,
      repeat: -1,
      duration: 1.6,
      ease: "sine.inOut",
      delay: 2.5,
    });
  }, []);

  const handleExplore = () => {
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.9,
      ease: "power2.inOut",
      onComplete: onExplore,
    });
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-40 flex items-center justify-center overflow-hidden"
      style={{ background: "#000", opacity: 0, height: "100dvh" }}
    >
      {/* Garden video — full screen background */}
      <video
        ref={videoRef}
        src="/garden.mp4"
        className="absolute inset-0 w-full h-full object-cover"
        muted
        playsInline
        loop
        autoPlay
      />

      {/* Dark overlay for readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.65) 100%)",
        }}
      />

      {/* Bottom gradient — anchors the card */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: "50%",
          background: "linear-gradient(to top, rgba(10,1,24,0.7) 0%, transparent 100%)",
        }}
      />

      {/* Floating petals */}
      {Array.from({ length: 12 }).map((_, i) => (
        <FloatingPetal key={i} index={i} />
      ))}

      {/* Content card — frosted glass */}
      <div
        ref={cardRef}
        className="relative z-20 text-center px-6 py-8 mx-4 w-full rounded-3xl"
        style={{ maxWidth: "min(92vw, 480px)",
          background: "rgba(10,1,24,0.55)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
          opacity: 0,
        }}
      >
        {/* Rose icon */}
        <div className="text-4xl sm:text-5xl mb-4" style={{ filter: "drop-shadow(0 0 20px rgba(232,99,122,0.8))" }}>
          🌹
        </div>

        <h1
          ref={headingRef}
          className="font-light leading-relaxed"
          style={{ fontSize: "clamp(1.1rem, 5vw, 1.5rem)",
            color: "rgba(255,240,248,0.97)",
            textShadow: "0 0 30px rgba(232,99,122,0.4)",
            fontFamily: "Georgia, serif",
            opacity: 0,
          }}
        >
          You are about to enter a world
          <br />
          <span className="shimmer-text font-medium" style={{ fontSize: "1.05em" }}>
            beautiful beyond human imagination
          </span>
        </h1>

        {/* Divider */}
        <div
          className="mx-auto my-6 sm:my-8"
          style={{
            width: "60px",
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(212,175,122,0.6), transparent)",
          }}
        />

        <button
          ref={btnRef}
          onClick={handleExplore}
          className="w-full rounded-full tracking-[0.2em] uppercase font-medium transition-transform active:scale-95"
          style={{
            background: "linear-gradient(135deg, #e8637a, #d4af7a)",
            color: "white",
            border: "none",
            boxShadow: "0 0 30px rgba(232,99,122,0.5)",
            opacity: 0,
            minHeight: "56px",
            fontSize: "clamp(0.85rem, 3.5vw, 1rem)",
            fontFamily: "Georgia, serif",
          }}
        >
          Tap to explore ✦
        </button>
      </div>
    </div>
  );
}
