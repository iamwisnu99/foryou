"use client";

import React from "react";
import { Music, VolumeX } from "lucide-react";
import { useMusic } from "@/context/MusicContext";

export default function SoundtrackPlayer() {
  const { isPlaying, togglePlay, currentTrack, openSelector } = useMusic();

  const handleClick = () => {
    if (!currentTrack) {
      openSelector();
    } else {
      togglePlay();
    }
  };

  return (
    <button
      onClick={handleClick}
      onContextMenu={(e) => {
        e.preventDefault();
        openSelector();
      }}
      type="button"
      aria-label={isPlaying ? "Jeda musik pengiring" : "Putar musik pengiring"}
      title={
        currentTrack
          ? isPlaying
            ? `🎵 Memutar: ${currentTrack.title} - ${currentTrack.artist} (Klik untuk jeda)`
            : `🔇 Musik dijeda: ${currentTrack.title} (Klik untuk putar)`
          : `🔇 Tanpa musik (Klik untuk memilih lagu)`
      }
      style={{
        width: "32px",
        height: "32px",
        minWidth: "32px",
        borderRadius: "50%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: isPlaying
          ? "linear-gradient(135deg, #FF477E 0%, #FF70A6 100%)"
          : "rgba(255, 255, 255, 0.92)",
        color: isPlaying ? "#ffffff" : "var(--text-headline)",
        border: isPlaying ? "none" : "1px solid var(--border-soft)",
        boxShadow: isPlaying
          ? "0 3px 12px rgba(255, 71, 126, 0.42)"
          : "0 1px 4px rgba(0, 0, 0, 0.06)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        cursor: "pointer",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        outline: "none",
        padding: 0,
        flexShrink: 0,
      }}
    >
      {isPlaying ? (
        <Music
          size={16}
          style={{
            animation: "floatGentle 2.5s ease-in-out infinite",
          }}
        />
      ) : (
        <VolumeX size={15} color="var(--text-muted)" />
      )}
    </button>
  );
}
