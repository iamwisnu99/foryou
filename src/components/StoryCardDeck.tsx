"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
  Music2,
} from "lucide-react";
import confetti from "canvas-confetti";
import { confessionConfig, getWhatsAppUrl } from "@/config/confession";
import SoundtrackPlayer from "@/components/SoundtrackPlayer";
import ScratchCard from "@/components/ScratchCard";
import { useMusic } from "@/context/MusicContext";
import { DEFAULT_COVER } from "@/config/music";

/* ─────────────── constants ─────────────── */

const STEP_LABELS = [
  "Awal Cerita",
  "Gejala Salting",
  "Tentang Kamu",
  "Pengungkapan Perasaan",
  "Surat Kejujuran",
  "Pesan Akhir",
] as const;

const TOTAL_STEPS = STEP_LABELS.length;

const TYPING_SPEED_MS = 28; // ~250 WPM, natural reading pace

/* ─────────────── component ─────────────── */

export default function StoryCardDeck() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [activeStat, setActiveStat] = useState<number | null>(null);
  const [likedCards, setLikedCards] = useState<number[]>([]);
  const [hasSentHeart, setHasSentHeart] = useState(false);
  const [heartsCount, setHeartsCount] = useState(0);
  const [confessionTaps, setConfessionTaps] = useState(0);

  // Music context
  const { currentTrack, isPlaying, openSelector } = useMusic();

  // Typewriter
  const [typedCharCount, setTypedCharCount] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { crushName, crushNickname, senderName } = confessionConfig;

  // Letter content (step 4)
  const letterParagraphs = React.useMemo(
    () => [
      `Jujur, pas ngetik surat ini deg-degannya ngalahin pas nunggu giliran dipanggil ke ruang sidang skripsi wkwk. Semua baris kode, animasi terbang-terbang, sampe domain website ini murni dibuat lembur khusus buat ${crushName}. Emang agak niat banget sih ya bikin website begini, tapi ya namanya juga usaha biar gak overthinking tiap malem sambil mandangin plafon kamar.`,
      `Tenang yaa, ini murni apresiasi tulus tanpa ada modus tersembunyi. Senyum manis dan tawamu itu punya efek magis yang selalu sukses bikin hariku jadi jauh lebih cerah dan seru. Misi utamaku cuma satu: pengen bikin kamu ngerasa dihargai, istimewa, dan minimal bisa senyum-senyum sendiri hari ini wkwk.`,
      `Cukup tetep jadi ${crushName} yang ceria, asik, dan apa adanya kayak biasanya soalnya ya versi asli kamu yang itulah yang dari awal sukses bikin aku kepincut.`,
      `"I know you're with someone right now, but I intend to be your last."`,
    ],
    [crushName]
  );

  const fullLetterText = React.useMemo(() => letterParagraphs.join("\n\n"), [letterParagraphs]);

  // Compute slices for each paragraph for progressive typewriter animation
  const renderedParagraphs = React.useMemo(() => {
    let charAccumulator = 0;
    return letterParagraphs
      .map((para, idx) => {
        const start = charAccumulator;
        const end = start + para.length;
        charAccumulator = end + 2; // account for "\n\n" between paragraphs

        if (typedCharCount <= start && !(idx === 0 && typedCharCount === 0)) {
          return null;
        }

        const currentLength = Math.max(0, Math.min(para.length, typedCharCount - start));
        const text = para.slice(0, currentLength);
        const isCurrent =
          !isTypingComplete &&
          (idx === letterParagraphs.length - 1
            ? typedCharCount >= start
            : typedCharCount >= start && typedCharCount < end + 2);

        return {
          index: idx,
          text,
          isCurrent,
          isLast: idx === letterParagraphs.length - 1,
        };
      })
      .filter((p): p is { index: number; text: string; isCurrent: boolean; isLast: boolean } => p !== null);
  }, [typedCharCount, isTypingComplete, letterParagraphs]);

  /* ─── effects ─── */

  useEffect(() => {
    if (currentStep === 4) {
      setTypedCharCount(0);
      setIsTypingComplete(false);
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);

      let count = 0;
      typingTimerRef.current = setInterval(() => {
        count += 1;
        setTypedCharCount(count);
        if (count >= fullLetterText.length) {
          if (typingTimerRef.current) clearInterval(typingTimerRef.current);
          setIsTypingComplete(true);
        }
      }, TYPING_SPEED_MS);
    } else {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    }
    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [currentStep, fullLetterText.length]);

  /* ─── handlers ─── */

  const handleSkipTyping = useCallback(() => {
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    setTypedCharCount(fullLetterText.length);
    setIsTypingComplete(true);
  }, [fullLetterText.length]);

  const handleNext = useCallback(() => {
    if (currentStep < TOTAL_STEPS - 1) {
      setDirection(1);
      setCurrentStep(s => s + 1);
    }
  }, [currentStep]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(s => s - 1);
    }
  }, [currentStep]);

  const handleReset = useCallback(() => {
    setDirection(-1);
    setCurrentStep(0);
  }, []);

  const toggleHeart = useCallback((id: number) => {
    setLikedCards(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }, []);

  const handleConfessionHeartClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setConfessionTaps(prev => prev + 1);
      const rect = e.currentTarget.getBoundingClientRect();
      confetti({
        particleCount: 25,
        spread: 55,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        },
        colors: ["#FF477E", "#FF70A6", "#FFB703"],
        shapes: ["circle"],
        scalar: 1,
        gravity: 1.2,
        ticks: 80,
      });
    },
    []
  );

  const handleSendConfetti = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      confetti({
        particleCount: 40,
        spread: 65,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        },
        colors: ["#FF477E", "#FF70A6", "#FFB703", "#FFD166"],
        shapes: ["circle"],
        scalar: 1,
        gravity: 1.2,
        ticks: 80,
      });
      setHasSentHeart(true);
      setHeartsCount(prev => prev + 1);
    },
    []
  );

  /* ─── animation variants (lightweight) ─── */

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.22, ease: "easeOut" as const },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -30 : 30,
      opacity: 0,
      transition: { duration: 0.16, ease: "easeIn" as const },
    }),
  };

  /* ─────────────── RENDER ─────────────── */

  return (
    <div className="story-wrapper">
      {/* ── Header: Progress + Step Info ── */}
      <header>
        <div
          className="story-progress-bar"
          role="progressbar"
          aria-valuenow={currentStep + 1}
          aria-valuemin={1}
          aria-valuemax={TOTAL_STEPS}
        >
          {Array.from({ length: TOTAL_STEPS }).map((_, idx) => (
            <div key={idx} className="story-progress-segment">
              <div
                className="story-progress-fill"
                style={{
                  width: idx <= currentStep ? "100%" : "0%",
                  opacity: idx <= currentStep ? 1 : 0.2,
                }}
              />
            </div>
          ))}
        </div>

        <div className="story-step-badge">
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", minWidth: 0, flexShrink: 1 }}>
            <span className="badge-pill badge-pink" style={{ padding: "3px 8px", fontSize: "0.72rem", flexShrink: 0 }}>
              {currentStep + 1}/{TOTAL_STEPS}
            </span>
            <span style={{ fontWeight: 700, color: "var(--text-headline)", fontSize: "0.82rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {STEP_LABELS[currentStep]}
            </span>
          </span>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
            <span
              className="font-hand"
              style={{ fontSize: "1.05rem", color: "var(--color-primary-text)", lineHeight: 1 }}
            >
              Buat {crushName}
            </span>
            <SoundtrackPlayer />
          </div>
        </div>
      </header>

      {/* ── Card Viewport ── */}
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
          >
            {/* ===================== STEP 0: INTRO ===================== */}
            {currentStep === 0 && (
              <div className="story-card-scrollable" style={{ textAlign: "center", alignItems: "center" }}>
                <div>
                  <h1>
                    Hai, <span style={{ color: "var(--color-primary)" }}>{crushName}</span>
                  </h1>
                  <p
                    className="font-hand"
                    style={{ fontSize: "1.15rem", color: "var(--text-muted)", marginTop: "2px" }}
                  >
                    ({crushNickname || "Si Imut"})
                  </p>
                </div>

                {/* Bear Mascot (inline SVG — zero network requests) */}
                <div style={{ width: "100px", height: "100px", margin: "0 auto" }}>
                  <div className="animate-bear-dash" style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg viewBox="0 0 140 140" width="96" height="96" fill="none">
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

                <div className="inner-card" style={{ textAlign: "left" }}>
                  <h2 style={{ marginBottom: "6px" }}>
                    &ldquo;Kenapa Harus Pake Website Beginian?&rdquo;
                  </h2>
                  <p style={{ color: "var(--text-body)", lineHeight: "1.65" }}>
                    Jujur aja, kamu pasti tau kan... Kalau aku disuruh ngomong langsung di depan kamu, groginya udah kayak orang
                    <strong style={{ color: "var(--color-primary-text)" }}> habis dikejar beruang kutub kelaparan</strong>.
                    Tangan dingin, detak jantung 180 BPM, dan kapasitas otak mendadak drop jadi 3%.
                  </p>
                  <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.82rem", color: "var(--text-muted)" }}>
                    <Compass size={15} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                    <span>Jadi biarkan teknologi ini yang menyampaikan apa yang tertahan di kepala.</span>
                  </div>
                </div>

                {/* Soundtrack Card in Step 0 */}
                <div
                  onClick={openSelector}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    borderRadius: "16px",
                    background: "rgba(255, 255, 255, 0.9)",
                    border: "1.5px dashed rgba(255, 140, 165, 0.45)",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {currentTrack ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                      <div style={{ width: "38px", height: "38px", borderRadius: "10px", overflow: "hidden", flexShrink: 0, boxShadow: "0 1px 4px rgba(0,0,0,0.1)", background: "#FCE7EC" }}>
                        <img
                          src={currentTrack.cover}
                          alt={currentTrack.title}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = DEFAULT_COVER;
                          }}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                      </div>
                      <div style={{ textAlign: "left", minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-headline)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {currentTrack.title}
                          </span>
                          {currentTrack.isSpecial && (
                            <span style={{ fontSize: "0.62rem", fontWeight: 700, color: "var(--color-primary)", background: "rgba(255, 71, 126, 0.1)", padding: "1px 5px", borderRadius: "6px" }}>
                              ⭐ Khusus {crushName}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px" }}>
                          {currentTrack.artist} {isPlaying ? "• Sedang diputar 🎵" : "• Dijeda 🔇"}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                      <div style={{ width: "38px", height: "38px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255, 71, 126, 0.1)", color: "var(--color-primary)", flexShrink: 0 }}>
                        <Music2 size={18} />
                      </div>
                      <div style={{ textAlign: "left", minWidth: 0 }}>
                        <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-headline)" }}>
                          Mode Hening (Tanpa Musik)
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px" }}>
                          Sentuh di sini jika ingin memutar lagu
                        </div>
                      </div>
                    </div>
                  )}

                  <span
                    style={{
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      color: "var(--color-primary)",
                      padding: "4px 8px",
                      borderRadius: "10px",
                      background: "rgba(255, 71, 126, 0.08)",
                      flexShrink: 0,
                    }}
                  >
                    {currentTrack ? "Ganti Lagu 🎶" : "Pilih Lagu 🎶"}
                  </span>
                </div>
              </div>
            )}

            {/* ===================== STEP 1: SALTING STATS ===================== */}
            {currentStep === 1 && (
              <div className="story-card-scrollable">
                <div>
                  <h2>Hasil Investigasi Gejala Salting</h2>
                  <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    Catatan pengamatan jujur saat lagi berinteraksi sama kamu.
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {([
                    {
                      id: 1, icon: MessageSquareText, color: "#FF477E",
                      title: "Respon Chat Kamu", highlight: "0.002 Detik",
                      badgeIcon: Zap,
                      desc: "Chat orang lain: dibales 3-5 hari kerja. Chat dari kamu: bahkan sebelum HP selesai getar, udah langsung dibuka.",
                    },
                    {
                      id: 2, icon: Eye, color: "#FB8500",
                      title: "Kemampuan Bicara", highlight: "Drop ke 10%",
                      badgeIcon: TrendingDown,
                      desc: "Kalau ngobrol biasa: lancar. Pas tatap mata sama kamu lebih dari 3 detik: mendadak kaku kayak manekin.",
                    },
                    {
                      id: 3, icon: Laugh, color: "#FFB703",
                      title: "Tingkat Ketawa", highlight: "999 / 100",
                      badgeIcon: Star,
                      desc: "Pas kamu cerita hal receh: aku tetep ketawa paling kenceng. Bukan leluconnya yang lucu, tapi kamunya yang bikin gemas.",
                    },
                    {
                      id: 4, icon: Cpu, color: "#70D6FF",
                      title: "Kapasitas RAM Otak", highlight: "Overload 92%",
                      badgeIcon: Cpu,
                      desc: "Bukan mikirin krisis ekonomi global, tapi mikirin: 'Tadi pas papasan muka aku aneh gak ya?'",
                    },
                  ] as const).map(stat => {
                    const Icon = stat.icon;
                    const BadgeIcon = stat.badgeIcon;
                    const isOpen = activeStat === stat.id;
                    return (
                      <div
                        key={stat.id}
                        onClick={() => setActiveStat(isOpen ? null : stat.id)}
                        className="inner-card"
                        style={{
                          cursor: "pointer",
                          transition: "border-color 0.15s ease",
                          borderColor: isOpen ? "var(--border-glow)" : undefined,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div
                              style={{
                                width: "32px", height: "32px", borderRadius: "10px",
                                background: `${stat.color}12`, display: "flex",
                                alignItems: "center", justifyContent: "center",
                              }}
                            >
                              <Icon size={16} color={stat.color} />
                            </div>
                            <div>
                              <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>{stat.title}</div>
                              <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.92rem", fontWeight: 700, color: "var(--text-headline)" }}>
                                <span>{stat.highlight}</span>
                                <BadgeIcon size={13} color={stat.color} />
                              </div>
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "0.74rem", color: "var(--color-primary-text)", fontWeight: 600 }}>
                            <span>{isOpen ? "Tutup" : "Detail"}</span>
                            {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                          </div>
                        </div>
                        {isOpen && (
                          <p style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px dashed var(--border-soft)", fontSize: "0.84rem", color: "var(--text-body)", lineHeight: "1.55" }}>
                            {stat.desc}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ===================== STEP 2: APPRECIATION ===================== */}
            {currentStep === 2 && (
              <div className="story-card-scrollable">
                <div>
                  <div className="badge-pill badge-pink" style={{ width: "fit-content", marginBottom: "4px" }}>
                    <Sparkles size={12} />
                    <span>Pengamatan Jujur</span>
                  </div>
                  <h2>Hal-Hal Kecil Tentang {crushName}</h2>
                  <p style={{ fontSize: "0.84rem", color: "var(--text-muted)" }}>
                    Bukan gombalan internet, tapi hal-hal sederhana yang diam-diam selalu bikin kagum.
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {([
                    {
                      id: 1, icon: Smile, color: "#FF5B89",
                      title: "Caramu Ketawa Lepas",
                      body: "Kamu punya cara ketawa yang natural banget. Setiap kali kamu ketawa tanpa jaim, suasana yang tadinya kaku atau hari yang capek langsung berasa jauh lebih ringan.",
                    },
                    {
                      id: 2, icon: SunMedium, color: "#FB8500",
                      title: "Antusias Cerita Hal Sepele",
                      body: "Mendengarkan kamu cerita tentang kucing lewat, makanan enak, atau hal-hal kecil harian itu seru banget. Matamu selalu berbinar dan bikin orang lain ikut senyum dengernya.",
                    },
                    {
                      id: 3, icon: Coffee, color: "#8D5B4C",
                      title: "Vibe yang Selalu Nyaman",
                      body: "Pas lagi sama atau ngobrol bareng kamu, rasanya gak perlu jaim atau pura-pura jadi orang lain. Kamu punya aura ramah yang bikin suasana jadi hangat apa adanya.",
                    },
                  ] as const).map(item => {
                    const Icon = item.icon;
                    const isLiked = likedCards.includes(item.id);
                    return (
                      <div key={item.id} className="inner-card">
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: `${item.color}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <Icon size={15} color={item.color} />
                            </div>
                            <h3>{item.title}</h3>
                          </div>
                          <button
                            onClick={() => toggleHeart(item.id)}
                            aria-label="Sukai catatan"
                            style={{
                              background: isLiked ? "var(--color-primary-soft)" : "transparent",
                              border: "none", borderRadius: "50%", padding: "5px",
                              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                              transition: "background 0.15s ease",
                            }}
                          >
                            <Heart size={15} color={isLiked ? "var(--color-primary)" : "var(--text-caption)"} fill={isLiked ? "var(--color-primary)" : "none"} />
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

            {/* ===================== STEP 3: PENGUNGKAPAN PERASAAN ===================== */}
            {currentStep === 3 && (
              <div className="story-card-scrollable" style={{ textAlign: "center", alignItems: "center" }}>
                <div className="badge-pill badge-pink animate-pulse-subtle" style={{ margin: "0 auto" }}>
                  <Heart size={12} fill="currentColor" />
                  <span>Pengungkapan Perasaan</span>
                </div>

                <div>
                  <h2 style={{ marginTop: "4px" }}>
                    Pengakuan Jujur (Tanpa Sensor)
                  </h2>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    Tolong dibaca santai ya, jangan tegang kayak mau wawancara kerja.
                  </p>
                </div>

                <div
                  style={{
                    width: "100%",
                    padding: "18px 16px",
                    borderRadius: "var(--radius-lg)",
                    background: "linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(255, 240, 243, 0.85) 100%)",
                    border: "1.5px solid rgba(255, 140, 165, 0.35)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    textAlign: "center",
                    alignItems: "center",
                  }}
                >
                  <p style={{ fontSize: "0.88rem", color: "var(--text-body)", lineHeight: "1.6" }}>
                    Sebenarnya aku udah coba pasang gaya sok cool dan misterius. Tapi ternyata gagal total tiap kali kamu ajak ngobrol atau ketawa lepas, sistem di otakku langsung nge-lag parah dan butuh restart.
                  </p>

                  <p style={{ fontSize: "0.88rem", color: "var(--text-body)", lineHeight: "1.6" }}>
                    Daripada aku kena tipes gara-gara kebanyakan nahan deg-degan sendirian, mending aku buka kartu aja secara transparan tanpa kode-kodean rumit:
                  </p>

                  {/* Scratch-to-Reveal Confession */}
                  <ScratchCard>
                    Aku beneran suka sama <span style={{ color: "var(--color-primary-text)" }}>{crushName}</span>. Dan gawatnya lagi, rasa suka ini belakangan udah lewat masa uji coba dan mulai pelan-pelan bertransformasi jadi perasaan cinta.
                  </ScratchCard>

                  {/* Interactive Confession Banner */}
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    onClick={handleConfessionHeartClick}
                    style={{
                      width: "100%",
                      height: "48px",
                      borderRadius: "var(--radius-full)",
                      background: "linear-gradient(135deg, rgba(255, 71, 126, 0.12) 0%, rgba(255, 183, 3, 0.1) 100%)",
                      border: "1.5px solid rgba(255, 71, 126, 0.35)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      userSelect: "none",
                      boxSizing: "border-box",
                    }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.25, 1] }}
                      transition={{ repeat: Infinity, duration: 1.3, ease: "easeInOut" }}
                      style={{ display: "inline-flex" }}
                    >
                      <Heart size={18} color="var(--color-primary)" fill="var(--color-primary)" />
                    </motion.div>
                    <span
                      style={{
                        fontSize: "1.05rem",
                        fontWeight: 800,
                        fontStyle: "italic",
                        color: "var(--color-primary-text)",
                        letterSpacing: "0.01em",
                      }}
                    >
                      I do really like you
                    </span>
                    <motion.div
                      animate={{ scale: [1, 1.25, 1] }}
                      transition={{ repeat: Infinity, duration: 1.3, ease: "easeInOut", delay: 0.2 }}
                      style={{ display: "inline-flex" }}
                    >
                      <Heart size={18} color="var(--color-primary)" fill="var(--color-primary)" />
                    </motion.div>
                  </motion.div>

                  <p style={{ fontSize: "0.74rem", color: "var(--text-caption)" }}>
                    {confessionTaps > 0
                      ? `Detak jantung bertambah (${confessionTaps}x)! Tenang, tombol ini aman`
                      : "(Boleh diketuk kok, aman dan gak bakal nyetrum)"}
                  </p>

                  <div
                    style={{
                      fontSize: "0.78rem",
                      color: "var(--text-body)",
                      paddingTop: "8px",
                      borderTop: "1px dashed var(--border-soft)",
                      width: "100%",
                      lineHeight: "1.55",
                    }}
                  >
                    <strong>Protokol Anti-Canggung:</strong> Gak usah bingung mau bales apa ya. Ini bukan ujian lisan yang harus langsung dijawab, murni biar aku gak kena denda overthinking kelamaan. Besok ketemu kita tetep bisa ketawa-ketawa santai kayak biasa!
                  </div>
                </div>
              </div>
            )}

            {/* ===================== STEP 4: HONEST LETTER ===================== */}
            {currentStep === 4 && (
              <div className="story-card-scrollable">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <h2>Untuk {crushName},</h2>
                  {!isTypingComplete && (
                    <button
                      onClick={handleSkipTyping}
                      style={{
                        background: "none", border: "none",
                        color: "var(--text-muted)", fontSize: "0.73rem",
                        textDecoration: "underline", cursor: "pointer",
                        padding: "2px 4px",
                      }}
                    >
                      Tampilkan Semua
                    </button>
                  )}
                </div>

                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--text-body)",
                    lineHeight: "1.7",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    minHeight: "160px",
                  }}
                >
                  {renderedParagraphs.map((p) => {
                    if (p.isLast) {
                      return (
                        <div
                          key={p.index}
                          style={{
                            marginTop: "4px",
                            padding: "10px 14px",
                            background: "rgba(255, 71, 126, 0.07)",
                            borderLeft: "3px solid var(--color-primary)",
                            borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
                            fontStyle: "italic",
                            fontWeight: 600,
                            fontSize: "0.88rem",
                            color: "var(--color-primary-text)",
                            lineHeight: "1.55",
                            letterSpacing: "0.01em",
                          }}
                        >
                          {p.text}
                          {p.isCurrent && (
                            <motion.span
                              animate={{ opacity: [1, 0] }}
                              transition={{ repeat: Infinity, duration: 0.55 }}
                              style={{
                                display: "inline-block",
                                width: "2px",
                                height: "1.05em",
                                backgroundColor: "var(--color-primary)",
                                verticalAlign: "text-bottom",
                                marginLeft: "2px",
                              }}
                            />
                          )}
                        </div>
                      );
                    }
                    return (
                      <p key={p.index} style={{ margin: 0 }}>
                        {p.text}
                        {p.isCurrent && (
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ repeat: Infinity, duration: 0.55 }}
                            style={{
                              display: "inline-block",
                              width: "2px",
                              height: "1.05em",
                              backgroundColor: "var(--color-primary)",
                              verticalAlign: "text-bottom",
                              marginLeft: "2px",
                            }}
                          />
                        )}
                      </p>
                    );
                  })}
                </div>

                {/* Assurances */}
                <div style={{ paddingTop: "8px", borderTop: "1px dashed var(--border-soft)", display: "flex", flexDirection: "column", gap: "5px" }}>
                  <div className="check-row">
                    <CheckCircle2 size={14} color="var(--color-accent-green)" />
                    <span>Garansi 100% anti-canggung dan bebas drama kalau papasan</span>
                  </div>
                  <div className="check-row">
                    <CheckCircle2 size={14} color="var(--color-accent-green)" />
                    <span>Tetap santai, asik ngobrol, dan gak bakal ditagih jawaban</span>
                  </div>
                </div>

                {/* Signature */}
                <div style={{ textAlign: "right", marginTop: "6px" }}>
                  <span style={{ fontSize: "0.76rem", color: "var(--text-caption)" }}>Tertanda dari yang ngetik sambil nahan napas,</span>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "5px" }}>
                    <p className="font-hand" style={{ fontSize: "1.6rem", color: "var(--color-primary-text)", lineHeight: "1.1" }}>
                      {senderName}
                    </p>
                    <PenTool size={14} color="var(--color-primary)" />
                  </div>
                </div>
              </div>
            )}

            {/* ===================== STEP 5: CONCLUSION ===================== */}
            {currentStep === 5 && (
              <div className="story-card-scrollable" style={{ textAlign: "center" }}>
                <div className="badge-pill badge-green" style={{ margin: "0 auto" }}>
                  <CheckCircle2 size={12} />
                  <span>Selesai Dibaca</span>
                </div>

                <div>
                  <h2 style={{ fontSize: "1.25rem" }}>Terima Kasih Sudah Membaca!</h2>
                  <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", marginTop: "4px" }}>
                    Semoga website ini bisa bikin kamu tersenyum di sela-sela harimu.
                  </p>
                </div>

                {/* Confetti Button */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <button onClick={handleSendConfetti} className="btn-primary">
                    <Heart size={16} fill="#ffffff" />
                    <span>Kirim Senyuman &amp; Hati Virtual</span>
                    <Sparkles size={15} />
                  </button>

                  <AnimatePresence>
                    {hasSentHeart && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        style={{
                          padding: "8px 12px",
                          background: "var(--color-primary-soft)",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "0.8rem",
                          color: "var(--color-primary-text)",
                          fontWeight: 600,
                          display: "flex", alignItems: "center", justifyContent: "center", gap: "5px",
                        }}
                      >
                        <Heart size={13} fill="currentColor" />
                        <span>Senyuman terkirim! (Total: {heartsCount}x) Makasih {crushName}!</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Divider */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-caption)", fontSize: "0.74rem" }}>
                  <div style={{ flex: 1, height: "1px", background: "var(--border-soft)" }} />
                  <span>Mau kirim respon balik?</span>
                  <div style={{ flex: 1, height: "1px", background: "var(--border-soft)" }} />
                </div>

                {/* WhatsApp */}
                <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="btn-wa">
                  <MessageCircle size={16} fill="#ffffff" />
                  <span>Kirim Reaksi Santai ke WhatsApp</span>
                </a>

                <p style={{ fontSize: "0.74rem", color: "var(--text-caption)" }}>
                  (Pesannya santai dan bisa diedit sesuka hati sebelum dikirim ke {senderName})
                </p>

                {/* Reset */}
                <div style={{ paddingTop: "8px", borderTop: "1px dashed var(--border-soft)" }}>
                  <button onClick={handleReset} className="btn-secondary">
                    <RotateCcw size={14} />
                    <span>Baca Ulang Dari Langkah 1</span>
                  </button>
                </div>

                <div className="check-row" style={{ justifyContent: "center", marginTop: "2px" }}>
                  <ShieldCheck size={13} color="var(--color-accent-green)" />
                  <span>100% Zero-Pressure &bull; Gak ada beruang, cuma rasa kagum tulus</span>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom Navigation ── */}
      <nav className="story-bottom-nav">
        {currentStep > 0 ? (
          <button
            onClick={handlePrev}
            className="btn-secondary"
            style={{ width: "auto", flex: "0 0 110px" }}
          >
            <ChevronLeft size={17} />
            <span>Sebelumnya</span>
          </button>
        ) : (
          <div style={{ flex: "0 0 0" }} />
        )}

        {currentStep < TOTAL_STEPS - 1 ? (
          <button onClick={handleNext} className="btn-primary" style={{ flex: 1 }}>
            <span>
              {currentStep === 0 && "Buka Catatan Rahasia"}
              {currentStep === 1 && "Lanjut: Tentang Kamu"}
              {currentStep === 2 && "Buka Pengungkapan Perasaan"}
              {currentStep === 3 && "Baca Surat Kejujuran"}
              {currentStep === 4 && "Lanjut ke Penutup"}
            </span>
            <ArrowRight size={17} />
          </button>
        ) : (
          <div style={{ flex: 1, textAlign: "center", fontSize: "0.8rem", color: "var(--text-caption)" }}>
            Semua langkah selesai dibaca
          </div>
        )}
      </nav>
    </div>
  );
}
