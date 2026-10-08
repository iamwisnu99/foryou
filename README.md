# 💌 FORYOU - Website Ungkapan Perasaan

Website interaktif mobile-first untuk menyampaikan pesan dan ungkapan perasaan secara tulus, personal, dan tanpa tekanan, dibangun menggunakan Next.js 16, TypeScript, Framer Motion, dan Modern CSS.

---

## 🔒 Konfigurasi Data Pribadi

Seluruh informasi personal seperti nama dan nomor WhatsApp dikelola melalui file `.env.local`. File ini secara otomatis diabaikan oleh git (`.gitignore`) demi menjaga privasi data.

Buka file [`.env.local`](.env.local) dan sesuaikan variabel berikut:

```env
# Nama target
NEXT_PUBLIC_CRUSH_NAME="Ambar"

# Panggilan akrab
NEXT_PUBLIC_CRUSH_NICKNAME="Si Imut"

# Nama pengirim
NEXT_PUBLIC_SENDER_NAME="Wisnu"

# Nomor WhatsApp pengirim (format: 62xxx tanpa tanda +)
NEXT_PUBLIC_WHATSAPP_NUMBER="6283863867266"

# Template pesan WhatsApp default
NEXT_PUBLIC_WA_MESSAGE="Wkwk niat banget bikin web Next.js segala! Tenang, gak ada beruang kok. Makasih ya buat apresiasinya!"
```

---

## 💻 Cara Menjalankan di Lingkungan Lokal

1. Pasang seluruh dependensi proyek:
   ```bash
   npm install
   ```

2. Jalankan development server:
   ```bash
   npm run dev
   ```

3. Akses aplikasi melalui peramban web:
   - Akses dari komputer lokal: [http://localhost:3000](http://localhost:3000)
   - Akses dari smartphone dalam jaringan Wi-Fi yang sama: **`http://192.168.1.24:3000`**

---

## 🌐 Panduan Publikasi ke Internet (Vercel)

Untuk membagikan tautan publik langsung kepada target, platform Vercel dapat digunakan secara gratis.

### ⚡ Melalui Vercel CLI
1. Jalankan perintah instalasi dan deployment:
   ```bash
   npx vercel
   ```
2. Ikuti proses autentikasi akun.
3. Saat konfirmasi *Link to existing project?*, tentukan pilihan `N`.
4. Masukkan nama project sesuai kebutuhan.
5. Konfigurasikan Environment Variables pada menu **Project Settings -> Environment Variables** sesuai isi file `.env.local`.

### 📦 Melalui GitHub dan Dasbor Vercel
1. Unggah repositori ke GitHub dalam mode repositori privat.
2. Buka platform Vercel dan pilih **Add New Project**.
3. Hubungkan repositori GitHub yang bersangkutan.
4. Masukkan variabel lingkungan dari `.env.local` pada bagian **Environment Variables**.
5. Pilih **Deploy** untuk memulai proses kompilasi dan peluncuran situs.
