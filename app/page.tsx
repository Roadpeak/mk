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
  const [stage, setStage] = useState<Stage>("intro");
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
    setStage("intro");
  }, []);

  return (
    <main className="fixed inset-0 overflow-hidden" style={{ height: "100dvh" }}>
      <AudioManager ref={audioRef} />

      {stage === "intro" && (
        <MovieIntro
          onComplete={() => go("space")}
          onStart={() => audioRef.current?.playIntro()}
        />
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
