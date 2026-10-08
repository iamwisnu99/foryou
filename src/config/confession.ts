export interface ConfessionConfig {
  crushName: string;
  crushNickname: string;
  senderName: string;
  whatsappNumber: string;
  waMessage: string;
}

export const confessionConfig: ConfessionConfig = {
  crushName: process.env.NEXT_PUBLIC_CRUSH_NAME || "Ambar",
  crushNickname: process.env.NEXT_PUBLIC_CRUSH_NICKNAME || "Si Paling Imut",
  senderName: process.env.NEXT_PUBLIC_SENDER_NAME || "Wisnu",
  whatsappNumber: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6283863867266").replace(/\D/g, ""),
  waMessage: process.env.NEXT_PUBLIC_WA_MESSAGE || "Wkwk niat banget bikin web Next.js segala! 😂 Tenang, gak ada beruang kok. Makasih ya buat apresiasinya!",
};

export function getWhatsAppUrl(): string {
  const number = confessionConfig.whatsappNumber;
  const text = encodeURIComponent(confessionConfig.waMessage);
  return `https://wa.me/${number}?text=${text}`;
}
