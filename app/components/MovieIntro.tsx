"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface MovieIntroProps {
  onComplete: () => void;
}

const lines = [
  { text: "Buckle up.", delay: 0.5 },
  { text: "Hang tight.", delay: 2.2 },
  { text: "Something beautiful ahead.", delay: 4.0 },
];

export default function MovieIntro({ onComplete }: MovieIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline();

    // Cinematic bars slide in from top and bottom
    tl.fromTo(
      "#cinema-top",
      { y: "-100%" },
      { y: 0, duration: 0.6, ease: "power3.out" }
    )
      .fromTo(
        "#cinema-bottom",
        { y: "100%" },
        { y: 0, duration: 0.6, ease: "power3.out" },
        "<"
      );

    // Lines appear one by one
    lines.forEach((line, i) => {
      tl.fromTo(
        `#intro-line-${i}`,
        { opacity: 0, y: 16, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7, ease: "power2.out" },
        line.delay
      );
      // Fade out previous line
      if (i > 0) {
        tl.to(
          `#intro-line-${i - 1}`,
          { opacity: 0, duration: 0.4, ease: "power2.in" },
          line.delay - 0.1
        );
      }
    });

    // Hold last line, then fade it out
    tl.to(
      `#intro-line-${lines.length - 1}`,
      { opacity: 0, duration: 0.5, ease: "power2.in" },
      6.0
    );

    // Flash to white, then out
    tl.fromTo(
      "#flash",
      { opacity: 0 },
      { opacity: 1, duration: 0.25, ease: "power3.in" },
      6.4
    ).to(
      "#flash",
      { opacity: 0, duration: 0.5, ease: "power3.out" },
      6.65
    );

    // Bars slide out
    tl.to("#cinema-top", { y: "-100%", duration: 0.5, ease: "power3.in" }, 6.5);
    tl.to("#cinema-bottom", { y: "100%", duration: 0.5, ease: "power3.in" }, 6.5);

    // Fade container and move on
    tl.to(
      containerRef.current,
      {
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut",
        onComplete: () => {
          document.body.style.overflow = "";
          onComplete();
        },
      },
      7.0
    );

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "#000", height: "100dvh" }}
    >
      {/* Cinematic bars */}
      <div
        id="cinema-top"
        className="absolute top-0 left-0 right-0 z-20"
        style={{ height: "clamp(48px, 10vw, 90px)", background: "#000", transform: "translateY(-100%)" }}
      />
      <div
        id="cinema-bottom"
        className="absolute bottom-0 left-0 right-0 z-20"
        style={{ height: "clamp(48px, 10vw, 90px)", background: "#000", transform: "translateY(100%)" }}
      />

      {/* Flash overlay */}
      <div
        id="flash"
        className="absolute inset-0 z-30 pointer-events-none"
        style={{ background: "#fff", opacity: 0 }}
      />

      {/* Subtle film grain texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* Subtle vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* Lines */}
      <div className="relative z-10 text-center px-8 w-full max-w-lg mx-auto">
        {lines.map((line, i) => (
          <div
            key={i}
            id={`intro-line-${i}`}
            className="absolute left-0 right-0 px-8"
            style={{
              opacity: 0,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <p
              className={
                i < 2
                  ? "text-4xl sm:text-5xl md:text-6xl font-light tracking-[0.15em] uppercase"
                  : "text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.12em] italic"
              }
              style={{
                color: i < 2 ? "#ffffff" : "rgba(212,175,122,0.95)",
                textShadow:
                  i < 2
                    ? "0 0 60px rgba(255,255,255,0.3)"
                    : "0 0 40px rgba(212,175,122,0.6)",
                fontFamily: "Georgia, serif",
              }}
            >
              {line.text}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
