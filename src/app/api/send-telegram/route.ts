import { NextResponse } from "next/server";

interface QuestionAnswer {
  questionId: number;
  questionTitle: string;
  selectedOption: string;
}

interface TelegramPayload {
  crushName?: string;
  senderName?: string;
  answers: QuestionAnswer[];
  note?: string;
}

export async function POST(req: Request) {
  try {
    const body: TelegramPayload = await req.json();
    const { crushName = "Ambar", senderName = "Wisnu", answers = [], note = "" } = body;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // Format current timestamp (WIB)
    const now = new Date();
    const dateFormatted = now.toLocaleDateString("id-ID", {
      timeZone: "Asia/Jakarta",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    const timeFormatted = now.toLocaleTimeString("id-ID", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Build the Telegram message text
    let message = `💌 *JAWABAN KUIS UNGKAPAN HATI!* 💌\n\n`;
    message += `👤 *Dari:* ${crushName}\n`;
    message += `🎯 *Untuk:* ${senderName}\n`;
    message += `⏰ *Waktu:* ${dateFormatted}, ${timeFormatted} WIB\n\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

    answers.forEach((ans, index) => {
      message += `*${index + 1}. ${ans.questionTitle}*\n`;
      message += `👉 *Jawaban:* \`${ans.selectedOption}\`\n\n`;
    });

    if (note && note.trim().length > 0) {
      message += `💬 *Pesan Tambahan:* \n_"${note.trim()}"_\n\n`;
    } else {
      message += `💬 *Pesan Tambahan:* _(Tidak ada pesan tambahan)_\n\n`;
    }

    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `✨ *Status:* Dikirim otomatis dari website FORYOU ❤️`;

    // If bot token or chat ID is missing, log gracefully (for dev/preview without crashing)
    if (!botToken || !chatId) {
      console.warn(
        "[Telegram Bot Alert] TELEGRAM_BOT_TOKEN atau TELEGRAM_CHAT_ID belum diset di .env.local!\n" +
        "Pesan yang akan dikirim:\n" + message
      );
      return NextResponse.json({
        success: true,
        simulated: true,
        message: "Bot token belum dikonfigurasi di environment, respons berhasil disimulasikan.",
      });
    }

    // Send to Telegram Bot API
    const telegramRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    const telegramData = await telegramRes.json();

    if (!telegramRes.ok || !telegramData.ok) {
      console.error("[Telegram Bot API Error]:", telegramData);
      return NextResponse.json(
        {
          success: false,
          error: telegramData.description || "Gagal mengirim pesan ke Telegram",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Jawaban berhasil dikirim ke Telegram!",
    });
  } catch (error: any) {
    console.error("[send-telegram error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
