"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { MessageCircle, Heart, Sparkles, Smile, Shield } from "lucide-react";
import { getWhatsAppUrl, confessionConfig } from "@/config/confession";

export default function ActionSection() {
  const [hasSentHeart, setHasSentHeart] = useState(false);
  const [heartsCount, setHeartsCount] = useState(0);

  const handleSendHeart = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Confetti explosion
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { x, y },
      colors: ["#FF477E", "#FF70A6", "#FFB703", "#FFD166"],
      shapes: ["circle"],
      scalar: 1.2,
    });

    setHasSentHeart(true);
    setHeartsCount(prev => prev + 1);
  };

  const waUrl = getWhatsAppUrl();

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "8px" }}>
      {/* Interactive Action Card */}
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          textAlign: "center",
          padding: "24px 20px",
          background: "linear-gradient(180deg, #FFFFFF 0%, #FFF5F7 100%)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <div className="badge-pill badge-green">
            <Smile size={13} />
            <span>Misi Selesai</span>
          </div>
          <h3 style={{ fontSize: "1.25rem", color: "var(--text-headline)" }}>
            Terima Kasih Sudah Membaca! ✨
          </h3>
          <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", maxWidth: "340px" }}>
            Semoga membaca website ini bisa bikin kamu tersenyum di sela-sela kesibukanmu hari ini.
          </p>
        </div>

        {/* Action Button 1: Virtual Smile / Hearts Confetti */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            onClick={handleSendHeart}
            className="btn-primary"
            style={{ position: "relative" }}
          >
            <Heart size={20} fill="#ffffff" />
            <span>Kirim Senyuman &amp; Hati Virtual</span>
            <Sparkles size={18} />
          </button>

          <AnimatePresence>
            {hasSentHeart && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  padding: "10px 14px",
                  background: "var(--color-primary-soft)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.85rem",
                  color: "var(--color-primary-text)",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                <span>🥰 Senyuman terkirim! (Total: {heartsCount}x) Semoga harimu indah!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          margin: "4px 0",
          color: "var(--text-caption)",
          fontSize: "0.78rem",
        }}>
          <div style={{ flex: 1, height: "1px", background: "var(--border-soft)" }}></div>
          <span>Atau mau ngetawain aku lewat chat?</span>
          <div style={{ flex: 1, height: "1px", background: "var(--border-soft)" }}></div>
        </div>

        {/* Action Button 2: Send relaxed reaction to WhatsApp */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-wa"
        >
          <MessageCircle size={20} fill="#ffffff" />
          <span>Kirim Reaksi Santai ke WhatsApp</span>
        </a>

        <p style={{ fontSize: "0.76rem", color: "var(--text-caption)", lineHeight: "1.4" }}>
          (Tenang, pesannya santai dan bisa kamu edit sesuka hati sebelum dikirim!)
        </p>
      </motion.div>

      {/* Zero Pressure Assurance Footer */}
      <div style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
        padding: "12px 10px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.78rem", color: "var(--text-muted)" }}>
          <Shield size={14} color="var(--color-accent-green)" />
          <span>Zero-Pressure Guarantee: Dibuat tulus oleh {confessionConfig.senderName}</span>
        </div>
        <p className="font-hand" style={{ fontSize: "1.2rem", color: "var(--text-muted)" }}>
          &ldquo;Gak ada beruang, cuma ada rasa kagum yang apa adanya.&rdquo; 🐻❤️
        </p>
      </div>
    </section>
  );
}
