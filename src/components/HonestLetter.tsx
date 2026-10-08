"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle2 } from "lucide-react";
import { confessionConfig } from "@/config/confession";

export default function HonestLetter() {
  const { crushName, senderName } = confessionConfig;

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <div className="badge-pill badge-pink" style={{ width: "fit-content" }}>
          <Mail size={13} />
          <span>Surat Kejujuran</span>
        </div>
        <h2 style={{ fontSize: "1.3rem" }}>
          Pesan Terbuka: Tanpa Syarat &amp; Beban 💌
        </h2>
      </div>

      {/* Elegant Letter Paper Card */}
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{
          padding: "26px 22px",
          background: "linear-gradient(180deg, #FFFFFF 0%, #FFFDF9 100%)",
          border: "1.5px solid rgba(255, 180, 195, 0.45)",
          boxShadow: "0 18px 40px -8px rgba(255, 120, 150, 0.12)",
          position: "relative",
        }}
      >
        {/* Subtle decorative stamp */}
        <div style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          border: "2px dashed rgba(255, 110, 140, 0.35)",
          borderRadius: "8px",
          padding: "4px 8px",
          fontSize: "0.68rem",
          fontWeight: 700,
          color: "var(--color-primary)",
          letterSpacing: "0.08em",
          transform: "rotate(4deg)",
          background: "rgba(255, 240, 243, 0.6)",
        }}>
          OFFICIAL &bull; JUJUR
        </div>

        {/* Salutation */}
        <p style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--text-headline)", marginBottom: "16px" }}>
          Untuk {crushName},
        </p>

        {/* Letter Paragraphs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "0.93rem", lineHeight: "1.7", color: "var(--text-body)" }}>
          <p>
            By the way, semua yang aku rancang dan tulis di website ini bener-bener
            <strong style={{ color: "var(--text-headline)" }}> hanya untuk {crushName}</strong>. Aku senang dan lega banget akhirnya punya keberanian buat mengungkapkan perasaanku yang sejujur-jujurnya tanpa ditutup-tutupi lagi.
          </p>

          <div style={{
            padding: "14px 16px",
            background: "linear-gradient(135deg, rgba(255, 230, 238, 0.5) 0%, rgba(255, 245, 235, 0.6) 100%)",
            borderRadius: "var(--radius-sm)",
            borderLeft: "4px solid var(--color-primary)",
          }}>
            <p style={{ fontWeight: 600, color: "var(--text-headline)", marginBottom: "4px" }}>
              💡 Tapi kamu sama sekali tidak perlu khawatir:
            </p>
            <p style={{ fontSize: "0.9rem", color: "var(--text-body)" }}>
              Ini <strong>bukan menembakmu untuk jadi pacarku</strong>, dan aku sama sekali tidak menuntut jawaban &ldquo;ya atau tidak&rdquo;. Tujuanku cuma satu: aku ingin kamu tahu bagaimana perasaanku ke kamu, itu saja.
            </p>
          </div>

          <p>
            Setelah membaca ini, kamu tidak perlu merasa canggung, tidak perlu bingung harus bersikap seperti apa, dan kamu tidak perlu melakukan apapun.
          </p>

          <p style={{
            fontSize: "1.05rem",
            fontWeight: 700,
            color: "var(--color-primary-text)",
            textAlign: "center",
            padding: "10px 0",
            letterSpacing: "-0.01em",
          }}>
            &ldquo;Cukup jadilah dirimu sendiri, karena disitulah aku menyukaimu.&rdquo; ✨
          </p>
        </div>

        {/* Zero-Pressure Guarantee Checklist */}
        <div style={{
          marginTop: "20px",
          paddingTop: "16px",
          borderTop: "1px dashed var(--border-soft)",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.82rem", color: "var(--text-muted)" }}>
            <CheckCircle2 size={16} color="var(--color-accent-green)" />
            <span>Tidak ada drama atau rasa canggung setelah ini</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.82rem", color: "var(--text-muted)" }}>
            <CheckCircle2 size={16} color="var(--color-accent-green)" />
            <span>Tetap asik berteman dan ngobrol santai seperti biasa</span>
          </div>
        </div>

        {/* Sender Sign-off */}
        <div style={{ marginTop: "24px", textAlign: "right" }}>
          <p style={{ fontSize: "0.82rem", color: "var(--text-caption)" }}>Tertanda dari yang grogian,</p>
          <p className="font-hand" style={{ fontSize: "1.8rem", color: "var(--color-primary-text)", lineHeight: "1.2" }}>
            {senderName} ✍️
          </p>
        </div>
      </motion.div>
    </section>
  );
}
