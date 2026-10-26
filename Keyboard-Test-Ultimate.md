# Keyboard Test Ultimate

Tes keyboard lengkap yang berjalan **100% offline di browser** — tanpa install, tanpa server, tanpa upload data. Cukup buka file HTML-nya.

Versi ini adalah pengembangan dari `Keyboard-Test-v2.html` menjadi versi **Ultimate (v3)** dengan tampilan baru, mode tes tambahan, penyimpanan lokal, dan ekspor hasil.

---

## Daftar Isi

- [Fitur](#fitur)
- [Struktur File](#struktur-file)
- [Cara Pakai](#cara-pakai)
- [Mode Tes](#mode-tes)
  - [1. Tes Tombol](#1-tes-tombol)
  - [2. Ghosting / NKRO](#2-ghosting--nkro)
  - [3. Kecepatan Mengetik](#3-kecepatan-mengetik)
- [Layout & Tombol ISO](#layout--tombol-iso)
- [Toolbar](#toolbar)
- [Penyimpanan Lokal](#penyimpanan-lokal)
- [Format Hasil Ekspor](#format-hasil-ekspor)
- [Tombol yang Tidak Bisa Dibaca](#tombol-yang-tidak-bisa-dibaca)
- [Tips & Troubleshooting](#tips--troubleshooting)
- [Perbandingan v2 vs Ultimate](#perbandingan-v2-vs-ultimate)
- [Teknis](#teknis)
- [Kompatibilitas Browser](#kompatibilitas-browser)

---

## Fitur

| Fitur | Keterangan |
|---|---|
| Tes tombol lengkap | F1–F12, alfanumerik, modifier, navigasi, panah, numpad |
| Status per tombol | Hijau = terdeteksi, kuning = belum terdeteksi |
| Progress bar & statistik | Teruji, progress %, sisa, waktu, total tekan, rekor serentak |
| Heatmap | Intensitas pemakaian tiap tombol berdasarkan jumlah tekan |
| Deteksi ghosting / NKRO | Hitung berapa tombol bisa ditekan bersamaan |
| Tes kecepatan mengetik | WPM, akurasi, karakter, durasi — real-time |
| Suara klik | Nada berbeda untuk tombol modifier |
| Tema terang / gelap | Tersimpan otomatis |
| Pilihan layout | Full-size, TKL, 75%, 60% |
| Dukungan ISO | Tombol tambahan `IntlBackslash` (opsional) |
| Klik kanan tombol | Hapus status satu tombol saja |
| Reset | Hapus semua hasil dan timer |
| Salin hasil | Ringkasan teks ke clipboard |
| Ekspor JSON | Unduh hasil lengkap + hitungan per tombol |
| Penyimpanan lokal | Hasil tes tetap ada setelah halaman ditutup |
| Konfeti | Muncul saat semua tombol berhasil terdeteksi |

---

## Struktur File

```
Keyboard-Test/
├─ Keyboard-Test-Ultimate.html   # struktur halaman
├─ style.css                    # seluruh tampilan / tema
├─ script.js                    # logika tes, ghosting, typing, ekspor
└─ Keyboard-Test-Ultimate.md    # dokumentasi ini
```

Ketiga file `.html`, `.css`, dan `.js` **harus berada di folder yang sama** karena saling terhubung lewat path relatif.

File lama `Keyboard-Test-v2.html` tetap berdiri sendiri (semua kode di dalam satu file) dan tidak terganggu.

---

## Cara Pakai

1. Buka `Keyboard-Test-Ultimate.html` di browser (Chrome, Edge, Firefox, atau Safari terbaru).
2. Klik **MULAI TES**.
3. Klik area halaman sekali agar halaman mendapat fokus (banner atas harus **hijau**).
4. Tekan semua tombol keyboard satu per satu.
5. Klik **Cek yang belum terdeteksi** untuk melihat sisa tombol.
6. Setelah selesai, gunakan **Salin hasil** atau **Ekspor JSON** bila perlu.

> Tombol yang sudah terdeteksi akan berbingkai hijau. Tombol yang belum dicek akan berkedip kuning setelah menekan tombol **Cek**.

---

## Mode Tes

### 1. Tes Tombol

Mode utama. Setiap `keydown` akan:

- Menandai tombol sebagai terdeteksi (`done`).
- Menambah hitungan tekan (dipakai untuk heatmap).
- Menampilkan info di baris **live**: `key`, `code`, `keyCode`, lokasi fisik, dan modifier aktif.
- Mencatat ke log (100 entri terakhir) lengkap dengan waktu.
- Membunyikan klik (jika suara aktif).
- Memperbarui statistik dan progress bar.
- Menjalankan timer saat tombol pertama ditekan.
- Memunculkan konfeti saat 100% tombol terdeteksi.

**Klik kanan** pada tombol mana pun untuk menghapus status tombol tersebut saja (berguna jika tombol tertekan tidak sengaja).

### 2. Ghosting / NKRO

Mengukur berapa banyak tombol yang bisa terbaca **bersamaan**:

- Angka besar = jumlah tombol yang sedang ditahan.
- Chip di bawahnya = daftar tombol yang sedang aktif.
- **Rekor serentak** = jumlah maksimum yang pernah tercapai.
- **Total event** = jumlah keydown yang tercatat.

Cara uji:

1. Buka tab **Ghosting / NKRO**.
2. Tahan kombinasi seperti `W + A + S + D + Shift + Space`.
3. Perhatikan apakah semua tombol muncul di chip.

Jika angka macet di 2–3 atau ada tombol yang hilang, keyboard mungkin memiliki keterbatasan **rollover/ghosting**. Namun perlu diingat: browser juga punya batas praktis, jadi hasil rendah belum tentu kerusakan hardware.

### 3. Kecepatan Mengetik

- Paragraf acuan ditampilkan dan diwarnai per karakter:
  - **Hijau** = benar.
  - **Merah** = salah.
  - **Sorot biru** = posisi kursor saat ini.
- Statistik real-time: **WPM**, **akurasi**, **jumlah karakter**, dan **waktu**.
- Rumus WPM: `(karakter benar / 5) / menit`.
- Tombol **Ulangi** untuk mengulang dari awal.

---

## Layout & Tombol ISO

Pilih layout di toolbar:

| Pilihan | Blok yang ditampilkan |
|---|---|
| **Full-size** | F-row + utama + navigasi + numpad |
| **TKL** | F-row + utama + navigasi (tanpa numpad) |
| **75%** | F-row + utama (tanpa navigasi & numpad) |
| **60%** | Blok utama saja (Esc tetap tampil) |

Centang **ISO** untuk memunculkan tombol tambahan `IntlBackslash` (tombol `\` di kiri `Z` pada keyboard layout ISO). Tombol ini tidak dihitung saat ISO nonaktif.

> Setelah mengganti layout, total tombol dan progress dihitung ulang. Status tombol yang sudah terdeteksi tetap tersimpan.

---

## Toolbar

| Tombol | Fungsi |
|---|---|
| **Layout** | Ganti cakupan blok keyboard |
| **ISO** | Tampilkan/sembunyikan tombol tambahan ISO |
| **Suara: ON/OFF** | Aktifkan suara klik (Web Audio API) |
| **Tema: Gelap/Terang** | Ganti tema, tersimpan otomatis |
| **Heatmap: ON/OFF** | Warna hijau makin pekat = makin sering ditekan |

Semua pengaturan toolbar disimpan di `localStorage`.

---

## Penyimpanan Lokal

Data disimpan di `localStorage` dengan kunci:

```
kbTestUltimateV1
```

Data yang disimpan:

- Daftar tombol yang sudah terdeteksi
- Jumlah tekan per tombol (untuk heatmap)
- Layout, status ISO, suara, heatmap, tema
- Rekor rollover dan total event

Data **tidak pernah** dikirim ke internet. Semua berjalan di perangkat kamu.

Klik **Reset** untuk menghapus semuanya (termasuk data lokal).

---

## Format Hasil Ekspor

Tombol **Ekspor JSON** mengunduh file seperti:

```json
{
  "app": "Keyboard Test Ultimate",
  "version": 3,
  "generatedAt": "2026-10-25T12:34:56.789Z",
  "layout": "full",
  "iso": false,
  "durationMs": 92340,
  "maxRollover": 6,
  "totalPresses": 214,
  "detected": ["Escape", "F1", "F2", "..."],
  "missing": ["Pause", "..."],
  "counts": {
    "KeyA": 12,
    "Space": 48
  }
}
```

Nama file: `keyboard-test-YYYY-MM-DDTHH-MM-SS-sssZ.json`.

Tombol **Salin hasil** menghasilkan ringkasan teks yang lebih mudah ditempel di chat/issue.

---

## Tombol yang Tidak Bisa Dibaca

Tombol berikut **tidak** bisa ditangkap `keydown` karena dipakai sistem operasi / browser, sehingga dikecualikan dari hitungan:

- `MetaLeft` / `MetaRight` (**Win** / **Command**)
- `PrintScreen`
- `ScrollLock`
- `Pause`
- `ContextMenu` (**Menu**)

Catatan tambahan:

- `F11` dan `F5` bisa memicu aksi browser pada sebagian browser meskipun sudah dicegah.
- Kombinasi `Ctrl`/`Cmd` + huruf diteruskan ke browser agar shortcut seperti copy/paste dan reload tetap berfungsi.
- `Alt` + `Tab`, `Alt` + `F4`, dan sejenisnya adalah shortcut OS yang tidak bisa dicegah oleh halaman web.

---

## Tips & Troubleshooting

**Tombol tidak terbaca sama sekali**
- Klik dulu area halaman. Banner atas harus hijau, bukan merah.
- Pastikan fokus tidak berada di kolom teks atau dropdown.
- Coba tekan tombol biasa seperti `A` untuk memastikan halaman aktif.

**Banner berubah merah**
- Halaman kehilangan fokus (mis. kamu pindah aplikasi). Klik halaman lagi.

**Beberapa tombol selalu "belum terdeteksi"**
- Bisa jadi tombol memang rusak, atau termasuk tombol sistem yang dikecualikan.
- Coba cek dengan `keyCode`/`code` di log untuk memastikan sinyal masuk.

**Hasil tes lama mengganggu**
- Klik **Reset**, atau hapus data situs lewat pengaturan browser.

**Heatmap tidak terlihat**
- Pastikan **Heatmap: ON** dan sudah ada tombol yang ditekan lebih dari sekali.

**Suara tidak muncul**
- Browser memblokir audio sebelum ada interaksi pengguna. Klik **MULAI TES** dulu, lalu nyalakan suara.

**Ingin mulai dari nol**
- Klik **Reset**. Timer, log, status tombol, dan rekor akan dihapus.

---

## Perbandingan v2 vs Ultimate

| Aspek | v2 | Ultimate |
|---|---|---|
| File | 1 file HTML | HTML + CSS + JS + MD |
| Tampilan | Dasar | Panel statistik, progress bar, tema terang/gelap |
| Mode tes | Tes tombol saja | Tes tombol + ghosting/NKRO + typing |
| Layout | Full-size | Full, TKL, 75%, 60% + ISO |
| Feedback | Warna tombol | Warna + suara + heatmap + konfeti |
| Statistik | Teruji/belum | + progress %, waktu, total tekan, rollover |
| Hasil | Salin teks | Salin teks + ekspor JSON |
| Reset | Semua | Semua + reset per tombol (klik kanan) |
| Penyimpanan | Tidak ada | localStorage otomatis |
| Timer | Tidak ada | Ada, mulai saat tombol pertama |

---

## Teknis

- **Vanilla JavaScript** (ES6+), tanpa framework dan tanpa dependensi.
- **Web Audio API** untuk suara klik.
- **Canvas 2D** untuk animasi konfeti.
- **localStorage** untuk persistensi.
- **Clipboard API** dengan fallback `document.execCommand('copy')`.
- **Blob + Object URL** untuk unduhan JSON.
- Deteksi tombol memakai `KeyboardEvent.code` (posisi fisik tombol), bukan `key`, sehingga akurat untuk layout apa pun.
- Event listener `keydown`/`keyup` dipasang dengan `capture: true` agar didahulukan.
- Timer memakai `setInterval` 250 ms dengan perhitungan berbasis `Date.now()`.

### Id elemen penting

| Id | Fungsi |
|---|---|
| `kbd` | Wadah keyboard |
| `sDone`, `sPct`, `sMiss`, `sTime`, `sPress`, `sRoll` | Kartu statistik |
| `bar` | Progress bar |
| `live` | Info tombol terakhir |
| `log` | Log event |
| `gNow`, `gMax`, `gEvents`, `gChips` | Panel ghosting |
| `typePrompt`, `typeInput`, `tWpm`, `tAcc`, `tChar`, `tTime` | Panel typing |
| `layoutSel`, `isoChk`, `soundBtn`, `themeBtn`, `heatBtn` | Toolbar |
| `check`, `copy`, `export`, `reset` | Aksi tes tombol |
| `toast`, `confetti`, `overlay` | Feedback & intro |

---

## Kompatibilitas Browser

| Browser | Status |
|---|---|
| Chrome / Edge (Chromium) | ✅ Didukung penuh |
| Firefox | ✅ Didukung penuh |
| Safari 14+ | ✅ Umumnya didukung |
| Browser mobile | ⚠️ Sebagian (keyboard fisik/eksternal lebih ideal) |

Fitur yang bergantung pada dukungan browser:

- `navigator.clipboard` — jika tidak tersedia, otomatis memakai fallback.
- `color-mix()` di CSS — pada browser lama warna aksen mungkin tampil berbeda.
- Web Audio API — butuh interaksi pengguna sebelum berbunyi.

---

## Lisensi

Bebas dipakai, dimodifikasi, dan dibagikan untuk keperluan pribadi maupun internal.

---

Dibuat untuk diagnosa keyboard harian. Hasil tes tidak menggantikan alat ukur hardware profesional.
