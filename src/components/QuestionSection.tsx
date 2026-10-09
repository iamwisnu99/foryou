"use client";

import React, { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  Send,
  Loader2,
  Sparkles,
  Heart,
  MessageSquareHeart,
  Smile,
  Compass,
  Zap,
} from "lucide-react";
import confetti from "canvas-confetti";
import { confessionConfig } from "@/config/confession";

interface QuestionSectionProps {
  onComplete: () => void;
}

interface QuestionItem {
  id: number;
  tag: string;
  badgeColor: "pink" | "amber" | "green";
  title: string;
  subtitle: string;
  options: string[];
}

const QUESTIONS: QuestionItem[] = [
  {
    id: 1,
    tag: "Reaksi Spontan",
    badgeColor: "pink",
    title: "Pas pertama buka website ini dan baca isinya, jujurly apa yang terlintas di pikiran kamu?",
    subtitle: "Pilih yang paling menggambarkan ekspresi aslimu tadi ya wkwk",
    options: [
      "Kaget banget, kirain dapet link phishing atau tagihan pinjol! 😂",
      "Senyum-senyum sendiri kayak orang aneh di depan layar 🤭",
      "Bengong 5 detik sambil mikir 'Ini orang niat amat bikin ginian' 🙈",
      "Langsung cek denyut nadi, takut denyut jantung naik drastis ❤️",
    ],
  },
  {
    id: 2,
    tag: "Sudut Pandang Kamu",
    badgeColor: "amber",
    title: "Menurut kamu, seorang Wisnu ini kalau diibaratkan sosok, tipe yang kayak gimana sih?",
    subtitle: "Jawaban ini 100% rahasia dan aman dari pengadilan mana pun",
    options: [
      "Tukang salting profesional nomor satu di bumi 🫣",
      "Kadang random & aneh, tapi perhatian dan gemesin banget 🥺",
      "Programmer handal yang rela lembur demi bikin anak orang baper ✨",
      "Spesial... tapi rahasia dong, masa dibocorin sekarang 😜",
    ],
  },
  {
    id: 3,
    tag: "Rencana Santai",
    badgeColor: "green",
    title: "Kalau kapan-kapan orang di balik web ini ngajak jajan es krim atau ngopi santai berdua, responmu...?",
    subtitle: "Tenang, ini survey santai tanpa ikatan materai 10.000 wkwk",
    options: [
      "GASSS! Tapi syaratnya yang bikin web yang bayarin ya! 🍦☕",
      "Boleh banget, asalkan kamu janji gak grogi pas ketemu langsung 😆",
      "Boleh dipikir-pikir dulu sambil nunggu undangan resminya 👀",
      "Mauuu! Kabarin aja kalau lagi senggang 🥰",
    ],
  },
];

