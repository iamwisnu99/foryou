import { NextResponse } from "next/server";
import { confessionConfig } from "@/config/confession";

export interface ChatMessage {
  id: string;
  text: string;
  sender: "crush" | "wisnu";
  timestamp: number;
}

// Global server in-memory store for session continuity (fallback across requests)
declare global {
  // eslint-disable-next-line no-var
  var __FORYOU_CHAT_STORE__: ChatMessage[] | undefined;
  // eslint-disable-next-line no-var
  var __FORYOU_LAST_UPDATE_ID__: number | undefined;
}

if (!global.__FORYOU_CHAT_STORE__) {
  global.__FORYOU_CHAT_STORE__ = [];
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ success: false, error: "Pesan tidak boleh kosong" }, { status: 400 });
    }

    const crushName = confessionConfig.crushName || "Ambar";
    const senderName = confessionConfig.senderName || "Wisnu";
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const now = new Date();
    const timeFormatted = now.toLocaleTimeString("id-ID", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
    });

    const newMsg: ChatMessage = {
      id: `crush_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      text: text.trim(),
      sender: "crush",
      timestamp: Date.now(),
    };

    // Store in global history
    if (!global.__FORYOU_CHAT_STORE__) global.__FORYOU_CHAT_STORE__ = [];
    global.__FORYOU_CHAT_STORE__.push(newMsg);

    // Keep store capped at 100 messages
    if (global.__FORYOU_CHAT_STORE__.length > 100) {
      global.__FORYOU_CHAT_STORE__ = global.__FORYOU_CHAT_STORE__.slice(-100);
    }

    // Send to Telegram if credentials exist
    if (botToken && chatId) {
      const telegramMessage =
        `💬 *PESAN CHAT DARI ${crushName.toUpperCase()}!* 💌\n\n` +
        `"${text.trim()}"\n\n` +
        `⏰ *Waktu:* ${timeFormatted} WIB\n` +
        `━━━━━━━━━━━━━━━━━━━━━\n` +
        `💡 *Tips:* Ketik balasanmu di chat ini untuk membalas langsung ke website ${crushName}! ✨`;

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: telegramMessage,
          parse_mode: "Markdown",
        }),
      });
    } else {
      console.warn("[Chat API] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set.");
    }

    return NextResponse.json({
      success: true,
      message: newMsg,
    });
  } catch (error: any) {
    console.error("[Chat Send Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal mengirim pesan" },
      { status: 500 }
    );
  }
}
