"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { photos } from "../data/assets";

interface PhotoTimelineProps {
  onComplete: () => void;
  onFadeAudio?: () => void;
}

const BOOK_PHOTOS = photos.slice(0, 44);


// Directions each photo slides in from
const DIRECTIONS = [
  { x: "-100%", y: "0%" },   // from left
  { x: "100%",  y: "0%" },   // from right
  { x: "0%",    y: "-100%" },// from top
  { x: "0%",    y: "100%" }, // from bottom
  { x: "-100%", y: "-100%" },// top-left
  { x: "100%",  y: "-100%" },// top-right
  { x: "-100%", y: "100%" }, // bottom-left
  { x: "100%",  y: "100%" }, // bottom-right
];

export default function PhotoTimeline({ onComplete, onFadeAudio }: PhotoTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bookRef     = useRef<HTMLDivElement>(null);
  const coverRef    = useRef<HTMLDivElement>(null);
  const spineRef    = useRef<HTMLDivElement>(null);
  const marvelRef   = useRef<HTMLDivElement>(null);

  // Two layers — we swap between them
  const layerARef = useRef<HTMLDivElement>(null);
  const layerBRef = useRef<HTMLDivElement>(null);
  const [marvelActive, setMarvelActive] = useState(false);

  // Fade audio after 10s
  useEffect(() => {
    const t = setTimeout(() => onFadeAudio?.(), 10000);
    return () => clearTimeout(t);
  }, [onFadeAudio]);

  const startMarvelSequence = () => {
    setMarvelActive(true);

    gsap.fromTo(marvelRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power2.out" }
    );

    const totalPhotos = BOOK_PHOTOS.length;
    // 5 seconds total across all photos
    const INTERVAL = 5000 / totalPhotos;

    let idx = 0;
    let useA = true;

    const la = layerARef.current;
    const lb = layerBRef.current;
    if (!la || !lb) return;

    // Show first photo immediately
    la.style.backgroundImage = `url("${BOOK_PHOTOS[0]}")`;
    gsap.set(la, { x: 0, y: 0, opacity: 1, zIndex: 2 });
    gsap.set(lb, { opacity: 0, zIndex: 1 });

    const exitSequence = () => {
      setTimeout(() => {
        gsap.to(marvelRef.current, {
          opacity: 0, duration: 0.5,
          onComplete: () => {
            gsap.to(coverRef.current, {
              rotateY: 0, duration: 0.8, ease: "power2.inOut",
              onComplete: () => {
                gsap.to(containerRef.current, {
                  opacity: 0, duration: 0.6,
                  onComplete,
                });
              },
            });
          },
        });
      }, 500);
    };

    const step = () => {
      idx++;

      if (idx >= totalPhotos) {
        exitSequence();
        return;
      }

      const photo = BOOK_PHOTOS[idx];
      const dir   = DIRECTIONS[idx % DIRECTIONS.length];
      const incoming = useA ? la : lb;
      const outgoing = useA ? lb : la;

      incoming.style.backgroundImage = `url("${photo}")`;
      gsap.set(incoming, { x: dir.x, y: dir.y, opacity: 1, zIndex: 3 });
      gsap.set(outgoing, { zIndex: 2 });

      gsap.to(incoming, {
        x: 0, y: 0,
        duration: INTERVAL / 1000,
        ease: "power1.inOut",
      });

      gsap.to(outgoing, {
        opacity: 0,
        duration: (INTERVAL / 1000) * 0.5,
        ease: "power1.in",
      });

      useA = !useA;

      // Schedule next step
      setTimeout(step, INTERVAL);
    };

    // Start the loop
    setTimeout(step, INTERVAL);
  };

  // Book entrance + cover open
  useEffect(() => {
    const container = containerRef.current;
    const book      = bookRef.current;
    const cover     = coverRef.current;
    const spine     = spineRef.current;
    if (!container || !book || !cover || !spine) return;

    gsap.fromTo(container, { opacity: 0 }, { opacity: 1, duration: 0.8 });
    gsap.fromTo(spine,
      { scaleY: 0, opacity: 0 },
      { scaleY: 1, opacity: 1, duration: 0.5, delay: 0.3, ease: "back.out(2)" }
    );
    gsap.fromTo(book,
      { y: -50, opacity: 0, scale: 0.93 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, delay: 0.5, ease: "back.out(1.4)" }
    );

    gsap.to(cover, {
      rotateY: -165,
      duration: 1.0,
      delay: 1.2,
      ease: "power3.inOut",
      onComplete: startMarvelSequence,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-40 flex items-center justify-center"
      style={{
        background: "radial-gradient(ellipse at center, #1a0a2e 0%, #0a0118 60%, #000 100%)",
        opacity: 0,
        height: "100dvh",
        perspective: "1000px",
      }}
    >
      {/* Floating petals */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="fixed pointer-events-none text-lg"
          style={{
            left: `${10 + i * 15}%`, top: "-5%",
            animation: `petalFall ${6 + i}s linear ${i * 1.2}s infinite`,
            opacity: 0.35, zIndex: 5,
          }}
        >
          {["🌸","🌹","✿","❀","🌺","🌷"][i]}
        </div>
      ))}

      {/* ── THE BOOK — fills the entire screen ── */}
      <div
        ref={bookRef}
        className="absolute inset-0"
        style={{
          transformStyle: "preserve-3d",
          opacity: 0,
        }}
      >
        {/* SPINE */}
        <div
          ref={spineRef}
          className="absolute left-0 top-0 bottom-0 flex items-center justify-center"
          style={{
            width: "20px",
            background: "linear-gradient(180deg, #c0445c 0%, #8b2a40 50%, #6b1f30 100%)",
            boxShadow: "inset -3px 0 6px rgba(0,0,0,0.4), 2px 0 8px rgba(0,0,0,0.5)",
            zIndex: 20,
          }}
        >
          <p style={{
            writingMode: "vertical-rl",
            fontSize: "6px", letterSpacing: "0.18em",
            opacity: 0.65, color: "white",
            transform: "rotate(180deg)",
            textTransform: "uppercase",
            fontFamily: "Georgia, serif",
          }}>
            Faith Makolla
          </p>
        </div>

        {/* BACK COVER */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(135deg, #1a0a2e 0%, #0d0520 100%)",
          border: "1px solid rgba(212,175,122,0.12)",
          marginLeft: "20px", zIndex: 1,
        }} />

        {/* ── MARVEL PANEL (inside pages) ── */}
        <div
          ref={marvelRef}
          className="absolute inset-0 overflow-hidden"
          style={{ marginLeft: "20px", zIndex: marvelActive ? 8 : 0, opacity: 0, background: "#000" }}
        >
          {/* Layer A */}
          <div
            ref={layerARef}
            className="absolute inset-0"
            style={{
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              willChange: "transform",
            }}
          />
          {/* Layer B */}
          <div
            ref={layerBRef}
            className="absolute inset-0"
            style={{
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              willChange: "transform",
            }}
          />

          {/* Subtle vignette */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
            zIndex: 10,
          }} />
        </div>

        {/* COVER — flips open */}
        <div
          ref={coverRef}
          className="absolute inset-0"
          style={{
            marginLeft: "20px",
            transformOrigin: "left center",
            transformStyle: "preserve-3d",
            zIndex: 15,
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 overflow-hidden flex flex-col items-center justify-center"
            style={{
              backfaceVisibility: "hidden",
              background: "linear-gradient(145deg, #c0445c 0%, #8b2a40 50%, #5c1a2a 100%)",
            }}
          >
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="absolute left-0 right-0"
                style={{ top: `${7 + i * 7}%`, height: "1px", background: "rgba(255,255,255,0.035)" }}
              />
            ))}
            {/* Embossed border — inset from edges */}
            <div className="absolute"
              style={{ inset: "clamp(20px, 5vw, 40px)", border: "1px solid rgba(212,175,122,0.22)" }}
            />
            <div className="relative z-10 text-center px-8">
              <div className="mb-4" style={{ fontSize: "clamp(3rem, 10vw, 5rem)", filter: "drop-shadow(0 0 16px rgba(212,175,122,0.8))" }}>
                🌹
              </div>
              <p style={{
                fontSize: "clamp(1rem, 4vw, 1.5rem)",
                fontWeight: 300,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,240,240,0.97)",
                fontFamily: "Georgia, serif",
              }}>
                Faith Makolla
              </p>
              <div className="mx-auto mt-3"
                style={{ width: "50px", height: "1px", background: "rgba(212,175,122,0.55)" }}
              />
            </div>
            <p className="absolute text-center"
              style={{
                bottom: "clamp(20px, 5vw, 36px)",
                fontSize: "clamp(0.65rem, 2.5vw, 0.8rem)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(212,175,122,0.45)",
                fontFamily: "Georgia, serif",
              }}>
              A story in pictures
            </p>
          </div>

          {/* Cover inside */}
          <div className="absolute inset-0"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: "linear-gradient(135deg, #2a0d18 0%, #1a0a12 100%)",
            }}
          >
            <div className="absolute inset-0"
              style={{ background: "linear-gradient(to right, rgba(0,0,0,0.4) 0%, transparent 30%)" }}
            />
          </div>
        </div>
      </div>

      {/* Top badge */}
      <div className="absolute left-4 z-30"
        style={{ top: "max(18px, env(safe-area-inset-top, 18px))" }}>
        <span className="text-xs tracking-[0.2em] uppercase px-3 py-1.5 rounded-full"
          style={{
            background: "rgba(232,99,122,0.15)",
            border: "1px solid rgba(232,99,122,0.3)",
            color: "#f5a0b0",
          }}>
          Faith ✦ 24
        </span>
      </div>
    </div>
  );
}
