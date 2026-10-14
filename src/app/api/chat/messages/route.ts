import { NextResponse } from "next/server";
import { ChatMessage } from "../send/route";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const since = Number(searchParams.get("since") || 0);

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!global.__FORYOU_CHAT_STORE__) {
      global.__FORYOU_CHAT_STORE__ = [];
    }

    // If Telegram credentials exist, fetch any replies from Wisnu
    if (botToken && chatId) {
      try {
        const offsetParam = global.__FORYOU_LAST_UPDATE_ID__
          ? `?offset=${global.__FORYOU_LAST_UPDATE_ID__ + 1}&limit=20`
          : `?limit=20`;

        const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates${offsetParam}`, {
          cache: "no-store",
        });

        const tgData = await tgRes.json();

        if (tgData.ok && Array.isArray(tgData.result)) {
          let maxUpdateId = global.__FORYOU_LAST_UPDATE_ID__ || 0;

          for (const update of tgData.result) {
            if (update.update_id > maxUpdateId) {
              maxUpdateId = update.update_id;
            }

            const msg = update.message;
            if (!msg || !msg.text) continue;

            // Check if message is from Wisnu (matching TELEGRAM_CHAT_ID)
            const fromId = String(msg.from?.id || "");
            const targetChatId = String(chatId);

            if (fromId === targetChatId && !msg.from?.is_bot) {
              const text = msg.text.trim();

              // Ignore bot control commands
              if (text.startsWith("/start") || text.startsWith("/help")) {
                continue;
              }

              const msgId = `tg_${msg.message_id}`;
              const exists = global.__FORYOU_CHAT_STORE__.some((m) => m.id === msgId);

              if (!exists) {
                const wisnuMsg: ChatMessage = {
                  id: msgId,
                  text: text,
                  sender: "wisnu",
                  timestamp: (msg.date || Math.floor(Date.now() / 1000)) * 1000,
                };
                global.__FORYOU_CHAT_STORE__.push(wisnuMsg);
              }
            }
          }

          if (maxUpdateId > (global.__FORYOU_LAST_UPDATE_ID__ || 0)) {
            global.__FORYOU_LAST_UPDATE_ID__ = maxUpdateId;
          }
        }
      } catch (tgErr) {
        console.warn("[Telegram getUpdates Polling Error]:", tgErr);
      }
    }

    // Sort messages by timestamp
    const allMessages = [...global.__FORYOU_CHAT_STORE__].sort((a, b) => a.timestamp - b.timestamp);

    const filtered = since > 0 ? allMessages.filter((m) => m.timestamp > since) : allMessages;

    return NextResponse.json({
      success: true,
      messages: filtered,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED" || error?.message?.includes("bail out of prerendering")) {
      throw error;
    }
    console.error("[Chat Messages Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal mengambil pesan" },
      { status: 500 }
    );
  }
}
