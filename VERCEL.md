# Deploy JobSync ke Vercel

Fork ini sudah disiapkan untuk Vercel:

- `npm run vercel-build` (dipakai otomatis oleh Vercel) menjalankan
  `prisma generate`, `prisma migrate deploy`, lalu `next build`.
- `output: "standalone"` hanya dipakai untuk Docker, dan dimatikan di Vercel.
- Scheduler cron di dalam proses server dimatikan di Vercel (fungsi serverless
  tidak berjalan terus).
- File upload ditulis ke `/tmp/jobsync-data` di Vercel (folder sementara).

## 1. Siapkan database Postgres

Pilih salah satu:

- **Vercel → Storage → Create Database → Neon (Postgres)**, lalu hubungkan ke
  project. `DATABASE_URL` akan terisi otomatis.
- Atau buat database gratis di [neon.tech](https://neon.tech) /
  [supabase.com](https://supabase.com), lalu salin connection string-nya.

> Pakai connection string yang **pooled** (Neon: host berisi `-pooler`,
> Supabase: port `6543` + `?pgbouncer=true`). Kalau `prisma migrate deploy`
> gagal saat build karena pooler, sementara pakai URL **direct** (non-pooled).

## 2. Import project di Vercel

1. Buka <https://vercel.com/new>, lalu import repo `nathanaellbc/jobsync`.
2. Framework: **Next.js** (terdeteksi otomatis). Build command biarkan default
   (Vercel akan menjalankan `vercel-build`).
3. Isi **Environment Variables**:

| Variable | Wajib | Isi |
| --- | --- | --- |
| `DATABASE_URL` | ya | Connection string Postgres |
| `AUTH_SECRET` | ya | Hasil `openssl rand -base64 32` |
| `ENCRYPTION_KEY` | ya | Hasil `openssl rand -base64 32` (jangan diganti setelahnya) |
| `AUTH_TRUST_HOST` | ya | `true` |
| `NEXTAUTH_URL` | disarankan | URL app, mis. `https://jobsync-xxx.vercel.app` |
| `TZ` | opsional | mis. `Asia/Jakarta` |
| `OPENAI_API_KEY` / `GEMINI_API_KEY` / `DEEPSEEK_API_KEY` / `OPENROUTER_API_KEY` | opsional | Untuk fitur AI (bisa juga diisi lewat Settings di app) |

4. Klik **Deploy**. Setelah selesai, buka URL-nya dan daftar akun di `/signup`.

## Batasan di Vercel

- **Upload resume dan backup tidak permanen**: `/tmp` di Vercel bisa hilang
  kapan saja. Data di database (lamaran, tugas, profil, dll.) tetap aman.
- **Automasi terjadwal tidak jalan otomatis**. Menjalankannya manual dari UI
  tetap bisa, tapi dibatasi oleh timeout fungsi Vercel.
- **Ollama** (LLM lokal) tidak bisa dipakai kecuali server Ollama-mu bisa
  diakses publik lewat `OLLAMA_BASE_URL`.

Kalau butuh fitur-fitur di atas, pakai Docker (`docker compose up`) di VPS.

## Update dari repo asli

Di GitHub, buka fork-mu lalu klik **Sync fork**. Vercel akan deploy ulang
otomatis.
