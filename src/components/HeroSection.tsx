"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Compass, ShieldCheck } from "lucide-react";
import { confessionConfig } from "@/config/confession";

export default function HeroSection() {
  const { crushName, crushNickname } = confessionConfig;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center", textAlign: "center" }}
    >
      {/* Top Security / Secret Badge */}
      <div className="badge-pill badge-pink animate-pulse-subtle">
        <Sparkles size={14} />
        <span>Dokumen Khusus Untuk {crushName}</span>
      </div>

      {/* Main Title */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <h1 style={{ fontSize: "1.85rem", letterSpacing: "-0.02em" }}>
          Hai, <span style={{ color: "var(--color-primary)" }}>{crushName}</span>! ✨
        </h1>
        <p className="font-hand" style={{ fontSize: "1.35rem", color: "var(--text-muted)", transform: "rotate(-1deg)" }}>
          ({crushNickname || "Orang paling menyenangkan yang aku kenal"})
        </p>
      </div>

      {/* The Bear & Panic Illustration Card */}
      <motion.div
        className="glass-card"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{
          width: "100%",
          padding: "24px 20px",
          background: "linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 245, 243, 0.88) 100%)",
        }}
      >
        {/* Animated Bear Mascot Scene */}
        <div style={{ position: "relative", width: "120px", height: "120px", margin: "0 auto 16px auto" }}>
          {/* Running sweat / speed lines */}
          <motion.div
            animate={{ x: [-6, 6, -6], opacity: [0.5, 0.9, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
            style={{
              position: "absolute",
              top: "10px",
              right: "4px",
              fontSize: "1.2rem",
            }}
          >
            💦💨
          </motion.div>

          {/* Bear SVG Mascot */}
          <motion.div
            className="animate-bear-dash"
            style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <svg viewBox="0 0 140 140" width="110" height="110" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Bear Ears */}
              <circle cx="45" cy="40" r="18" fill="#8D5B4C" />
              <circle cx="45" cy="40" r="10" fill="#E8B4B8" />
              <circle cx="95" cy="40" r="18" fill="#8D5B4C" />
              <circle cx="95" cy="40" r="10" fill="#E8B4B8" />

              {/* Bear Head */}
              <circle cx="70" cy="70" r="42" fill="#A06856" />

              {/* Cheeks blush */}
              <ellipse cx="46" cy="78" rx="8" ry="5" fill="#FF8DA1" opacity="0.6" />
              <ellipse cx="94" cy="78" rx="8" ry="5" fill="#FF8DA1" opacity="0.6" />

              {/* Snout */}
              <ellipse cx="70" cy="78" rx="18" ry="14" fill="#EAD5C7" />
              <ellipse cx="70" cy="73" rx="7" ry="5" fill="#4A342E" />

              {/* Cute smiling mouth */}
              <path d="M65 79 Q70 85 75 79" stroke="#4A342E" strokeWidth="2.5" strokeLinecap="round" />

              {/* Expressive big nervous/cute eyes */}
              <circle cx="54" cy="62" r="5" fill="#2E1C16" />
              <circle cx="56" cy="60" r="1.8" fill="#FFFFFF" />
              <circle cx="86" cy="62" r="5" fill="#2E1C16" />
              <circle cx="88" cy="60" r="1.8" fill="#FFFFFF" />

              {/* Sweat drop on forehead */}
              <path d="M92 48 C92 45 95 42 96 40 C97 42 100 45 100 48 C100 50 98 52 96 52 C94 52 92 50 92 48 Z" fill="#70D6FF" />

              {/* Little heart above bear */}
              <path d="M70 20 C68 15 62 15 60 19 C58 23 63 28 70 33 C77 28 82 23 80 19 C78 15 72 15 70 20 Z" fill="#FF477E" />
            </svg>
          </motion.div>
        </div>

        {/* The Bear Analogy Explanation */}
        <h2 style={{ fontSize: "1.15rem", marginBottom: "10px", color: "var(--text-headline)" }}>
          &ldquo;Kenapa Harus Pake Website Beginian?&rdquo;
        </h2>

        <p style={{ fontSize: "0.92rem", color: "var(--text-body)", textAlign: "left", lineHeight: "1.65" }}>
          Jujur aja, kamu pasti tau kan... Kalau aku disuruh ngomong langsung di depan kamu, groginya udah kayak orang
          <strong style={{ color: "var(--color-primary-text)" }}> habis dikejar beruang kutub kelaparan</strong> 🐻💨.
          Tangan dingin, detak jantung 180 BPM, dan kapasitas otak mendadak drop jadi 3%.
        </p>

        <div style={{
          marginTop: "14px",
          padding: "10px 14px",
          background: "rgba(255, 235, 238, 0.7)",
          borderRadius: "var(--radius-sm)",
          fontSize: "0.85rem",
          color: "var(--text-body)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          textAlign: "left"
        }}>
          <Compass size={18} color="var(--color-primary)" style={{ flexShrink: 0 }} />
          <span>Jadi, biarkan teknologi dan baris kodingan ini yang menyampaikan apa yang selama ini tertahan di kepala.</span>
        </div>
      </motion.div>

      {/* Safety Notice Badge */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
        <ShieldCheck size={14} color="var(--color-accent-green)" />
        <span>100% Santai &bull; Tanpa Beban &bull; Dibuat dengan Tulus</span>
      </div>
    </motion.section>
  );
}
