"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { videos } from "../data/assets";

interface VideoReelProps {
  onComplete: () => void;
}

export default function VideoReel({ onComplete }: VideoReelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs    = useRef<(HTMLVideoElement | null)[]>([]);
  const doneRef      = useRef(false);

  useEffect(() => {
    if (doneRef.current) return;

    // Fade screen in
    gsap.fromTo(containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: "power2.out" }
    );

    const els = videoRefs.current.filter(Boolean) as HTMLVideoElement[];

    // Each video starts at a different staggered time so they overlap
    // Video 0 — enters immediately from deep left-space
    // Video 1 — enters 1.8s later from deep right-space
    // Video 2 — enters 3.4s later from deep top-space
    // Video 3 — enters 5.0s later from deep bottom-space
    // Total visible window: ~12s, then they all drift out together

    const configs = [
      { enterDelay: 0,   fromX: "-130%", fromY:    "0%", fromScale: 0.5, rotation:  -6 },
      { enterDelay: 1.8, fromX:  "130%", fromY:    "0%", fromScale: 0.5, rotation:   5 },
      { enterDelay: 3.4, fromX:    "0%", fromY: "-130%", fromScale: 0.4, rotation:  -4 },
      { enterDelay: 5.0, fromX:    "0%", fromY:  "130%", fromScale: 0.4, rotation:   7 },
    ];

    els.forEach((vid, i) => {
      const cfg = configs[i] || configs[0];

      // Start video loading
      vid.src = videos[i];
      vid.load();

      // Set initial state — off screen + small (deep space feel)
      gsap.set(vid, {
        x: cfg.fromX,
        y: cfg.fromY,
        scale: cfg.fromScale,
        opacity: 0,
        rotation: cfg.rotation,
        zIndex: i + 1,
      });

      // Slide in from space
      gsap.to(vid, {
        x: 0, y: 0,
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 1.4,
        delay: cfg.enterDelay,
        ease: "power3.out",
        onStart: () => { vid.play().catch(() => {}); },
      });

      // Each video drifts and fades out after being on screen a bit
      const stayDuration = 4.5;
      gsap.to(vid, {
        opacity: 0,
        scale: 0.85,
        x: cfg.fromX === "0%" ? cfg.fromX : (parseFloat(cfg.fromX) * -0.4) + "%",
        duration: 1.2,
        delay: cfg.enterDelay + stayDuration,
        ease: "power2.in",
      });
    });

    // Total runtime: last video enters at 5.0s, stays 4.5s, fades 1.2s = ~10.7s
    // Fire onComplete at 11s
    const exitTimer = setTimeout(() => {
      if (doneRef.current) return;
      doneRef.current = true;
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.8,
        onComplete,
      });
    }, 11000);

    return () => clearTimeout(exitTimer);
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-40 overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at center, #0d0520 0%, #000 100%)",
        opacity: 0,
        height: "100dvh",
        perspective: "800px",
      }}
    >
      {/* Deep space star-dust background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.4) 0%, transparent 100%),
          radial-gradient(1px 1px at 80% 10%, rgba(255,255,255,0.3) 0%, transparent 100%),
          radial-gradient(1px 1px at 50% 70%, rgba(255,255,255,0.35) 0%, transparent 100%),
          radial-gradient(1px 1px at 10% 80%, rgba(255,255,255,0.25) 0%, transparent 100%),
          radial-gradient(1px 1px at 90% 60%, rgba(255,255,255,0.3) 0%, transparent 100%),
          radial-gradient(2px 2px at 35% 50%, rgba(212,175,122,0.3) 0%, transparent 100%),
          radial-gradient(2px 2px at 70% 40%, rgba(232,99,122,0.2) 0%, transparent 100%)
        `,
      }} />

      {/* Rose/purple nebula glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse at 25% 50%, rgba(107,63,160,0.25) 0%, transparent 50%),
          radial-gradient(ellipse at 75% 50%, rgba(232,99,122,0.15) 0%, transparent 50%)
        `,
      }} />

      {/* All 4 videos — stacked, each positioned absolute and centered */}
      {videos.map((_, i) => (
        <video
          key={i}
          ref={(el) => { videoRefs.current[i] = el; }}
          className="absolute"
          muted
          playsInline
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0,
            willChange: "transform, opacity",
          }}
        />
      ))}

      {/* Vignette on top of all videos */}
      <div className="absolute inset-0 pointer-events-none z-20" style={{
        background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
      }} />

      {/* Floating petals */}
      <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="absolute text-2xl" style={{
            left: `${12 + i * 16}%`,
            top: "-5%",
            animation: `petalFall ${6 + i}s linear ${i * 1.1}s infinite`,
            opacity: 0.45,
          }}>
            {["🌸","🌹","🌺","✿","❀","🌷"][i]}
          </div>
        ))}
      </div>
    </div>
  );
}
