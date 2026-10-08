"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Sparkles, Eye, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";

interface ScratchCardProps {
  children: React.ReactNode;
  revealThreshold?: number; // e.g. 35 for 35%
  onReveal?: () => void;
}

export default function ScratchCard({
  children,
  revealThreshold = 35,
  onReveal,
}: ScratchCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const strokeCountRef = useRef(0);
  const isRevealedRef = useRef(false);

  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);

  // Paint the decorative scratch-off cover
  const paintCover = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    ctx.save();
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    // 1. Shimmering romantic rose-gold gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#FFA5B8");
    grad.addColorStop(0.3, "#FF85A0");
    grad.addColorStop(0.7, "#FF708F");
    grad.addColorStop(1, "#FF547D");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // 2. Playful diagonal foil shimmer lines
    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
    ctx.lineWidth = 14;
    for (let x = -h; x < w + h; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + h, h);
      ctx.stroke();
    }
    ctx.restore();

    // 3. Decorative subtle golden & white sparkles
    const sparkles = [
      { x: 0.1, y: 0.22, r: 2.2 },
      { x: 0.9, y: 0.25, r: 2 },
      { x: 0.18, y: 0.8, r: 2 },
      { x: 0.82, y: 0.78, r: 2.2 },
      { x: 0.5, y: 0.15, r: 2 },
      { x: 0.12, y: 0.52, r: 1.8 },
      { x: 0.88, y: 0.52, r: 1.8 },
    ];

    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    sparkles.forEach((s) => {
      ctx.beginPath();
      ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // 4. Subtle inner border frame
    ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(6, 6, w - 12, h - 12);

    // 5. Centered instruction & cute scratch badge
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const centerY = h / 2;

    // Emojis / icon header
    ctx.font = "20px system-ui, -apple-system, sans-serif";
    ctx.fillText("🪙 ✨ 💌", w / 2, centerY - 20);

    // Main scratch invitation
    ctx.font = "bold 13px system-ui, -apple-system, sans-serif";
    ctx.shadowColor = "rgba(0, 0, 0, 0.28)";
    ctx.shadowBlur = 3;
    ctx.shadowOffsetY = 1;
    ctx.fillText("GOSOK DI SINI", w / 2, centerY + 4);

    // Subtitle helper
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.font = "500 11px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.fillText("(Usap layarmu untuk buka rahasia 🤫)", w / 2, centerY + 24);

    ctx.restore();
  }, []);

  // Compute scratch percentage
  const checkScratchPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealedRef.current) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    try {
      const width = canvas.width;
      const height = canvas.height;
      if (width === 0 || height === 0) return;

      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;
      let transparentCount = 0;
      let totalSampled = 0;

      // Sample every 16th pixel for high performance
      const stride = 16 * 4;
      for (let i = 3; i < data.length; i += stride) {
        totalSampled++;
        if (data[i] < 128) {
          transparentCount++;
        }
      }

      if (totalSampled > 0) {
        const percentage = Math.min(
          100,
          Math.round((transparentCount / totalSampled) * 100)
        );
        setScratchProgress(percentage);

        if (percentage >= revealThreshold) {
          revealAll();
        }
      }
    } catch {
      // Safe fallback
    }
  }, [revealThreshold]);

  // Trigger celebration & complete reveal
  const revealAll = useCallback(() => {
    if (isRevealedRef.current) return;
    isRevealedRef.current = true;
    setIsRevealed(true);
    setScratchProgress(100);

    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FF477E", "#FF70A6", "#FFB703", "#FFCAD4", "#FF8FA3"],
    });

    if (onReveal) {
      onReveal();
    }
  }, [onReveal]);

  // Reset to scratch again
  const resetScratch = useCallback(() => {
    isRevealedRef.current = false;
    strokeCountRef.current = 0;
    setIsRevealed(false);
    setScratchProgress(0);
    lastPosRef.current = null;
    requestAnimationFrame(() => {
      paintCover();
    });
  }, [paintCover]);

  // Scratch coordinate helper
  const getCoords = useCallback((e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ("touches" in e) {
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if (e.changedTouches && e.changedTouches.length > 0) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      }
    } else {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }, []);

  // Erase coating at coordinates
  const eraseAt = useCallback(
    (x: number, y: number, lastX?: number, lastY?: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;

      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.scale(dpr, dpr);

      const brushRadius = 24;

      if (lastX !== undefined && lastY !== undefined) {
        ctx.lineWidth = brushRadius * 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(x, y, brushRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // Tactile haptic feedback on mobile if supported
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate(8);
        } catch {
          // safe ignore
        }
      }
    },
    []
  );

  // ResizeObserver for initial render and window resizing
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      if (!isRevealedRef.current && strokeCountRef.current === 0) {
        paintCover();
      }
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [paintCover]);

  // Touch event listeners attached natively with { passive: false }
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (isRevealedRef.current) return;
      if (e.cancelable) e.preventDefault();
      isDrawingRef.current = true;
      const pos = getCoords(e);
      lastPosRef.current = pos;
      eraseAt(pos.x, pos.y);
      strokeCountRef.current++;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isRevealedRef.current || !isDrawingRef.current) return;
      if (e.cancelable) e.preventDefault();
      const pos = getCoords(e);
      eraseAt(pos.x, pos.y, lastPosRef.current?.x, lastPosRef.current?.y);
      lastPosRef.current = pos;
      strokeCountRef.current++;

      if (strokeCountRef.current % 6 === 0) {
        checkScratchPercentage();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isDrawingRef.current) {
        isDrawingRef.current = false;
        lastPosRef.current = null;
        checkScratchPercentage();
      }
    };

    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd);
    canvas.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [getCoords, eraseAt, checkScratchPercentage]);

  // Mouse event handlers for desktop
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isRevealedRef.current) return;
    isDrawingRef.current = true;
    const pos = getCoords(e.nativeEvent);
    lastPosRef.current = pos;
    eraseAt(pos.x, pos.y);
    strokeCountRef.current++;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isRevealedRef.current || !isDrawingRef.current) return;
    const pos = getCoords(e.nativeEvent);
    eraseAt(pos.x, pos.y, lastPosRef.current?.x, lastPosRef.current?.y);
    lastPosRef.current = pos;
    strokeCountRef.current++;

    if (strokeCountRef.current % 6 === 0) {
      checkScratchPercentage();
    }
  };

  const handleMouseUp = () => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      lastPosRef.current = null;
      checkScratchPercentage();
    }
  };

  // Window mouseup listener in case cursor leaves canvas
  useEffect(() => {
    const handleWindowMouseUp = () => {
      if (isDrawingRef.current) {
        isDrawingRef.current = false;
        lastPosRef.current = null;
        checkScratchPercentage();
      }
    };
    window.addEventListener("mouseup", handleWindowMouseUp);
    return () => window.removeEventListener("mouseup", handleWindowMouseUp);
  }, [checkScratchPercentage]);

  return (
    <div style={{ width: "100%", position: "relative" }}>
      {/* Scratch Box Container */}
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "100%",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
          boxShadow: isRevealed
            ? "0 4px 20px rgba(255, 71, 126, 0.15)"
            : "0 2px 10px rgba(0, 0, 0, 0.05)",
          transition: "box-shadow 0.3s ease",
        }}
      >
        {/* Hidden secret text underneath */}
        <div
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            color: "var(--text-headline)",
            lineHeight: "1.65",
            padding: "14px 16px",
            borderRadius: "var(--radius-md)",
            background: isRevealed
              ? "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 243, 246, 0.95) 100%)"
              : "rgba(255, 255, 255, 0.92)",
            border: isRevealed
              ? "1.5px solid rgba(255, 71, 126, 0.45)"
              : "1.5px dashed var(--border-glow)",
            textAlign: "center",
            userSelect: isRevealed ? "text" : "none",
            transition: "all 0.35s ease",
          }}
        >
          {children}
        </div>

        {/* Scratchable Canvas Overlay */}
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            cursor: isRevealed ? "default" : "grab",
            touchAction: "none",
            opacity: isRevealed ? 0 : 1,
            pointerEvents: isRevealed ? "none" : "auto",
            transition: "opacity 0.45s ease-out",
            zIndex: 2,
          }}
        />
      </div>

      {/* Progress & helper controls bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          marginTop: "8px",
          padding: "0 4px",
          fontSize: "0.76rem",
        }}
      >
        {!isRevealed ? (
          <>
            <span
              style={{
                color: "var(--text-muted)",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontWeight: 600,
              }}
            >
              <Sparkles size={13} color="var(--color-primary)" />
              {scratchProgress > 0
                ? `Tergosok: ${scratchProgress}%`
                : "Usap kartunya pelan-pelan yaa"}
            </span>
            <button
              type="button"
              onClick={revealAll}
              style={{
                background: "none",
                border: "none",
                color: "var(--color-primary)",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "3px 6px",
                borderRadius: "var(--radius-sm)",
                textDecoration: "underline",
                textUnderlineOffset: "2px",
              }}
            >
              <Eye size={12} /> Buka langsung
            </button>
          </>
        ) : (
          <>
            <span
              style={{
                color: "var(--color-primary-text)",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              ✨ Rahasia terbuka! 💌
            </span>
            <button
              type="button"
              onClick={resetScratch}
              title="Mau coba gosok lagi?"
              style={{
                background: "rgba(255, 71, 126, 0.08)",
                border: "1px solid rgba(255, 71, 126, 0.2)",
                color: "var(--color-primary)",
                fontSize: "0.73rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "3px 10px",
                borderRadius: "var(--radius-full)",
                transition: "all 0.2s ease",
              }}
            >
              <RotateCcw size={11} /> Gosok lagi
            </button>
          </>
        )}
      </div>
    </div>
  );
}
