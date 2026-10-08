"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ArrowRight,
  Sparkles,
  MessageSquareText,
  Eye,
  Laugh,
  Cpu,
  Smile,
  SunMedium,
  Coffee,
  Heart,
  CheckCircle2,
  MessageCircle,
  RotateCcw,
  ShieldCheck,
  Compass,
  Zap,
  TrendingDown,
  Star,
  ChevronDown,
  ChevronUp,
  PenTool,
} from "lucide-react";
import confetti from "canvas-confetti";
import { confessionConfig, getWhatsAppUrl } from "@/config/confession";

export default function StoryCardDeck() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [activeStat, setActiveStat] = useState<number | null>(null);
  const [likedCards, setLikedCards] = useState<number[]>([]);
  const [hasSentHeart, setHasSentHeart] = useState(false);
  const [heartsCount, setHeartsCount] = useState(0);
  const [confessionTaps, setConfessionTaps] = useState(0);

  // Typewriter state for Step 4 (Letter)
  const [typedCharCount, setTypedCharCount] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { crushName, crushNickname, senderName } = confessionConfig;

  const totalSteps = 6;

  const stepLabels = [
    "Awal Cerita",
    "Gejala Salting",
    "Tentang Kamu",
    "Ungkapan Rasa",
    "Surat Kejujuran",
    "Pesan Akhir",
  ];

  // Letter content for step 4
  const letterParagraphs = [
    `By the way, semua yang aku rancang dan tulis di website ini bener-bener hanya untuk ${crushName}. Aku senang dan lega banget akhirnya punya keberanian buat mengungkapkan perasaanku yang sejujur-jujurnya tanpa ditutup-tutupi lagi.`,
    `Tapi kamu sama sekali tidak perlu khawatir: ini bukan menembakmu untuk jadi pacarku, dan aku tidak menuntut jawaban "ya atau tidak". Tujuanku cuma satu: aku ingin kamu tahu bagaimana perasaanku ke kamu, itu saja.`,
    `Setelah membaca ini, kamu tidak perlu merasa canggung atau bingung harus bersikap seperti apa. Cukup jadilah dirimu sendiri, karena disitulah aku menyukaimu.`,
  ];

  const fullLetterText = letterParagraphs.join("\n\n");

  // Typewriter effect triggered on Step 4 (Surat Kejujuran)
  useEffect(() => {
    if (currentStep === 4) {
      setTypedCharCount(0);
      setIsTypingComplete(false);

      if (typingTimerRef.current) clearInterval(typingTimerRef.current);

      let count = 0;
      // 32ms per character corresponds to ~220 words per minute (average human reading speed)
      typingTimerRef.current = setInterval(() => {
        count += 1;
        setTypedCharCount(count);
        if (count >= fullLetterText.length) {
          if (typingTimerRef.current) clearInterval(typingTimerRef.current);
          setIsTypingComplete(true);
        }
      }, 32);
    } else {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    }

    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [currentStep, fullLetterText.length]);

  const handleSkipTyping = () => {
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    setTypedCharCount(fullLetterText.length);
    setIsTypingComplete(true);
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setDirection(-1);
    setCurrentStep(0);
  };

  const toggleHeart = (id: number) => {
    setLikedCards(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleConfessionHeartClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setConfessionTaps(prev => prev + 1);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 30,
      spread: 60,
      origin: { x, y },
      colors: ["#FF477E", "#FF70A6", "#FFB703"],
      shapes: ["circle"],
      scalar: 1.1,
    });
  };

  const handleSendConfetti = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { x, y },
      colors: ["#FF477E", "#FF70A6", "#FFB703", "#FFD166"],
      shapes: ["circle"],
      scalar: 1.1,
    });

    setHasSentHeart(true);
    setHeartsCount(prev => prev + 1);
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.28, ease: "easeOut" as const },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0,
      scale: 0.98,
      transition: { duration: 0.2, ease: "easeIn" as const },
    }),
  };

  const visibleText = fullLetterText.slice(0, typedCharCount);

  return (
    <div className="story-wrapper">
      {/* Top Header: Progress Bar & Step Tracker */}
      <div>
        <div
          className="story-progress-bar"
          role="progressbar"
          aria-valuenow={currentStep + 1}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
        >
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <div key={idx} className="story-progress-segment">
              <div
                className="story-progress-fill"
                style={{
                  width: idx < currentStep ? "100%" : idx === currentStep ? "100%" : "0%",
                  opacity: idx <= currentStep ? 1 : 0.25,
                }}
              />
            </div>
          ))}
        </div>

        <div className="story-step-badge">
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <span
              className="badge-pill badge-pink"
              style={{ padding: "4px 10px", fontSize: "0.74rem" }}
            >
              Langkah {currentStep + 1} dari {totalSteps}
            </span>
            <span style={{ fontWeight: 600, color: "var(--text-headline)" }}>
              {stepLabels[currentStep]}
            </span>
          </span>
          <span
            className="font-hand"
            style={{ fontSize: "1.05rem", color: "var(--color-primary-text)" }}
          >
            Buat {crushName}
          </span>
        </div>
      </div>

      {/* Main Card Viewport */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="glass-card"
            style={{
              padding: "20px 16px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* ================= STEP 0: THE BEAR HOOK ================= */}
            {currentStep === 0 && (
              <div className="story-card-scrollable" style={{ textAlign: "center", alignItems: "center" }}>
                <div>
                  <h1 style={{ fontSize: "1.75rem", letterSpacing: "-0.02em" }}>
                    Hai, <span style={{ color: "var(--color-primary)" }}>{crushName}</span>!
                  </h1>
                  <p
                    className="font-hand"
                    style={{ fontSize: "1.25rem", color: "var(--text-muted)", marginTop: "2px" }}
                  >
                    ({crushNickname || "Si Paling Imut"})
                  </p>
                </div>

                {/* Animated Bear Mascot */}
                <div style={{ position: "relative", width: "110px", height: "110px", margin: "2px auto" }}>
                  <div
                    className="animate-bear-dash"
                    style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <svg viewBox="0 0 140 140" width="105" height="105" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                      <circle cx="56" cy="60" r="1.8" fill="#FFFFFF" />
                      <circle cx="86" cy="62" r="5" fill="#2E1C16" />
                      <circle cx="88" cy="60" r="1.8" fill="#FFFFFF" />
                      <path d="M92 48 C92 45 95 42 96 40 C97 42 100 45 100 48 C100 50 98 52 96 52 C94 52 92 50 92 48 Z" fill="#70D6FF" />
                      <path d="M70 20 C68 15 62 15 60 19 C58 23 63 28 70 33 C77 28 82 23 80 19 C78 15 72 15 70 20 Z" fill="#FF477E" />
                    </svg>
                  </div>
                </div>

                <div
                  style={{
                    textAlign: "left",
                    background: "rgba(255, 245, 243, 0.75)",
                    padding: "16px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-soft)",
                  }}
                >
                  <h2 style={{ fontSize: "1.05rem", color: "var(--text-headline)", marginBottom: "8px" }}>
                    &ldquo;Kenapa Harus Pake Website Beginian?&rdquo;
                  </h2>
                  <p style={{ fontSize: "0.89rem", color: "var(--text-body)", lineHeight: "1.65" }}>
                    Jujur aja, kamu pasti tau kan... Kalau aku disuruh ngomong langsung di depan kamu, groginya udah kayak orang 
                    <strong style={{ color: "var(--color-primary-text)" }}> habis dikejar beruang kutub kelaparan</strong>.
                    Tangan dingin, detak jantung 180 BPM, dan kapasitas otak mendadak drop jadi 3%.
                  </p>
                  <div
                    style={{
                      marginTop: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "0.84rem",
                      color: "var(--text-muted)",
                    }}
                  >
                    <Compass size={16} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                    <span>Jadi biarkan teknologi ini yang menyampaikan apa yang tertahan di kepala.</span>
                  </div>
                </div>
              </div>
            )}

            {/* ================= STEP 1: SALTING STATS ================= */}
            {currentStep === 1 && (
              <div className="story-card-scrollable">
                <div>
                  <h2 style={{ fontSize: "1.25rem" }}>Hasil Investigasi Gejala Salting</h2>
                  <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    Catatan pengamatan jujur saat lagi berinteraksi sama kamu.
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    {
                      id: 1,
                      icon: MessageSquareText,
                      color: "#FF477E",
                      title: "Respon Chat Kamu",
                      highlight: "0.002 Detik",
                      badgeIcon: Zap,
                      desc: "Chat orang lain: dibales 3-5 hari kerja. Chat dari kamu: bahkan sebelum HP selesai getar, udah langsung dibuka.",
                    },
                    {
                      id: 2,
                      icon: Eye,
                      color: "#FB8500",
                      title: "Kemampuan Bicara",
                      highlight: "Drop ke 10%",
                      badgeIcon: TrendingDown,
                      desc: "Kalau ngobrol biasa: lancar. Pas tatap mata sama kamu lebih dari 3 detik: mendadak kaku kayak manekin.",
                    },
                    {
                      id: 3,
                      icon: Laugh,
                      color: "#FFB703",
                      title: "Tingkat Ketawa",
                      highlight: "999 / 100",
                      badgeIcon: Star,
                      desc: "Pas kamu cerita hal receh: aku tetep ketawa paling kenceng. Bukan leluconnya yang lucu, tapi kamunya yang bikin gemas.",
                    },
                    {
                      id: 4,
                      icon: Cpu,
                      color: "#70D6FF",
                      title: "Kapasitas RAM Otak",
                      highlight: "Overload 92%",
                      badgeIcon: Cpu,
                      desc: "Bukan mikirin krisis ekonomi global, tapi mikirin: 'Tadi pas papasan muka aku aneh gak ya?'",
                    },
                  ].map(stat => {
                    const Icon = stat.icon;
                    const BadgeIcon = stat.badgeIcon;
                    const isOpen = activeStat === stat.id;
                    return (
                      <div
                        key={stat.id}
                        onClick={() => setActiveStat(isOpen ? null : stat.id)}
                        style={{
                          padding: "12px 14px",
                          borderRadius: "var(--radius-md)",
                          background: isOpen ? "rgba(255, 235, 240, 0.7)" : "rgba(255, 255, 255, 0.82)",
                          border: `1px solid ${isOpen ? "var(--border-glow)" : "var(--border-soft)"}`,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div
                              style={{
                                width: "34px",
                                height: "34px",
                                borderRadius: "10px",
                                background: `${stat.color}15`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Icon size={18} color={stat.color} />
                            </div>
                            <div>
                              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{stat.title}</div>
                              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.95rem", fontWeight: 700, color: "var(--text-headline)" }}>
                                <span>{stat.highlight}</span>
                                <BadgeIcon size={14} color={stat.color} />
                              </div>
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.76rem", color: "var(--color-primary-text)", fontWeight: 600 }}>
                            <span>{isOpen ? "Tutup" : "Detail"}</span>
                            {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </div>
                        </div>
                        {isOpen && (
                          <p style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px dashed var(--border-soft)", fontSize: "0.85rem", color: "var(--text-body)", lineHeight: "1.5" }}>
                            {stat.desc}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ================= STEP 2: APPRECIATION CARDS ================= */}
            {currentStep === 2 && (
              <div className="story-card-scrollable">
                <div>
                  <div className="badge-pill badge-pink" style={{ width: "fit-content", marginBottom: "4px" }}>
                    <Sparkles size={13} />
                    <span>Pengamatan Jujur</span>
                  </div>
                  <h2 style={{ fontSize: "1.25rem" }}>Hal-Hal Kecil Tentang {crushName}</h2>
                  <p style={{ fontSize: "0.84rem", color: "var(--text-muted)" }}>
                    Bukan gombalan internet, tapi hal-hal sederhana yang diam-diam selalu bikin kagum.
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[
                    {
                      id: 1,
                      icon: Smile,
                      color: "#FF5B89",
                      title: "Caramu Ketawa Lepas",
                      body: "Kamu punya cara ketawa yang natural banget. Setiap kali kamu ketawa tanpa jaim, suasana yang tadinya kaku atau hari yang capek langsung berasa jauh lebih ringan.",
                    },
                    {
                      id: 2,
                      icon: SunMedium,
                      color: "#FB8500",
                      title: "Antusias Cerita Hal Sepele",
                      body: "Mendengarkan kamu cerita tentang kucing lewat, makanan enak, atau hal-hal kecil harian itu seru banget. Matamu selalu berbinar dan bikin orang lain ikut senyum dengernya.",
                    },
                    {
                      id: 3,
                      icon: Coffee,
                      color: "#8D5B4C",
                      title: "Vibe yang Selalu Nyaman",
                      body: "Pas lagi sama atau ngobrol bareng kamu, rasanya gak perlu jaim atau pura-pura jadi orang lain. Kamu punya aura ramah yang bikin suasana jadi hangat apa adanya.",
                    },
                  ].map(item => {
                    const Icon = item.icon;
                    const isLiked = likedCards.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        style={{
                          padding: "16px",
                          borderRadius: "var(--radius-md)",
                          background: "rgba(255, 255, 255, 0.85)",
                          border: "1px solid var(--border-soft)",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `${item.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <Icon size={16} color={item.color} />
                            </div>
                            <h3 style={{ fontSize: "0.95rem", color: "var(--text-headline)" }}>{item.title}</h3>
                          </div>
                          <button
                            onClick={() => toggleHeart(item.id)}
                            aria-label="Sukai catatan"
                            style={{
                              background: isLiked ? "var(--color-primary-soft)" : "transparent",
                              border: "none",
                              borderRadius: "50%",
                              padding: "6px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Heart size={16} color={isLiked ? "var(--color-primary)" : "var(--text-caption)"} fill={isLiked ? "var(--color-primary)" : "none"} />
                          </button>
                        </div>
                        <p style={{ fontSize: "0.86rem", color: "var(--text-body)", lineHeight: "1.55" }}>
                          {item.body}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ================= STEP 3: UNGKAPAN PERASAAN (NEW STEP) ================= */}
            {currentStep === 3 && (
              <div className="story-card-scrollable" style={{ textAlign: "center", alignItems: "center" }}>
                <div className="badge-pill badge-pink animate-pulse-subtle" style={{ margin: "0 auto" }}>
                  <Heart size={13} fill="currentColor" />
                  <span>Pengungkapan Perasaan</span>
                </div>

                <div>
                  <h2 style={{ fontSize: "1.3rem", color: "var(--text-headline)", marginTop: "4px" }}>
                    Ada Hal yang Ingin Aku Katakan...
                  </h2>
                  <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    Sebuah pengakuan jujur dari lubuk hati yang paling dalam.
                  </p>
                </div>

                <div
                  style={{
                    width: "100%",
                    padding: "20px 16px",
                    borderRadius: "var(--radius-lg)",
                    background: "linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 240, 243, 0.9) 100%)",
                    border: "1.5px solid rgba(255, 140, 165, 0.45)",
                    boxShadow: "0 14px 30px -6px rgba(255, 90, 120, 0.15)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    textAlign: "center",
                    alignItems: "center",
                  }}
                >
                  <p style={{ fontSize: "0.93rem", color: "var(--text-body)", lineHeight: "1.65" }}>
                    Dari semua hal yang sering aku perhatiin dan setiap obrolan yang kita lewati, ada satu hal yang paling jujur dari hati aku:
                  </p>

                  <div
                    style={{
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      color: "var(--text-headline)",
                      lineHeight: "1.6",
                      padding: "12px 14px",
                      borderRadius: "var(--radius-md)",
                      background: "rgba(255, 255, 255, 0.88)",
                      border: "1px dashed var(--border-soft)",
                    }}
                  >
                    Aku suka sama <span style={{ color: "var(--color-primary-text)" }}>{crushName}</span>, dan bahkan rasa suka ini perlahan sudah mulai merasakan cinta.
                  </div>

                  {/* Interactive Bold Italic Confession Banner */}
                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleConfessionHeartClick}
                    style={{
                      width: "100%",
                      padding: "14px 18px",
                      borderRadius: "var(--radius-full)",
                      background: "linear-gradient(135deg, rgba(255, 71, 126, 0.14) 0%, rgba(255, 183, 3, 0.12) 100%)",
                      border: "1.5px solid rgba(255, 71, 126, 0.45)",
                      boxShadow: "0 8px 22px -4px rgba(255, 71, 126, 0.22)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      userSelect: "none",
                      transition: "all 0.25s ease",
                    }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.25, 1] }}
                      transition={{ repeat: Infinity, duration: 1.3, ease: "easeInOut" }}
                      style={{ display: "inline-flex", alignItems: "center" }}
                    >
                      <Heart size={20} color="var(--color-primary)" fill="var(--color-primary)" />
                    </motion.div>
                    <span
                      style={{
                        fontSize: "1.15rem",
                        fontWeight: 800,
                        fontStyle: "italic",
                        color: "var(--color-primary-text)",
                        letterSpacing: "0.02em",
                      }}
                    >
                      I do really like you
                    </span>
                    <motion.div
                      animate={{ scale: [1, 1.25, 1] }}
                      transition={{ repeat: Infinity, duration: 1.3, ease: "easeInOut", delay: 0.2 }}
                      style={{ display: "inline-flex", alignItems: "center" }}
                    >
                      <Heart size={20} color="var(--color-primary)" fill="var(--color-primary)" />
                    </motion.div>
                  </motion.div>

                  <p style={{ fontSize: "0.78rem", color: "var(--text-caption)" }}>
                    {confessionTaps > 0
                      ? `✨ Perasaan cinta tersampaikan (${confessionTaps}x)!`
                      : "(Ketuk teks di atas untuk getaran hatinya ✨)"}
                  </p>
                </div>
              </div>
            )}

            {/* ================= STEP 4: HONEST LETTER (TYPEWRITER ANIMATED) ================= */}
            {currentStep === 4 && (
              <div className="story-card-scrollable">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <h2 style={{ fontSize: "1.25rem", color: "var(--text-headline)" }}>
                    Untuk {crushName},
                  </h2>
                  {!isTypingComplete && (
                    <button
                      onClick={handleSkipTyping}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--text-muted)",
                        fontSize: "0.75rem",
                        textDecoration: "underline",
                        cursor: "pointer",
                        padding: "2px 4px",
                      }}
                    >
                      Tampilkan Semua
                    </button>
                  )}
                </div>

                <div
                  style={{
                    fontSize: "0.91rem",
                    color: "var(--text-body)",
                    lineHeight: "1.7",
                    whiteSpace: "pre-wrap",
                    minHeight: "180px",
                  }}
                >
                  {visibleText}
                  {!isTypingComplete && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6 }}
                      style={{
                        display: "inline-block",
                        width: "2px",
                        height: "1.1em",
                        backgroundColor: "var(--color-primary)",
                        verticalAlign: "text-bottom",
                        marginLeft: "2px",
                      }}
                    />
                  )}
                </div>

                {/* Checkpoint assurances */}
                <div style={{ paddingTop: "8px", borderTop: "1px dashed var(--border-soft)", display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    <CheckCircle2 size={14} color="var(--color-accent-green)" />
                    <span>Tidak ada drama atau rasa canggung setelah ini</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    <CheckCircle2 size={14} color="var(--color-accent-green)" />
                    <span>Tetap asik berteman dan ngobrol santai seperti biasa</span>
                  </div>
                </div>

                {/* Signature */}
                <div style={{ textAlign: "right", marginTop: "8px" }}>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-caption)" }}>Tertanda dari yang grogian,</span>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "6px" }}>
                    <p className="font-hand" style={{ fontSize: "1.7rem", color: "var(--color-primary-text)", lineHeight: "1.1" }}>
                      {senderName}
                    </p>
                    <PenTool size={16} color="var(--color-primary)" />
                  </div>
                </div>
              </div>
            )}

            {/* ================= STEP 5: CONCLUSION & WA REACTION ================= */}
            {currentStep === 5 && (
              <div className="story-card-scrollable" style={{ textAlign: "center" }}>
                <div className="badge-pill badge-green" style={{ margin: "0 auto" }}>
                  <CheckCircle2 size={13} />
                  <span>Selesai Dibaca</span>
                </div>

                <div>
                  <h2 style={{ fontSize: "1.35rem" }}>Terima Kasih Sudah Membaca!</h2>
                  <p style={{ fontSize: "0.86rem", color: "var(--text-muted)", marginTop: "4px" }}>
                    Semoga website ini bisa bikin kamu tersenyum di sela-sela harimu.
                  </p>
                </div>

                {/* Confetti Explosion Button (Standardized 48px Height) */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <button
                    onClick={handleSendConfetti}
                    className="btn-primary"
                  >
                    <Heart size={18} fill="#ffffff" />
                    <span>Kirim Senyuman &amp; Hati Virtual</span>
                    <Sparkles size={16} />
                  </button>

                  <AnimatePresence>
                    {hasSentHeart && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                          padding: "8px 12px",
                          background: "var(--color-primary-soft)",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "0.82rem",
                          color: "var(--color-primary-text)",
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                        }}
                      >
                        <Heart size={14} fill="currentColor" />
                        <span>Senyuman terkirim! (Total: {heartsCount}x) Makasih {crushName}!</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Divider */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-caption)", fontSize: "0.76rem" }}>
                  <div style={{ flex: 1, height: "1px", background: "var(--border-soft)" }} />
                  <span>Mau kirim respon balik?</span>
                  <div style={{ flex: 1, height: "1px", background: "var(--border-soft)" }} />
                </div>

                {/* WhatsApp Direct Link (Standardized 48px Height) */}
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-wa"
                >
                  <MessageCircle size={18} fill="#ffffff" />
                  <span>Kirim Reaksi Santai ke WhatsApp</span>
                </a>

                <p style={{ fontSize: "0.76rem", color: "var(--text-caption)" }}>
                  (Pesannya santai dan bisa diedit sesuka hati sebelum dikirim ke {senderName})
                </p>

                {/* Reset button (Standardized 48px Height) */}
                <div style={{ paddingTop: "8px", borderTop: "1px dashed var(--border-soft)" }}>
                  <button
                    onClick={handleReset}
                    className="btn-secondary"
                  >
                    <RotateCcw size={15} />
                    <span>Baca Ulang Dari Langkah 1</span>
                  </button>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "0.76rem", color: "var(--text-muted)", marginTop: "2px" }}>
                  <ShieldCheck size={14} color="var(--color-accent-green)" />
                  <span>100% Zero-Pressure &bull; Gak ada beruang, cuma rasa kagum tulus</span>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Effortless Bottom Navigation Bar (Uniform 48px Height Buttons) */}
      <div className="story-bottom-nav">
        {currentStep > 0 ? (
          <button
            onClick={handlePrev}
            className="btn-secondary"
            style={{ width: "auto", flex: "0 0 115px" }}
          >
            <ChevronLeft size={18} />
            <span>Sebelumnya</span>
          </button>
        ) : (
          <div style={{ flex: "0 0 0" }} />
        )}

        {currentStep < totalSteps - 1 ? (
          <button
            onClick={handleNext}
            className="btn-primary"
            style={{ flex: 1 }}
          >
            <span>
              {currentStep === 0 && "Buka Catatan Rahasia"}
              {currentStep === 1 && "Lanjut: Tentang Kamu"}
              {currentStep === 2 && "Buka Ungkapan Rasa"}
              {currentStep === 3 && "Baca Surat Kejujuran"}
              {currentStep === 4 && "Lanjut ke Penutup"}
            </span>
            <ArrowRight size={18} />
          </button>
        ) : (
          <div style={{ flex: 1, textAlign: "center", fontSize: "0.82rem", color: "var(--text-caption)" }}>
            Semua langkah selesai dibaca
          </div>
        )}
      </div>
    </div>
  );
}
