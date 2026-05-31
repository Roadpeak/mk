"use client";

import { useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import AudioManager, { AudioManagerHandle } from "./components/AudioManager";

const MovieIntro = dynamic(() => import("./components/MovieIntro"), { ssr: false });
const SpaceIntro = dynamic(() => import("./components/SpaceIntro"), { ssr: false });
const GardenLanding = dynamic(() => import("./components/GardenLanding"), { ssr: false });
const PhotoTimeline = dynamic(() => import("./components/PhotoTimeline"), { ssr: false });
const VideoReel = dynamic(() => import("./components/VideoReel"), { ssr: false });
const LetterSection = dynamic(() => import("./components/LetterSection"), { ssr: false });
const ConstellationSection = dynamic(() => import("./components/ConstellationSection"), { ssr: false });
const GiftBoxes = dynamic(() => import("./components/GiftBoxes"), { ssr: false });
const CandleWish = dynamic(() => import("./components/CandleWish"), { ssr: false });
const MosaicClosing = dynamic(() => import("./components/MosaicClosing"), { ssr: false });

type Stage =
  | "splash"
  | "intro"
  | "space"
  | "garden"
  | "photos"
  | "videos"
  | "letter"
  | "constellation"
  | "gifts"
  | "candle"
  | "mosaic";

export default function Home() {
  const [stage, setStage] = useState<Stage>("splash");
  const audioRef = useRef<AudioManagerHandle>(null);

  const go = useCallback((next: Stage) => {
    switch (next) {
      case "photos":
        audioRef.current?.playTrack1();
        break;
      case "letter":
        audioRef.current?.fadeToTrack2();
        break;
      case "mosaic":
        audioRef.current?.stopAll();
        break;
    }
    setStage(next);
  }, []);

  const handleReplay = useCallback(() => {
    audioRef.current?.stopAll();
    setStage("splash");
  }, []);

  // Splash tap — this is the user gesture that unlocks audio
  const handleSplashTap = useCallback(() => {
    audioRef.current?.playIntro();
    setStage("intro");
  }, []);

  return (
    <main className="fixed inset-0 overflow-hidden" style={{ height: "100dvh" }}>
      <AudioManager ref={audioRef} />

      {stage === "splash" && (
        <div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center cursor-pointer select-none"
          style={{ background: "#000", height: "100dvh" }}
          onClick={handleSplashTap}
        >
          {/* Subtle stars */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 60 }).map((_, i) => (
              <div key={i} className="absolute rounded-full bg-white" style={{
                width: `${1 + (i % 2)}px`, height: `${1 + (i % 2)}px`,
                left: `${(i * 17 + 3) % 100}%`,
                top: `${(i * 13 + 7) % 100}%`,
                opacity: 0.1 + (i % 5) * 0.05,
                animation: `pulse-glow ${2 + (i % 4)}s ease-in-out ${(i % 5) * 0.6}s infinite alternate`,
              }} />
            ))}
          </div>

          <div className="relative z-10 text-center px-8 flex flex-col items-center gap-8">
            <div style={{ fontSize: "clamp(3rem,14vw,5rem)", filter: "drop-shadow(0 0 24px rgba(232,99,122,0.8))" }}>
              🌹
            </div>
            <p style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1.1rem, 5vw, 1.4rem)",
              color: "rgba(255,240,248,0.9)",
              letterSpacing: "0.04em",
              lineHeight: 1.6,
            }}>
              Something beautiful<br />is waiting for you
            </p>
            {/* Pulsing tap button */}
            <div style={{
              marginTop: "8px",
              padding: "16px 40px",
              borderRadius: "999px",
              background: "linear-gradient(135deg, #e8637a, #d4af7a)",
              color: "white",
              fontFamily: "Georgia, serif",
              fontWeight: 700,
              fontSize: "clamp(0.85rem, 4vw, 1rem)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              boxShadow: "0 0 40px rgba(232,99,122,0.6)",
              animation: "pulse-glow 2s ease-in-out infinite",
              minHeight: "54px",
              display: "flex",
              alignItems: "center",
            }}>
              Tap to begin ✦
            </div>
          </div>
        </div>
      )}

      {stage === "intro" && (
        <MovieIntro onComplete={() => go("space")} />
      )}

      {stage === "space" && (
        <SpaceIntro onComplete={() => go("garden")} />
      )}

      {stage === "garden" && (
        <GardenLanding onExplore={() => go("photos")} />
      )}

      {stage === "photos" && (
        <PhotoTimeline
          onComplete={() => go("videos")}
          onFadeAudio={() => audioRef.current?.fadeTrack1()}
        />
      )}

      {stage === "videos" && (
        <VideoReel onComplete={() => go("letter")} />
      )}

      {stage === "letter" && (
        <LetterSection onComplete={() => go("constellation")} />
      )}

      {stage === "constellation" && (
        <ConstellationSection onComplete={() => go("gifts")} />
      )}

      {stage === "gifts" && (
        <GiftBoxes onComplete={() => go("candle")} />
      )}

      {stage === "candle" && (
        <CandleWish onComplete={() => go("mosaic")} />
      )}

      {stage === "mosaic" && (
        <MosaicClosing onReplay={handleReplay} />
      )}
    </main>
  );
}
