import React from "react";
import StoryCardDeck from "@/components/StoryCardDeck";
import SoundtrackPlayer from "@/components/SoundtrackPlayer";

export default function Home() {
  return (
    <>
      {/* Decorative ambient background grid dots */}
      <div className="bg-pattern" aria-hidden="true" />

      {/* Main Story Card Deck (Step-by-Step Effortless Mobile Experience) */}
      <main style={{ width: "100%", display: "flex", justifyContent: "center", minHeight: "100dvh" }}>
        <StoryCardDeck />
      </main>

      {/* Ambient Lo-fi Music Player */}
      <SoundtrackPlayer />
    </>
  );
}
