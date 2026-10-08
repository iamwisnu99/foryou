"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, Smile, SunMedium, Coffee } from "lucide-react";
import { confessionConfig } from "@/config/confession";

export default function AppreciationCards() {
  const { crushName } = confessionConfig;
  const [likedCards, setLikedCards] = useState<number[]>([]);

  const appreciations = [
    {
      id: 1,
      icon: Smile,
      color: "#FF5B89",
      title: "Caramu Ketawa Lepas",
      snippet: "Tawa yang nular & bikin suasana cerah",
      body: "Kamu punya cara ketawa yang natural banget. Setiap kali kamu ketawa tanpa jaim, suasana yang tadinya kaku atau hari yang lagi berat langsung berasa jauh lebih ringan.",
    },
    {
      id: 2,
      icon: SunMedium,
      color: "#FB8500",
      title: "Antusias Cerita Hal Sepele",
      snippet: "Mata berbinar saat cerita hal receh",
      body: "Mendengarkan kamu cerita tentang kucing lewat, makanan enak, atau hal-hal kecil harian itu seru banget. Matamu selalu berbinar dan antusiasmenya bikin orang lain ikut bahagia dengernya.",
    },
    {
      id: 3,
      icon: Coffee,
      color: "#8D5B4C",
      title: "Vibe yang Selalu Nyaman",
      snippet: "Gak perlu pura-pura atau sok keren",
      body: "Pas lagi sama atau ngobrol sama kamu, rasanya gak perlu pakai 'topeng' atau pura-pura jadi orang lain. Kamu punya aura ramah yang bikin siapapun merasa diterima apa adanya.",
    },
  ];

  const toggleHeart = (id: number) => {
    setLikedCards(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <div className="badge-pill badge-pink" style={{ width: "fit-content" }}>
          <Sparkles size={13} />
          <span>Pengamatan Jujur</span>
        </div>
        <h2 style={{ fontSize: "1.3rem" }}>
          Hal-Hal Kecil Tentang {crushName}
        </h2>
        <p style={{ fontSize: "0.86rem", color: "var(--text-muted)" }}>
          Bukan gombalan dari Google, tapi hal-hal sederhana yang diam-diam selalu bikin kagum.
        </p>
      </div>

      {/* Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {appreciations.map((card, idx) => {
          const Icon = card.icon;
          const isLiked = likedCards.includes(card.id);

          return (
            <motion.div
              key={card.id}
              className="glass-card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.12, duration: 0.4 }}
              style={{ padding: "20px" }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: `${card.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <Icon size={18} color={card.color} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "0.98rem", color: "var(--text-headline)" }}>
                      {card.title}
                    </h3>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      {card.snippet}
                    </span>
                  </div>
                </div>

                {/* Like Button on Card */}
                <button
                  onClick={() => toggleHeart(card.id)}
                  aria-label="Sukai catatan ini"
                  style={{
                    background: isLiked ? "var(--color-primary-soft)" : "transparent",
                    border: "none",
                    borderRadius: "50%",
                    padding: "6px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                  }}
                >
                  <Heart
                    size={18}
                    color={isLiked ? "var(--color-primary)" : "var(--text-caption)"}
                    fill={isLiked ? "var(--color-primary)" : "none"}
                  />
                </button>
              </div>

              <p style={{ fontSize: "0.88rem", color: "var(--text-body)", lineHeight: "1.6" }}>
                {card.body}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
