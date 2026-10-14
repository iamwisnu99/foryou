"use client";

import React, { useState, useEffect } from "react";
import StoryCardDeck from "@/components/StoryCardDeck";
import MusicSelectScreen from "@/components/MusicSelectScreen";
import MusicSelectorModal from "@/components/MusicSelectorModal";
import ClosedScreen from "@/components/ClosedScreen";
import ChatScreen from "@/components/ChatScreen";
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
  const [activeMode, setActiveMode] = useState<string>(() => {
    return (process.env.NEXT_PUBLIC_OPEN || "open").toLowerCase().trim();
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const queryMode = params.get("mode");
      if (queryMode && ["open", "close", "msgonly"].includes(queryMode.toLowerCase())) {
        setActiveMode(queryMode.toLowerCase());
      }
    }
  }, []);

  // Mode 2: close (Layar maintenance romantis & humoris)
  if (activeMode === "close") {
    return (
      <>
        <div className="bg-pattern" aria-hidden="true" />
        <main style={{ width: "100%", display: "flex", justifyContent: "center", minHeight: "100dvh" }}>
          <ClosedScreen />
        </main>
      </>
    );
  }

  // Mode 3: msgonly (Ruang chat Telegram terlindungi PIN 550504)
  if (activeMode === "msgonly") {
    return (
      <>
        <div className="bg-pattern" aria-hidden="true" />
        <main style={{ width: "100%", display: "flex", justifyContent: "center", minHeight: "100dvh" }}>
          <ChatScreen />
        </main>
      </>
    );
  }

  // Mode 1: open (Default alur website normal)
  return (
    <MusicProvider>
      <MainDeckOrMusicSelect />
    </MusicProvider>
  );
}
