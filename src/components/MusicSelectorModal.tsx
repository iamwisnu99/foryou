"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Sparkles, Volume2, VolumeX } from "lucide-react";
import { useMusic } from "@/context/MusicContext";
import { DEFAULT_COVER } from "@/config/music";
import { confessionConfig } from "@/config/confession";

export default function MusicSelectorModal() {
  const {
    tracks,
    currentTrack,
    isPlaying,
    isSelectorOpen,
    closeSelector,
    playTrack,
    pause,
  } = useMusic();

  if (!isSelectorOpen) return null;

  const { crushName } = confessionConfig;

  return (
    <AnimatePresence>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
          background: "rgba(35, 15, 25, 0.45)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{
            width: "100%",
            maxWidth: "420px",
            background: "linear-gradient(180deg, #FFFFFF 0%, #FFF8FA 100%)",
            borderRadius: "24px",
            border: "1.5px solid rgba(255, 140, 165, 0.4)",
            boxShadow: "0 20px 50px rgba(255, 71, 126, 0.22)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            maxHeight: "88dvh",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "18px 20px 14px",
              borderBottom: "1px solid rgba(255, 180, 195, 0.25)",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              position: "relative",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "var(--color-primary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  marginBottom: "4px",
                }}
              >
                <Sparkles size={13} />
                <span>Pilihan Soundtrack</span>
              </div>
              <h2
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 800,
                  color: "var(--text-headline)",
                  margin: 0,
                }}
              >
                Ganti Lagu Pengiring 🎧
              </h2>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                  margin: "3px 0 0",
                  lineHeight: 1.4,
                }}
              >
                Pilih lagu yang ingin kamu dengar:
              </p>
            </div>

            <button
              type="button"
              onClick={closeSelector}
              aria-label="Tutup pilihan lagu"
              style={{
                background: "rgba(0, 0, 0, 0.04)",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--text-muted)",
                flexShrink: 0,
                marginLeft: "8px",
              }}
            >
              <X size={17} />
            </button>
          </div>

          {/* Track List */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "12px 14px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              overscrollBehavior: "contain",
            }}
          >
            {tracks.map((track) => {
              const isSelected = currentTrack?.id === track.id;

              return (
                <div
                  key={track.id}
                  onClick={() => {
                    playTrack(track);
                    closeSelector();
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 12px",
                    borderRadius: "16px",
                    cursor: "pointer",
                    border: isSelected
                      ? "1.5px solid var(--color-primary)"
                      : "1px solid rgba(0, 0, 0, 0.05)",
                    background: isSelected
                      ? "linear-gradient(135deg, rgba(255, 71, 126, 0.1) 0%, rgba(255, 230, 236, 0.45) 100%)"
                      : "rgba(255, 255, 255, 0.8)",
                    boxShadow: isSelected
                      ? "0 4px 14px rgba(255, 71, 126, 0.12)"
                      : "0 1px 3px rgba(0, 0, 0, 0.02)",
                    transition: "all 0.2s ease",
                    position: "relative",
                  }}
                >
                  {/* Album Cover Thumbnail */}
                  <div
                    style={{
                      position: "relative",
                      width: "46px",
                      height: "46px",
                      borderRadius: "10px",
                      overflow: "hidden",
                      flexShrink: 0,
                      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                      background: "#FCE7EC",
                    }}
                  >
                    <img
                      src={track.cover}
                      alt={track.title}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = DEFAULT_COVER;
                      }}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    {isSelected && isPlaying && (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "rgba(255, 71, 126, 0.35)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Volume2 size={18} color="#ffffff" />
                      </div>
                    )}
                  </div>

                  {/* Metadata */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: 700,
                          color: isSelected ? "var(--color-primary-text)" : "var(--text-headline)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "100%",
                        }}
                      >
                        {track.title}
                      </span>
                      {track.isSpecial && (
                        <span
                          style={{
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            padding: "2px 6px",
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, #FF477E 0%, #FF70A6 100%)",
                            color: "#ffffff",
                            letterSpacing: "0.02em",
                          }}
                        >
                          ⭐ Khusus {crushName}
                        </span>
                      )}
                    </div>

                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                        marginTop: "2px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{track.artist}</span>
                      {track.album && <span>&bull; {track.album}</span>}
                    </div>
                  </div>

                  {/* Select indicator */}
                  <div
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      border: isSelected
                        ? "none"
                        : "1.5px solid rgba(0, 0, 0, 0.15)",
                      background: isSelected ? "var(--color-primary)" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {isSelected && <Check size={13} color="#ffffff" strokeWidth={3} />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Actions */}
          <div
            style={{
              padding: "14px 18px",
              borderTop: "1px solid rgba(255, 180, 195, 0.25)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "rgba(255, 255, 255, 0.95)",
            }}
          >
            {isPlaying && (
              <button
                type="button"
                onClick={() => {
                  pause();
                  closeSelector();
                }}
                style={{
                  background: "rgba(0, 0, 0, 0.05)",
                  border: "none",
                  borderRadius: "var(--radius-full)",
                  padding: "8px 14px",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <VolumeX size={14} />
                <span>Matikan Musik</span>
              </button>
            )}

            <button
              type="button"
              onClick={closeSelector}
              className="btn-secondary"
              style={{
                marginLeft: "auto",
                padding: "8px 16px",
                fontSize: "0.82rem",
                borderRadius: "var(--radius-full)",
              }}
            >
              Tutup
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
