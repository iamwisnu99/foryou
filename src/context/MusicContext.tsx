"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { Track, TRACK_LIST } from "@/config/music";

interface MusicContextType {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  hasEntered: boolean;
  isSelectorOpen: boolean;
  playTrackAndEnter: (track: Track) => Promise<void>;
  skipAndEnter: () => void;
  playTrack: (track: Track) => Promise<void>;
  togglePlay: () => Promise<void>;
  pause: () => void;
  resume: () => Promise<void>;
  openSelector: () => void;
  closeSelector: () => void;
}

const MusicContext = createContext<MusicContextType | null>(null);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [tracks] = useState<Track[]>(TRACK_LIST);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio element once
  useEffect(() => {
    if (typeof window === "undefined") return;

    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0.75;
    audio.preload = "auto";

    audio.onplay = () => setIsPlaying(true);
    audio.onpause = () => setIsPlaying(false);
    audio.onerror = () => setIsPlaying(false);

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  const playTrack = useCallback(async (track: Track) => {
    setCurrentTrack(track);
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (audio.src !== window.location.origin + track.src && !audio.src.endsWith(track.src)) {
        audio.src = track.src;
        audio.currentTime = 0;
      }
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }, []);

  const playTrackAndEnter = useCallback(
    async (track: Track) => {
      setHasEntered(true);
      setIsSelectorOpen(false);
      await playTrack(track);
    },
    [playTrack]
  );

  const skipAndEnter = useCallback(() => {
    setHasEntered(true);
    setIsSelectorOpen(false);
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlaying(false);
  }, []);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);

  const resume = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (!audio.src || audio.src === "") {
        if (currentTrack) {
          audio.src = currentTrack.src;
        } else {
          // If no track selected yet, pick the first track
          const defaultTrack = TRACK_LIST[0];
          setCurrentTrack(defaultTrack);
          audio.src = defaultTrack.src;
        }
      }
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }, [currentTrack]);

  const togglePlay = useCallback(async () => {
    if (!currentTrack) {
      // If user skipped earlier and now taps play, open selector to choose
      setIsSelectorOpen(true);
      return;
    }

    if (isPlaying) {
      pause();
    } else {
      await resume();
    }
  }, [currentTrack, isPlaying, pause, resume]);

  const openSelector = useCallback(() => {
    setIsSelectorOpen(true);
  }, []);

  const closeSelector = useCallback(() => {
    setIsSelectorOpen(false);
  }, []);

  return (
    <MusicContext.Provider
      value={{
        tracks,
        currentTrack,
        isPlaying,
        hasEntered,
        isSelectorOpen,
        playTrackAndEnter,
        skipAndEnter,
        playTrack,
        togglePlay,
        pause,
        resume,
        openSelector,
        closeSelector,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
}
