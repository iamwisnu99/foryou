"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  RefreshCw,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Coffee,
  Heart,
  Clock,
  BatteryCharging,
} from "lucide-react";
import { confessionConfig, getWhatsAppUrl } from "@/config/confession";

export default function ClosedScreen() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { crushName, senderName } = confessionConfig;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  return (
    <div className="story-wrapper" style={{ justifyContent: "center", alignItems: "center" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="glass-card"
        style={{ width: "100%", textAlign: "center", display: "flex", flexDirection: "column", gap: "16px" }}
      >
        {/* Status Badge */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="badge-pill badge-pink animate-pulse-subtle">
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#FF477E", display: "inline-block" }} />
            <span>Sedang Istirahat Sementara</span>
          </div>
        </div>

        {/* Resting Mascot (Cute Sleeping Bear) */}
        <div style={{ width: "110px", height: "110px", margin: "0 auto", position: "relative" }}>
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
            style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <svg viewBox="0 0 140 140" width="100" height="100" fill="none">
              {/* Ears */}
              <circle cx="45" cy="42" r="17" fill="#8D5B4C" />
              <circle cx="45" cy="42" r="9" fill="#E8B4B8" />
              <circle cx="95" cy="42" r="17" fill="#8D5B4C" />
              <circle cx="95" cy="42" r="9" fill="#E8B4B8" />
              {/* Head */}
              <circle cx="70" cy="72" r="42" fill="#A06856" />
              {/* Cheeks */}
              <ellipse cx="46" cy="80" rx="8" ry="5" fill="#FF8DA1" opacity="0.6" />
              <ellipse cx="94" cy="80" rx="8" ry="5" fill="#FF8DA1" opacity="0.6" />
              {/* Snout */}
              <ellipse cx="70" cy="82" rx="16" ry="12" fill="#FFF2ED" />
              <ellipse cx="70" cy="78" rx="6" ry="4" fill="#3D261E" />
              {/* Sleeping Eyes (Happy curves) */}
              <path d="M 46 68 Q 52 74 58 68" stroke="#3D261E" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 82 68 Q 88 74 94 68" stroke="#3D261E" strokeWidth="3" strokeLinecap="round" fill="none" />
              {/* Small smile */}
              <path d="M 66 85 Q 70 89 74 85" stroke="#3D261E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </svg>
          </motion.div>

          {/* Floating Zzz */}
          <motion.span
            animate={{ opacity: [0, 1, 0], y: [0, -18], x: [0, 10] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeOut" }}
            style={{
              position: "absolute",
              top: "10px",
              right: "12px",
              fontSize: "1.1rem",
              fontWeight: 800,
              color: "var(--color-primary)",
              fontFamily: "var(--font-hand)",
            }}
          >
            Zzz...
          </motion.span>
        </div>

        {/* Heading */}
        <div>
          <h2 style={{ fontSize: "1.25rem", color: "var(--text-headline)" }}>
            Website Sedang Libur Dulu! 🚧🐻
          </h2>
          <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Khusus buat <span style={{ fontWeight: 700, color: "var(--color-primary-text)" }}>{crushName}</span>, tenang yaa gak ada yang rusak kok!
          </p>
        </div>

        {/* Humorous Reason Box */}
        <div
          style={{
            background: "var(--surface-inner)",
            border: "1px dashed var(--border-soft)",
            borderRadius: "var(--radius-md)",
            padding: "14px",
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            fontSize: "0.82rem",
            color: "var(--text-body)",
            lineHeight: "1.55",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
            <BatteryCharging size={16} color="var(--color-warm-amber)" style={{ flexShrink: 0, marginTop: "2px" }} />
            <span>
              <strong>Alasan Teknis:</strong> Server kami sedang di-<em>recharge</em> karena kepanasan menampung rasa salting {senderName} yang <em>over-capacity</em>.
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
            <Coffee size={16} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
            <span>
              <strong>Status Saat Ini:</strong> Tim mekanik cinta sedang menyetel ulang kadar deg-degan agar tidak korsleting saat kamu buka lagi.
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
            <Sparkles size={16} color="#70D6FF" style={{ flexShrink: 0, marginTop: "2px" }} />
            <span>
              <strong>Pesan dari {senderName}:</strong> <em>&quot;Jangan kangen dulu ya, websitenya lagi istirahat sambil minum boba 🧋&quot;</em>
            </span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn-primary"
            style={{ gap: "8px" }}
          >
            <motion.div animate={isRefreshing ? { rotate: 360 } : {}} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}>
              <RefreshCw size={16} />
            </motion.div>
            <span>{isRefreshing ? "Memeriksa Status..." : "Cek Lagi Sekarang (Refresh)"}</span>
          </button>

          <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="btn-wa">
            <MessageCircle size={16} fill="#ffffff" />
            <span>Tanya Langsung ke WhatsApp {senderName}</span>
          </a>
        </div>

        {/* Footer info */}
        <div className="check-row" style={{ justifyContent: "center", marginTop: "2px", fontSize: "0.74rem" }}>
          <ShieldCheck size={13} color="var(--color-accent-green)" />
          <span>100% Anti-Panik &bull; Website akan segera dibuka kembali</span>
        </div>
      </motion.div>
    </div>
  );
}
