"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface SpaceIntroProps {
  onComplete: () => void;
}

export default function SpaceIntro({ onComplete }: SpaceIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    vid.play().catch(() => {});

    const tl = gsap.timeline();

    // Fade in the video
    tl.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.2, ease: "power2.out" }
    );

    // Fade to black then call onComplete
    tl.to(
      overlayRef.current,
      { opacity: 1, duration: 1.0, ease: "power2.in" },
      6.0
    );

    tl.call(() => onComplete(), undefined, 7.0);

    return () => { tl.kill(); };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ background: "#000", opacity: 0, height: "100dvh" }}
    >
      {/* Space video — looped, fills screen */}
      <video
        ref={videoRef}
        src="/space.mp4"
        className="absolute inset-0 w-full h-full object-cover"
        muted
        playsInline
        loop
        autoPlay
      />

      {/* Purple/rose tint overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 40%, rgba(107,63,160,0.35) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(232,99,122,0.2) 0%, transparent 50%)",
          mixBlendMode: "screen",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Fade-to-black overlay for transition */}
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none z-20"
        style={{ background: "#000", opacity: 0 }}
      />

    </div>
  );
}