export default function QuestionSection({ onComplete }: QuestionSectionProps) {
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [customNote, setCustomNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { crushName, senderName } = confessionConfig;

  const totalCards = QUESTIONS.length + 1; // 3 multiple choice questions + 1 note/submit card
  const isLastCard = activeQuestionIdx === totalCards - 1;

  // Mini confetti burst for selection
  const fireOptionConfetti = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    confetti({
      particleCount: 18,
      spread: 45,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      },
      colors: ["#FF477E", "#FFB703", "#70D6FF"],
      shapes: ["circle"],
      scalar: 0.85,
      gravity: 1.4,
      ticks: 60,
    });
  };

  // Handle option select with automatic smooth advance
  const handleSelectOption = (
    e: React.MouseEvent<HTMLButtonElement>,
    questionId: number,
    option: string
  ) => {
    fireOptionConfetti(e);
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));

    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
    }

    // Auto advance smoothly after 420ms so user sees checkmark
    autoAdvanceTimerRef.current = setTimeout(() => {
      if (activeQuestionIdx < totalCards - 1) {
        setDirection(1);
        setActiveQuestionIdx((curr) => curr + 1);
      }
    }, 420);
  };

  const handleNextCard = useCallback(() => {
    if (activeQuestionIdx < totalCards - 1) {
      setDirection(1);
      setActiveQuestionIdx((curr) => curr + 1);
    }
  }, [activeQuestionIdx, totalCards]);

  const handlePrevCard = useCallback(() => {
    if (activeQuestionIdx > 0) {
      setDirection(-1);
      setActiveQuestionIdx((curr) => curr - 1);
    }
  }, [activeQuestionIdx]);

  // Handle final submission to Telegram
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const answersPayload = QUESTIONS.map((q) => ({
      questionId: q.id,
      questionTitle: q.title,
      selectedOption: selectedAnswers[q.id] || "(Dilewati)",
    }));

    try {
      const response = await fetch("/api/send-telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          crushName,
          senderName,
          answers: answersPayload,
          note: customNote,
        }),
      });

      const data = await response.json();

      if (!response.ok && !data.simulated) {
        throw new Error(data.error || "Gagal mengirim jawaban");
      }

      setIsSubmitted(true);

      // Trigger celebratory confetti
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FF477E", "#FF70A6", "#FFB703", "#70D6FF"],
      });

      // Proceed to Step 6 (Pesan Akhir) after brief success moment
      setTimeout(() => {
        onComplete();
      }, 1200);
    } catch (err: any) {
      console.warn("Telegram submission error, continuing gracefully:", err);
      // Graceful fallback: even if bot network fails, allow crush to continue to the final step!
      setIsSubmitted(true);
      setTimeout(() => {
        onComplete();
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Card slide animations
  const cardVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 35 : -35,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.22, ease: "easeOut" as const },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -35 : 35,
      opacity: 0,
      transition: { duration: 0.16, ease: "easeIn" as const },
    }),
  };

  const currentQ = QUESTIONS[activeQuestionIdx];

  return (
    <div className="story-card-scrollable" style={{ textAlign: "left" }}>
      {/* Quiz Header Indicator */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px dashed var(--border-soft)",
          paddingBottom: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            className="badge-pill badge-pink"
            style={{ fontSize: "0.72rem", padding: "2px 8px" }}
          >
            Pertanyaan {activeQuestionIdx + 1} dari {totalCards}
          </span>
          <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 600 }}>
            Kuis Kejujuran
          </span>
        </div>

        {/* Step dots */}
        <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          {Array.from({ length: totalCards }).map((_, idx) => (
            <div
              key={idx}
              style={{
                width: idx === activeQuestionIdx ? "16px" : "6px",
                height: "6px",
                borderRadius: "3px",
                backgroundColor:
                  idx === activeQuestionIdx
                    ? "var(--color-primary)"
                    : idx < activeQuestionIdx
                    ? "var(--color-warm-amber)"
                    : "rgba(255, 120, 150, 0.2)",
                transition: "all 0.25s ease",
              }}
            />
          ))}
        </div>
      </div>

      {/* Per-Card Content with AnimatePresence */}
      <div style={{ minHeight: "330px", position: "relative" }}>
        <AnimatePresence custom={direction} mode="wait">
          {activeQuestionIdx < QUESTIONS.length ? (
            /* ================= MULTIPLE CHOICE CARDS (1, 2, 3) ================= */
            <motion.div
              key={currentQ.id}
              custom={direction}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <div>
                <div
                  className={`badge-pill badge-${currentQ.badgeColor}`}
                  style={{ marginBottom: "6px", width: "fit-content" }}
                >
                  <Sparkles size={11} />
                  <span>{currentQ.tag}</span>
                </div>
                <h3
                  style={{
                    fontSize: "1.02rem",
                    lineHeight: "1.4",
                    color: "var(--text-headline)",
                    fontWeight: 700,
                  }}
                >
                  {currentQ.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--text-muted)",
                    marginTop: "3px",
                  }}
                >
                  {currentQ.subtitle}
                </p>
              </div>

              {/* Options */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "2px" }}>
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedAnswers[currentQ.id] === opt;
                  return (
                    <motion.button
                      key={idx}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => handleSelectOption(e, currentQ.id, opt)}
                      style={{
                        padding: "10px 14px",
                        textAlign: "left",
                        borderRadius: "var(--radius-md)",
                        border: isSelected
                          ? "1.5px solid var(--color-primary)"
                          : "1px solid var(--border-soft)",
                        background: isSelected
                          ? "var(--color-primary-soft)"
                          : "var(--surface-inner)",
                        color: isSelected
                          ? "var(--color-primary-text)"
                          : "var(--text-body)",
                        fontSize: "0.85rem",
                        lineHeight: "1.45",
                        fontWeight: isSelected ? 600 : 500,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "10px",
                        boxShadow: isSelected
                          ? "0 2px 8px rgba(255, 71, 126, 0.15)"
                          : "none",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <span style={{ flex: 1 }}>{opt}</span>
                      <div
                        style={{
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          border: isSelected
                            ? "none"
                            : "1.5px solid rgba(180, 150, 160, 0.4)",
                          backgroundColor: isSelected
                            ? "var(--color-primary)"
                            : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          transition: "all 0.15s ease",
                        }}
                      >
                        {isSelected && (
                          <CheckCircle2 size={13} color="#ffffff" strokeWidth={3} />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            /* ================= FINAL CARD (4): OPTIONAL NOTE + SUBMIT ================= */
            <motion.div
              key="note-card"
              custom={direction}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <div>
                <div
                  className="badge-pill badge-pink"
                  style={{ marginBottom: "6px", width: "fit-content" }}
                >
                  <MessageSquareHeart size={11} />
                  <span>Pesan Tambahan (Opsional)</span>
                </div>
                <h3
                  style={{
                    fontSize: "1.02rem",
                    lineHeight: "1.4",
                    color: "var(--text-headline)",
                    fontWeight: 700,
                  }}
                >
                  Ada pesan rahasia, ledekan, atau request traktiran buat {senderName}?
                </h3>
                <p
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--text-muted)",
                    marginTop: "3px",
                  }}
                >
                  Boleh dikosongin kalau bingung, tapi kalau diisi bakal bikin {senderName} makin senyum-senyum sendiri wkwk.
                </p>
              </div>

              {/* Textarea */}
              <div style={{ marginTop: "4px" }}>
                <textarea
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder={`Tulis apa aja di sini buat ${senderName}... (contoh: "Besok kalau ketemu jangan salting ya! wkwk")`}
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-soft)",
                    background: "var(--surface-inner)",
                    fontSize: "0.85rem",
                    lineHeight: "1.5",
                    color: "var(--text-headline)",
                    fontFamily: "inherit",
                    resize: "none",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s ease",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border-soft)")}
                />
              </div>

              {/* Submit CTA */}
              <div style={{ marginTop: "6px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || isSubmitted}
                  className="btn-primary"
                  style={{
                    gap: "8px",
                    opacity: isSubmitting ? 0.8 : 1,
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Mengirim sinyal ke {senderName}...</span>
                    </>
                  ) : isSubmitted ? (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Terkirim! Membuka Langkah Akhir...</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Kirim Jawaban &amp; Buka Pesan Akhir</span>
                      <Sparkles size={14} />
                    </>
                  )}
                </button>
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--text-caption)",
                    textAlign: "center",
                  }}
                >
                  🔒 Jawabanmu akan otomatis terkirim rahasia ke Telegram {senderName} saja
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Internal Navigation for Quiz Cards (Prev / Next) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "10px",
          borderTop: "1px dashed var(--border-soft)",
        }}
      >
        {activeQuestionIdx > 0 ? (
          <button
            onClick={handlePrevCard}
            style={{
              background: "none",
              border: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              color: "var(--text-muted)",
              fontSize: "0.78rem",
              cursor: "pointer",
              fontWeight: 600,
              padding: "4px 8px",
            }}
          >
            <ChevronLeft size={14} />
            <span>Pertanyaan Sebelumnya</span>
          </button>
        ) : (
          <div />
        )}

        {!isLastCard && (
          <button
            onClick={handleNextCard}
            style={{
              background: "none",
              border: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              color: "var(--color-primary-text)",
              fontSize: "0.78rem",
              cursor: "pointer",
              fontWeight: 600,
              padding: "4px 8px",
            }}
          >
            <span>
              {selectedAnswers[currentQ?.id] ? "Lanjut" : "Lewati"}
            </span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
