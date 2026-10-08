"use client";

import React, { useState, useEffect, useRef } from "react";
import { Music, VolumeX } from "lucide-react";

export default function SoundtrackPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Soothing warm pentatonic music box chords & notes
  // C major / A minor soothing progression
  const melodyChords = [
    [261.63, 329.63, 392.00], // C4, E4, G4
    [329.63, 392.00, 523.25], // E4, G4, C5
    [220.00, 261.63, 329.63], // A3, C4, E4
    [261.63, 329.63, 440.00], // C4, E4, A4
    [174.61, 261.63, 349.23], // F3, C4, F4
    [220.00, 261.63, 349.23], // A3, C4, F4
    [196.00, 293.66, 392.00], // G3, D4, G4
    [246.94, 293.66, 392.00], // B3, D4, G4
  ];

  const playChord = (chord: number[]) => {
    const ctx = audioCtxRef.current;
    if (!ctx || ctx.state !== "running") return;

    chord.forEach((freq, idx) => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Warm sine wave with subtle triangle warmth
        osc.type = idx === 0 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const startTime = ctx.currentTime + idx * 0.04;
        const noteDuration = 1.6;

        // Gentle envelope (soft attack, pleasant kalimba/bell decay)
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.12, startTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + noteDuration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + noteDuration + 0.1);
      } catch {
        // Safe fail
      }
    });
  };

  const startLoop = () => {
    let index = 0;
    playChord(melodyChords[0]);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!isPlayingRef.current) return;
      index = (index + 1) % melodyChords.length;
      playChord(melodyChords[index]);
    }, 850);
  };

  const toggleMusic = async () => {
    try {
      if (!isPlaying) {
        // Unlock / create AudioContext on user touch/click
        if (!audioCtxRef.current) {
          const AudioContextClass =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext })
              .webkitAudioContext;
          audioCtxRef.current = new AudioContextClass();
        }

        const ctx = audioCtxRef.current;

        // Unlock iOS Safari with a brief silent buffer
        if (ctx.state === "suspended") {
          await ctx.resume();
        }

        const silentBuffer = ctx.createBuffer(1, 1, 22050);
        const source = ctx.createBufferSource();
        source.buffer = silentBuffer;
        source.connect(ctx.destination);
        source.start(0);

        isPlayingRef.current = true;
        setIsPlaying(true);
        startLoop();
      } else {
        isPlayingRef.current = false;
        setIsPlaying(false);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    } catch {
      setIsPlaying(false);
      isPlayingRef.current = false;
    }
  };

  useEffect(() => {
    return () => {
      isPlayingRef.current = false;
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {});
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: "16px",
        right: "16px",
        zIndex: 100,
      }}
    >
      <button
        onClick={toggleMusic}
        aria-label={isPlaying ? "Matikan musik pengiring" : "Putar musik pengiring"}
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: isPlaying
            ? "linear-gradient(135deg, #FF477E 0%, #FF70A6 100%)"
            : "rgba(255, 255, 255, 0.88)",
          color: isPlaying ? "#ffffff" : "var(--text-headline)",
          border: isPlaying ? "none" : "1px solid var(--border-soft)",
          boxShadow: isPlaying
            ? "0 6px 20px rgba(255, 71, 126, 0.45)"
            : "var(--shadow-sm)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          cursor: "pointer",
          transition: "all 0.25s ease",
          outline: "none",
        }}
      >
        {isPlaying ? (
          <Music
            size={20}
            style={{
              animation: "floatGentle 3s ease-in-out infinite",
            }}
          />
        ) : (
          <VolumeX size={19} color="var(--text-muted)" />
        )}
      </button>
    </div>
  );
}
