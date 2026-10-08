"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  SkipForward,
  Play,
  Music2,
  ShieldCheck,
  Disc3,
} from "lucide-react";
import { useMusic } from "@/context/MusicContext";
import { DEFAULT_COVER } from "@/config/music";
import { confessionConfig } from "@/config/confession";

export default function MusicSelectScreen() {
  const { tracks, playTrackAndEnter, skipAndEnter } = useMusic();
  const { crushName, crushNickname } = confessionConfig;

  return (
    <div className="story-wrapper">
      {/* Header bar */}
      <header>
        <div className="story-step-badge" style={{ justifyContent: "center" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <span className="badge-pill badge-pink" style={{ padding: "3px 10px", fontSize: "0.75rem" }}>
              <Sparkles size={12} style={{ display: "inline", marginRight: "3px" }} />
              Sebelum Mulai Cerita
            </span>
          </span>
        </div>
      </header>

      {/* Main Card */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="glass-card"
        >
          <div
            className="story-card-scrollable"
            style={{
              textAlign: "center",
              alignItems: "center",
              maxHeight: "calc(100dvh - 120px)",
            }}
          >
            {/* Bear Mascot */}
            <div style={{ width: "80px", height: "80px", margin: "0 auto" }}>
              <div
                className="animate-bear-dash"
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg viewBox="0 0 140 140" width="76" height="76" fill="none">
                  <circle cx="45" cy="40" r="18" fill="#8D5B4C" />
                  <circle cx="45" cy="40" r="10" fill="#E8B4B8" />
                  <circle cx="95" cy="40" r="18" fill="#8D5B4C" />
                  <circle cx="95" cy="40" r="10" fill="#E8B4B8" />
                  <circle cx="70" cy="70" r="42" fill="#A06856" />
                  <ellipse cx="46" cy="78" rx="8" ry="5" fill="#FF8DA1" opacity="0.6" />
                  <ellipse cx="94" cy="78" rx="8" ry="5" fill="#FF8DA1" opacity="0.6" />
                  <ellipse cx="70" cy="78" rx="18" ry="14" fill="#EAD5C7" />
                  <ellipse cx="70" cy="73" rx="7" ry="5" fill="#4A342E" />
                  <path d="M65 79 Q70 85 75 79" stroke="#4A342E" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="54" cy="62" r="5" fill="#2E1C16" />
                  <circle cx="56" cy="60" r="1.8" fill="#FFF" />
                  <circle cx="86" cy="62" r="5" fill="#2E1C16" />
                  <circle cx="88" cy="60" r="1.8" fill="#FFF" />
                  <path d="M92 48 C92 45 95 42 96 40 C97 42 100 45 100 48 C100 50 98 52 96 52 C94 52 92 50 92 48 Z" fill="#70D6FF" />
                  <path d="M70 20 C68 15 62 15 60 19 C58 23 63 28 70 33 C77 28 82 23 80 19 C78 15 72 15 70 20 Z" fill="#FF477E" />
                </svg>
              </div>
            </div>

            {/* Title & Introduction */}
            <div>
              <h1 style={{ fontSize: "1.35rem", marginBottom: "2px" }}>
                Pilih Lagu Pengiring 🎧
              </h1>
              <p className="font-hand" style={{ fontSize: "1.05rem", color: "var(--color-primary-text)" }}>
                Buat {crushName} ({crushNickname || "Si Imut"})
              </p>
              <p
                style={{
                  fontSize: "0.82rem",
                  color: "var(--text-body)",
                  marginTop: "6px",
                  lineHeight: "1.5",
                }}
              >
                Pilih lagu yang ingin kamu dengar untuk menemani membaca, atau kamu bisa lewati jika ingin membaca dengan tenang.
              </p>
            </div>

            {/* Prominent SKIP BUTTON (Masuk Tanpa Musik) */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={skipAndEnter}
              type="button"
              className="btn-secondary"
              style={{
                width: "100%",
                padding: "11px 16px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontSize: "0.86rem",
                fontWeight: 700,
                color: "var(--text-headline)",
                background: "rgba(255, 255, 255, 0.95)",
                border: "1.5px solid rgba(255, 140, 165, 0.35)",
                borderRadius: "var(--radius-full)",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                cursor: "pointer",
              }}
            >
              <SkipForward size={16} color="var(--color-primary)" />
              <span>Skip / Masuk Tanpa Musik</span>
            </motion.button>

            {/* Divider */}
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                margin: "4px 0",
              }}
            >
              <div style={{ flex: 1, height: "1px", background: "var(--border-soft)" }} />
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Atau Pilih Lagu Di Bawah 🎶
              </span>
              <div style={{ flex: 1, height: "1px", background: "var(--border-soft)" }} />
            </div>

            {/* List of songs */}
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                textAlign: "left",
              }}
            >
              {tracks.map((track) => (
                <motion.div
                  key={track.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => playTrackAndEnter(track)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    borderRadius: "16px",
                    background: track.isSpecial
                      ? "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 240, 244, 0.95) 100%)"
                      : "rgba(255, 255, 255, 0.85)",
                    border: track.isSpecial
                      ? "1.5px solid rgba(255, 71, 126, 0.4)"
                      : "1px solid rgba(0, 0, 0, 0.06)",
                    boxShadow: track.isSpecial
                      ? "0 4px 14px rgba(255, 71, 126, 0.12)"
                      : "0 1px 4px rgba(0, 0, 0, 0.02)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {/* Left: Thumbnail & Song Info */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                    <div
                      style={{
                        position: "relative",
                        width: "44px",
                        height: "44px",
                        borderRadius: "10px",
                        overflow: "hidden",
                        flexShrink: 0,
                        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
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
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                        <span
                          style={{
                            fontSize: "0.85rem",
                            fontWeight: 700,
                            color: "var(--text-headline)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "180px",
                          }}
                        >
                          {track.title}
                        </span>
                        {track.isSpecial && (
                          <span
                            style={{
                              fontSize: "0.62rem",
                              fontWeight: 700,
                              padding: "2px 6px",
                              borderRadius: "10px",
                              background: "linear-gradient(135deg, #FF477E 0%, #FF70A6 100%)",
                              color: "#ffffff",
                              letterSpacing: "0.02em",
                              flexShrink: 0,
                            }}
                          >
                            ⭐ Khusus {crushName}
                          </span>
                        )}
                      </div>

                      <div
                        style={{
                          fontSize: "0.74rem",
                          color: "var(--text-muted)",
                          marginTop: "2px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>{track.artist}</span>
                        {track.album && <span style={{ opacity: 0.8 }}>&bull; {track.album}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Right: Play action button */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      background: "rgba(255, 71, 126, 0.09)",
                      color: "var(--color-primary)",
                      padding: "6px 10px",
                      borderRadius: "var(--radius-full)",
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      flexShrink: 0,
                      marginLeft: "8px",
                    }}
                  >
                    <Play size={11} fill="currentColor" />
                    <span>Pilih</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom footnote */}
            <div
              style={{
                width: "100%",
                paddingTop: "10px",
                borderTop: "1px dashed var(--border-soft)",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <button
                type="button"
                onClick={skipAndEnter}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--color-primary)",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                  padding: "4px",
                }}
              >
                Langsung baca tanpa musik &rarr;
              </button>

              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.72rem" }}>
                <ShieldCheck size={13} color="var(--color-accent-green)" />
                <span>100% Santai &bull; Dibuat tulus oleh {confessionConfig.senderName}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
