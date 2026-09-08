# 🎰 CASINO GAME ROOM — LEGEND STORY
### Real-Time Classroom Multiplayer Reading Game Arena

A clean, modern, real-time online & offline multiplayer classroom casino game room designed for Senior High School English Legend Story reading comprehension activities.

---

## 🌟 Fitur Utama & Pembaruan Terbaru

1. **🔐 Keamanan Mode Guru (PIN: `3110`)**:
   - Layar Mode Guru dilindungi dengan PIN 4 digit (**`3110`**).
   - Dilengkapi keypad interaktif dan proteksi sesi agar siswa tidak dapat mengubah kontrol dari proyektor.
   - Tombol **🔒 Lock** di header untuk mengunci layar sewaktu-waktu.

2. **✏️ Edit Nama Group Manual**:
   - **Mode Guru**: Guru dapat mengedit nama ke-5 kelompok langsung melalui tombol ✏️ di tabel scoreboard.
   - **Mode Siswa**: Siswa dapat mengedit nama kelompok mereka sendiri (misal: "Team Garuda", "The Legends") melalui tombol ✏️ di dashboard HP mereka.
   - Perubahan nama tersinkronisasi secara langsung (*real-time*) ke seluruh layar.

3. **💾 Penyimpanan Data Otomatis & Persisten (Persistent Storage)**:
   - Data poin kelompok, ronde aktif, status taruhan, dan cerita legenda **tidak akan hilang** meskipun browser ditutup, di-refresh, atau laptop mati (*Auto-Restore*).

4. **⚡ Dual Real-Time Sync (Online Cloud & Offline LAN)**:
   - **Online Cloud Sync (GitHub Pages / Internet)**: Menggunakan protokol MQTT WebSocket berlatensi rendah (<100ms) tanpa perlu sewa server backend.
   - **Offline / Local Fallback**: Menggunakan browser `BroadcastChannel` dan `localStorage` jika tidak ada koneksi internet.

5. **☑️ Dukungan Pilihan Ganda Kompleks (MCMA)**:
   - Siswa dapat memilih lebih dari 1 opsi jawaban benar ($A, B, C, D, E$).
   - Guru dapat memilih kombinasi kunci jawaban dengan tombol *Auto-Fill Preset*.

---

## 🚀 Cara Menghosting di GitHub Saya (GitHub Pages)

Proyek ini telah disiapkan agar **100% siap di-upload ke GitHub** dan langsung aktif melalui **GitHub Pages**:

### Langkah Upload ke GitHub:
1. Buat repository baru di akun GitHub Anda (misal: `casino-legend-game`).
2. Masuk ke folder `PLAY CASSINO NOW` di terminal / Git Bash:
   ```bash
   cd "PLAY CASSINO NOW"
   git init
   git add .
   git commit -m "feat: Casino Game Room Legend Story with Online Sync & PIN Security"
   git branch -M main
   git remote add origin https://github.com/<USERNAME-GITHUB-ANDA>/casino-legend-game.git
   git push -u origin main
   ```
3. **Aktifkan GitHub Pages**:
   - Buka halaman repository di GitHub -> **Settings** -> **Pages**.
   - Pada bagian **Build and deployment** -> **Branch**, pilih `main` dan folder `/ (root)`, lalu klik **Save**.
4. Dalam 1–2 menit, web game Anda akan aktif di:
   - 🌐 **Link Lobby**: `https://<USERNAME-GITHUB-ANDA>.github.io/casino-legend-game/`
   - 👨‍🏫 **Link Guru**: `https://<USERNAME-GITHUB-ANDA>.github.io/casino-legend-game/teacher.html` (PIN: `3110`)
   - 📱 **Link Siswa**: `https://<USERNAME-GITHUB-ANDA>.github.io/casino-legend-game/student.html`

---

## 💻 Cara Menjalankan Secara Offline / Lokal

- **Cukup buka file di browser**: Buka `index.html`, `teacher.html`, atau `student.html` di browser Anda (Chrome, Edge, Safari, Firefox).
- Atau jalankan dengan Node.js:
  ```bash
  npm install
  npm start
  ```
  Akses di `http://localhost:3000`.

---

## 📁 Struktur Folder
```text
PLAY CASSINO NOW/
 ├── index.html               # Halaman Utama / Lobby Room
 ├── teacher.html             # Dashboard Guru (PIN: 3110)
 ├── student.html             # Dashboard HP Siswa (Group 1 - 5)
 ├── css/
 │    └── casino-theme.css    # Tema Kasino Mewah, Chip & Animasi
 ├── js/
 │    ├── audio-fx.js         # Sound Synthesizer Web Audio
 │    ├── questions-data.js   # Bank Soal Lutung Kasarung & Black Sea (MCMA)
 │    └── realtime-sync.js    # Engine Sinkronisasi Online & Offline
 ├── package.json             # Konfigurasi Node.js
 ├── server.js                # Server opsional Express + Socket.IO
 └── README.md                # Panduan Lengkap
```

