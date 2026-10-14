"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Send,
  Loader2,
  Sparkles,
  CheckCheck,
  LogOut,
  ShieldCheck,
  Heart,
  Bot,
  AlertCircle,
  KeyRound,
  Delete,
} from "lucide-react";
import confetti from "canvas-confetti";
import { confessionConfig } from "@/config/confession";
import { ChatMessage } from "@/app/api/chat/send/route";

const CORRECT_PIN = "550504";
const STORAGE_PIN_KEY = "foryou_chat_pin_unlocked";
const STORAGE_CHAT_KEY = "foryou_chat_history_cache";
const POLLING_INTERVAL_MS = 3000;

export default function ChatScreen() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { crushName, senderName } = confessionConfig;

  // Check session unlock on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const savedUnlock = sessionStorage.getItem(STORAGE_PIN_KEY);
        if (savedUnlock === "true") {
          setIsUnlocked(true);
        }

        const cached = localStorage.getItem(STORAGE_CHAT_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            setMessages(parsed);
          }
        }
      }
    } catch (e) {
      console.warn("Storage read error:", e);
    }
  }, []);

  // Save messages to local storage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_CHAT_KEY, JSON.stringify(messages));
      } catch (e) {
        console.warn("Storage write error:", e);
      }
    }
  }, [messages]);

  // Scroll to bottom on new messages
  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
  }, []);

  useEffect(() => {
    if (isUnlocked) {
      scrollToBottom();
    }
  }, [messages, isUnlocked, scrollToBottom]);

  // Polling for incoming messages from Wisnu via Telegram
  useEffect(() => {
    if (!isUnlocked) return;

    let isMounted = true;

    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/chat/messages", { cache: "no-store" });
        const data = await res.json();

        if (data.success && Array.isArray(data.messages) && isMounted) {
          setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const newFromWisnu = data.messages.filter((m: ChatMessage) => !existingIds.has(m.id));

            if (newFromWisnu.length > 0) {
              // Merge and sort
              const merged = [...prev, ...newFromWisnu].sort((a, b) => a.timestamp - b.timestamp);
              return merged;
            }
            return prev;
          });
        }
      } catch (err) {
        console.warn("Polling error:", err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, POLLING_INTERVAL_MS);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isUnlocked]);

  // PIN validation handler
  const handlePinSubmit = (enteredPin: string) => {
    if (enteredPin === CORRECT_PIN) {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#FF477E", "#FFB703", "#70D6FF"],
      });
      setIsUnlocked(true);
      try {
        sessionStorage.setItem(STORAGE_PIN_KEY, "true");
      } catch (e) {}
      setPinError(null);
    } else {
      setIsShaking(true);
      setPinError("PIN salah! Coba inget-inget tanggal atau angka spesial kalian wkwk 🙈");
      setTimeout(() => {
        setIsShaking(false);
        setPinInput("");
      }, 500);
    }
  };

  const handleKeyPress = (num: string) => {
    if (pinInput.length < 6) {
      const next = pinInput + num;
      setPinInput(next);
      setPinError(null);
      if (next.length === 6) {
        handlePinSubmit(next);
      }
    }
  };

  const handleDelete = () => {
    setPinInput((prev) => prev.slice(0, -1));
    setPinError(null);
  };

  const handleLock = () => {
    setIsUnlocked(false);
    setPinInput("");
    try {
      sessionStorage.removeItem(STORAGE_PIN_KEY);
    } catch (e) {}
  };

  // Send message handler
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || isSending) return;

    const tempId = `crush_${Date.now()}`;
    const optimisticMsg: ChatMessage = {
      id: tempId,
      text: trimmed,
      sender: "crush",
      timestamp: Date.now(),
    };

    // Optimistic UI update
    setMessages((prev) => [...prev, optimisticMsg]);
    setInputText("");
    setIsSending(true);

    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });

      const data = await res.json();
      if (data.success && data.message) {
        // Replace tempId with server ID if different
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...data.message } : m))
        );
      }
    } catch (err) {
      console.warn("Failed to send chat message:", err);
    } finally {
      setIsSending(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  };

  /* ===================== VIEW 1: PIN PROTECTION GATE ===================== */
  if (!isUnlocked) {
    return (
      <div className="story-wrapper" style={{ justifyContent: "center", alignItems: "center" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="glass-card"
          style={{ width: "100%", maxWidth: "380px", textAlign: "center", padding: "28px 20px" }}
        >
          {/* Lock Icon */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "var(--color-primary-soft)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-primary)",
                boxShadow: "0 4px 16px rgba(255, 71, 126, 0.2)",
              }}
            >
              <Lock size={26} />
            </div>
          </div>

          <h2 style={{ fontSize: "1.28rem", color: "var(--text-headline)" }}>
            Ruang Obrolan Rahasia 🔐
          </h2>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Khusus buat <span style={{ fontWeight: 700, color: "var(--color-primary-text)" }}>{crushName}</span>. Masukkan 6 digit PIN untuk membuka obrolan langsung ke Telegram {senderName}.
          </p>

          {/* PIN Input Indicators (6 circles) */}
          <motion.div
            animate={isShaking ? { x: [-12, 12, -10, 10, -5, 5, 0] } : {}}
            transition={{ duration: 0.4 }}
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              margin: "24px 0 16px",
            }}
          >
            {Array.from({ length: 6 }).map((_, idx) => {
              const isFilled = idx < pinInput.length;
              return (
                <div
                  key={idx}
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    border: isFilled
                      ? "2px solid var(--color-primary)"
                      : "2px solid rgba(200, 160, 170, 0.4)",
                    backgroundColor: isFilled ? "var(--color-primary)" : "transparent",
                    transform: isFilled ? "scale(1.15)" : "scale(1)",
                    transition: "all 0.15s ease",
                  }}
                />
              );
            })}
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {pinError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  color: "#E03569",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  marginBottom: "12px",
                }}
              >
                <AlertCircle size={14} />
                <span>{pinError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Keypad */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "10px",
              maxWidth: "260px",
              margin: "0 auto",
            }}
          >
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
              <motion.button
                key={num}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleKeyPress(num)}
                style={{
                  height: "52px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-soft)",
                  background: "var(--bg-elevated)",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "var(--text-headline)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                }}
              >
                {num}
              </motion.button>
            ))}

            <div />
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => handleKeyPress("0")}
              style={{
                height: "52px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-soft)",
                background: "var(--bg-elevated)",
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "var(--text-headline)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
              }}
            >
              0
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={handleDelete}
              style={{
                height: "52px",
                borderRadius: "var(--radius-md)",
                border: "none",
                background: "transparent",
                color: "var(--text-muted)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Delete size={20} />
            </motion.button>
          </div>

          <div style={{ marginTop: "18px", fontSize: "0.74rem", color: "var(--text-caption)" }}>
            🔒 Terenkripsi &bull; Pesan rahasia 2 arah ke Telegram
          </div>
        </motion.div>
      </div>
    );
  }

  /* ===================== VIEW 2: UNLOCKED CHAT ROOM ===================== */
  return (
    <div
      className="story-wrapper"
      style={{
        padding: "12px 12px 14px",
        height: "100dvh",
        maxHeight: "100dvh",
        overflow: "hidden",
      }}
    >
      <div
        className="glass-card"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "0",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
        }}
      >
        {/* ── Chat Header ── */}
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid var(--border-soft)",
            background: "rgba(255, 255, 255, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #FF5B89 0%, #FF3366 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "1rem",
                }}
              >
                {senderName.charAt(0)}
              </div>
              {/* Online pulse dot */}
              <span
                style={{
                  position: "absolute",
                  bottom: "1px",
                  right: "1px",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: "#25D366",
                  border: "2px solid #fff",
                }}
              />
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ fontWeight: 700, fontSize: "0.94rem", color: "var(--text-headline)" }}>
                  {senderName}
                </span>
                <Heart size={13} fill="var(--color-primary)" color="var(--color-primary)" />
              </div>
              <div style={{ fontSize: "0.72rem", color: "#1B6D30", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#25D366" }} />
                <span>Terhubung ke Telegram Bot</span>
              </div>
            </div>
          </div>

          {/* Lock / Exit button */}
          <button
            onClick={handleLock}
            title="Kunci Ruang Chat"
            style={{
              background: "var(--surface-inner)",
              border: "1px solid var(--border-soft)",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted)",
              cursor: "pointer",
            }}
          >
            <LogOut size={16} />
          </button>
        </div>

        {/* ── Chat Messages Body ── */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 14px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {/* Welcome Hint Banner */}
          <div
            style={{
              padding: "12px 14px",
              borderRadius: "var(--radius-md)",
              background: "rgba(255, 71, 126, 0.06)",
              border: "1px dashed var(--border-soft)",
              textAlign: "center",
              fontSize: "0.78rem",
              color: "var(--text-muted)",
              lineHeight: "1.5",
              margin: "4px 0 10px",
            }}
          >
            <Sparkles size={14} color="var(--color-primary)" style={{ verticalAlign: "middle", marginRight: "4px" }} />
            Hai <strong>{crushName}</strong>! Setiap pesan yang kamu ketik di sini langsung terkirim ke notifikasi Telegram {senderName}. Balasan dari {senderName} juga akan otomatis muncul di sini! 💌
          </div>

          {messages.length === 0 && (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                color: "var(--text-caption)",
                fontSize: "0.82rem",
              }}
            >
              <Bot size={32} color="var(--color-primary)" />
              <p>Belum ada obrolan. Mulai sapa {senderName} yuk!</p>
            </div>
          )}

          {/* Message Bubbles */}
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isCrush = msg.sender === "crush";
              const timeStr = new Date(msg.timestamp).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    display: "flex",
                    justifyContent: isCrush ? "flex-end" : "flex-start",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "80%",
                      padding: "10px 14px",
                      borderRadius: isCrush ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      background: isCrush
                        ? "linear-gradient(135deg, #FF5B89 0%, #FF3366 100%)"
                        : "var(--bg-elevated)",
                      color: isCrush ? "#ffffff" : "var(--text-headline)",
                      border: isCrush ? "none" : "1px solid var(--border-soft)",
                      boxShadow: isCrush
                        ? "0 3px 10px rgba(255, 71, 126, 0.25)"
                        : "0 2px 8px rgba(0, 0, 0, 0.04)",
                      wordBreak: "break-word",
                      fontSize: "0.88rem",
                      lineHeight: "1.45",
                    }}
                  >
                    {!isCrush && (
                      <div
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          color: "var(--color-primary)",
                          marginBottom: "2px",
                        }}
                      >
                        {senderName}
                      </div>
                    )}
                    <div>{msg.text}</div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: "3px",
                        fontSize: "0.66rem",
                        color: isCrush ? "rgba(255,255,255,0.8)" : "var(--text-caption)",
                        marginTop: "4px",
                      }}
                    >
                      <span>{timeStr}</span>
                      {isCrush && <CheckCheck size={12} />}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* ── Input Bar ── */}
        <form
          onSubmit={handleSendMessage}
          style={{
            padding: "10px 12px",
            borderTop: "1px solid var(--border-soft)",
            background: "rgba(255, 255, 255, 0.95)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexShrink: 0,
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Ketik pesan buat ${senderName}...`}
            style={{
              flex: 1,
              height: "44px",
              padding: "0 14px",
              borderRadius: "var(--radius-full)",
              border: "1px solid var(--border-soft)",
              background: "var(--surface-inner)",
              fontSize: "0.88rem",
              color: "var(--text-headline)",
              outline: "none",
            }}
          />

          <motion.button
            type="submit"
            whileTap={{ scale: 0.92 }}
            disabled={!inputText.trim() || isSending}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: inputText.trim()
                ? "linear-gradient(135deg, #FF5B89 0%, #FF3366 100%)"
                : "rgba(200, 180, 190, 0.3)",
              border: "none",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: inputText.trim() && !isSending ? "pointer" : "default",
              boxShadow: inputText.trim() ? "0 2px 8px rgba(255, 71, 126, 0.3)" : "none",
              transition: "all 0.15s ease",
            }}
          >
            {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </motion.button>
        </form>
      </div>
    </div>
  );
}
