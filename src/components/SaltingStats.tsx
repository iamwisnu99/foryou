"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquareText, Eye, Laugh, Cpu, ChevronRight } from "lucide-react";

export default function SaltingStats() {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const stats = [
    {
      id: 1,
      icon: MessageSquareText,
      iconColor: "#FF477E",
      title: "Respon Chat Kamu",
      highlight: "0.002 Detik ⚡",
      badge: "Prioritas VIP",
      description: "Chat orang lain: dibales 3-5 hari kerja. Chat dari kamu: bahkan sebelum HP selesai getar, udah langsung centang biru.",
      footerNote: "Algoritma jempol mendadak reflek kilat.",
    },
    {
      id: 2,
      icon: Eye,
      iconColor: "#FB8500",
      title: "Kemampuan Bicara",
      highlight: "Drop ke 10% 📉",
      badge: "Mendadak Manekin",
      description: "Kalau ngobrol sama orang biasa: lancar presentasi 2 jam. Pas tatap mata sama kamu lebih dari 3 detik: cuma bisa 'eh.. iya hehe' sambil senyum kaku.",
      footerNote: "Sistem artikulasi mengalami gangguan teknis.",
    },
    {
      id: 3,
      icon: Laugh,
      iconColor: "#FFB703",
      title: "Tingkat Ketawa",
      highlight: "999/100 ⭐",
      badge: "Otomatis Senyum",
      description: "Pas kamu cerita hal receh atau lelucon garing: aku tetep ketawa paling kenceng. Bukan leluconnya yang lucu, tapi kamunya yang bikin gemas.",
      footerNote: "Standar humor diturunkan demi kamu.",
    },
    {
      id: 4,
      icon: Cpu,
      iconColor: "#70D6FF",
      title: "Kapasitas Pikiran",
      highlight: "92% Overload 🧠",
      badge: "Overthinking Lucu",
      description: "Bukan mikirin krisis ekonomi global, tapi mikirin: 'Tadi pas papasan muka aku aneh gak ya?' atau 'Topik apa lagi ya yang asik diobrolin?'.",
      footerNote: "Memori jangka pendek penuh olehmu.",
    },
  ];

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Section Header */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <div className="badge-pill badge-amber" style={{ width: "fit-content" }}>
          📊 Data &amp; Fakta Lapangan
        </div>
        <h2 style={{ fontSize: "1.3rem" }}>
          Hasil Investigasi Gejala Salting
        </h2>
        <p style={{ fontSize: "0.86rem", color: "var(--text-muted)" }}>
          Statistik nyata yang telah diverifikasi oleh tim riset pribadi tanpa rekayasa.
        </p>
      </div>

      {/* Grid Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {stats.map((item, index) => {
          const Icon = item.icon;
          const isExpanded = activeCard === item.id;

          return (
            <motion.div
              key={item.id}
              className="glass-card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              onClick={() => setActiveCard(isExpanded ? null : item.id)}
              style={{
                cursor: "pointer",
                padding: "16px 18px",
                borderColor: isExpanded ? "var(--border-glow)" : "var(--border-soft)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    background: `${item.iconColor}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Icon size={20} color={item.iconColor} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500 }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-headline)" }}>
                      {item.highlight}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    padding: "4px 8px",
                    borderRadius: "999px",
                    background: "rgba(0,0,0,0.04)",
                    color: "var(--text-body)",
                  }}>
                    {item.badge}
                  </span>
                  <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight size={16} color="var(--text-muted)" />
                  </motion.div>
                </div>
              </div>

              {/* Expandable Content */}
              <motion.div
                initial={false}
                animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0, marginTop: isExpanded ? 12 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: "hidden" }}
              >
                <div style={{
                  paddingTop: "10px",
                  borderTop: "1px dashed var(--border-soft)",
                  fontSize: "0.88rem",
                  color: "var(--text-body)",
                  lineHeight: "1.55",
                }}>
                  {item.description}
                  <div className="font-hand" style={{ marginTop: "6px", fontSize: "1.05rem", color: "var(--color-primary-text)" }}>
                    &ldquo;{item.footerNote}&rdquo;
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
      <div style={{ textAlign: "center", fontSize: "0.78rem", color: "var(--text-caption)" }}>
        💡 Ketuk salah satu kartu di atas untuk melihat detail analisisnya!
      </div>
    </section>
  );
}
