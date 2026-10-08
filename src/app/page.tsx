"use client";

import React from "react";
import StoryCardDeck from "@/components/StoryCardDeck";
import MusicSelectScreen from "@/components/MusicSelectScreen";
import MusicSelectorModal from "@/components/MusicSelectorModal";
import { MusicProvider, useMusic } from "@/context/MusicContext";

function MainDeckOrMusicSelect() {
  const { hasEntered } = useMusic();

  return (
    <>
      {/* Decorative ambient background grid dots */}
      <div className="bg-pattern" aria-hidden="true" />

      <main style={{ width: "100%", display: "flex", justifyContent: "center", minHeight: "100dvh" }}>
        {!hasEntered ? (
          <MusicSelectScreen />
        ) : (
          <StoryCardDeck />
        )}
      </main>

      {/* Modal for switching songs anytime during the story */}
      <MusicSelectorModal />
    </>
  );
}

export default function Home() {
  return (
    <MusicProvider>
      <MainDeckOrMusicSelect />
    </MusicProvider>
  );
}
