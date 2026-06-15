# Wedding Frontend (Local)

Tampilan undangan Bobby & Krisma — port dari design Lovable.

## Setup

```bash
cd frontend
npm install
cp .env.example .env   # ubah VITE_API_URL bila perlu
npm run dev
```

Buka http://localhost:5173

URL dengan slug & nama tamu:
http://localhost:5173/bobby-krisma?to=Nama+Tamu

## Backend

Pastikan Laravel jalan di http://localhost:8000 dan endpoint berikut tersedia:
- GET  /api/invitations/{slug}
- GET  /api/invitations/{slug}/wishes
- POST /api/invitations/{slug}/rsvp
- POST /api/invitations/{slug}/wishes

Jika BE belum ready, halaman tetap tampil — RSVP/Wishes pakai fallback dummy.
