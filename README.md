# NOVA BOOST — Mobile Legends Service Website

Website jasa layanan Mobile Legends berbasis HTML, CSS, dan JavaScript murni. Siap diunggah ke GitHub dan di-deploy melalui Vercel sebagai static site.

## Fitur

- Desain futuristic monokrom hitam, putih, dan abu-abu.
- Responsif untuk ponsel, tablet, dan desktop.
- Katalog layanan: Rank Boost, Win Rate Boost, dan Custom Request.
- Form checkout dan ringkasan pesanan.
- Kalkulasi estimasi harga otomatis.
- Review pesanan sebelum diarahkan ke WhatsApp.
- Pesan WhatsApp otomatis dengan detail pesanan.
- Tidak membutuhkan framework, database, atau build command.

## Struktur file

```text
joki-ml-website/
├── index.html
├── style.css
├── script.js
├── README.md
└── .gitignore
```

## Konfigurasi

Buka `script.js`, lalu ubah objek `CONFIG` di bagian atas:

```javascript
const CONFIG = {
  brand: "NOVA BOOST",
  whatsappAdmin: "6287790193050",
  prices: {
    rank: 15000,
    wr: 10000,
    custom: 0
  },
  currency: "IDR",
  locale: "id-ID"
};
```

- `brand`: nama brand website.
- `whatsappAdmin`: nomor WhatsApp admin dalam format internasional, tanpa tanda `+`, spasi, atau strip. Contoh Indonesia: `62812xxxxxxxx`.
- `prices.rank`: harga estimasi per bintang.
- `prices.wr`: harga estimasi per match.
- `prices.custom`: custom request diarahkan untuk konfirmasi admin.

Harga pada website adalah estimasi awal. Pastikan harga final dikonfirmasi dengan pelanggan sebelum menerima pesanan.

## Menjalankan secara lokal

Tidak perlu instalasi dependency. Buka `index.html` langsung di browser, atau jalankan server lokal dari folder proyek:

```bash
python -m http.server 8080
```

Kemudian buka `http://127.0.0.1:8080`.

## Upload manual ke GitHub

1. Buat repository baru di GitHub, misalnya `joki-ml-website`.
2. Pilih **Public** atau **Private** sesuai kebutuhan.
3. Upload lima file proyek ini ke root repository.
4. Pastikan `index.html` berada di root, bukan di dalam subfolder lain.
5. Commit perubahan.

## Deploy ke Vercel

1. Login ke [Vercel](https://vercel.com/) dengan akun GitHub.
2. Pilih **Add New → Project**.
3. Import repository `joki-ml-website`.
4. Framework Preset: **Other**.
5. Root Directory: `./`.
6. Build Command: kosongkan.
7. Output Directory: kosongkan.
8. Klik **Deploy**.

Vercel akan menyajikan `index.html` sebagai static website. Push/commit baru ke branch yang terhubung akan memicu deployment baru.

## Catatan penting

- Checkout versi ini menyiapkan pesan dan mengarahkan pengguna ke WhatsApp admin. Website tidak memproses pembayaran otomatis.
- Website tidak memiliki backend/database dan tidak menyimpan order di server.
- Jangan meminta pelanggan memasukkan password atau OTP melalui formulir. Hindari menyimpan informasi sensitif akun.
- Tambahkan kebijakan privasi, syarat layanan, dan informasi kontak yang benar sebelum website dipublikasikan.
- Website ini merupakan layanan independen dan tidak berafiliasi dengan MOONTON Games atau Mobile Legends: Bang Bang.
