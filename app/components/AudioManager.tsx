"use client";

import { useRef, forwardRef, useImperativeHandle } from "react";

export interface AudioManagerHandle {
  playIntro: () => void;
  playTrack1: () => void;
  fadeTrack1: () => void;
  fadeToTrack2: () => void; // kept for compatibility — same as playTrack1 continuation
  stopAll: () => void;
}

const AudioManager = forwardRef<AudioManagerHandle>((_, ref) => {
  const introRef  = useRef<HTMLAudioElement>(null);
  const track1Ref = useRef<HTMLAudioElement>(null);

  useImperativeHandle(ref, () => ({
    playIntro() {
      const ti = introRef.current;
      if (!ti) return;
      ti.currentTime = 0;
      ti.volume = 0;
      ti.play().catch(() => {});
      fadeIn(ti, 0.6, 1200);
    },
    playTrack1() {
      // Fade out intro, start track1
      const ti = introRef.current;
      if (ti && !ti.paused) fadeOut(ti, 1500);

      const t1 = track1Ref.current;
      if (!t1) return;
      t1.currentTime = 43;
      t1.volume = 0;
      t1.play().catch(() => {});
      fadeIn(t1, 0.65, 1500);
    },
    fadeTrack1() {
      // No-op during photo section fade — track1 keeps playing
    },
    fadeToTrack2() {
      // No Ariana track — track1 just keeps playing through letter
    },
    stopAll() {
      [introRef.current, track1Ref.current].forEach((t) => {
        if (t) fadeOut(t, 1000);
      });
    },
  }));

  return (
    <>
      <audio ref={introRef}  src="/music/intro.mp3"  loop preload="auto" />
      <audio ref={track1Ref} src="/music/track1.mp3" loop preload="auto" />
    </>
  );
});

AudioManager.displayName = "AudioManager";
export default AudioManager;

function fadeIn(audio: HTMLAudioElement, targetVol: number, ms: number) {
  const steps = 20;
  const interval = ms / steps;
  const step = targetVol / steps;
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= targetVol) {
      audio.volume = targetVol;
      clearInterval(timer);
    } else {
      audio.volume = current;
    }
  }, interval);
}

function fadeOut(audio: HTMLAudioElement, ms: number) {
  const steps = 20;
  const interval = ms / steps;
  const startVol = audio.volume;
  const step = startVol / steps;
  let current = startVol;
  const timer = setInterval(() => {
    current -= step;
    if (current <= 0) {
      audio.volume = 0;
      audio.pause();
      clearInterval(timer);
    } else {
      audio.volume = current;
    }
  }, interval);
}
