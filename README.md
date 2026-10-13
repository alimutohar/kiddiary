# KidDiary 1.0.0 — Turso

Aplikasi keluarga dan kelas, bukan platform Stakku. Next.js, Better Auth, Turso libSQL, Tailwind. R2 tidak diperlukan pada versi ini.

1. Ekstrak paket dan buka folder di Antigravity.
2. Jalankan npm install. Salin .env.local.example ke .env.local. Buat database Turso milik Anda dan isi URL/token hanya di server.
3. Buat BETTER_AUTH_SECRET secara acak (node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"). Atur URL aplikasi.
4. Jalankan npm run db:push. Jangan arahkan script ini ke database portal Stakku atau milik orang lain.
5. Jalankan npm run build lalu npm run start. Buka /activate dan isi lisensi KidDiary. Hostname harus sama persis; localhost juga membutuhkan lisensi pengujian.
6. Setelah aktivasi berhasil, buat akun aplikasi di /register. Akun KidDiary terpisah dari akun portal pembelian.
7. Uji profil anak, catat aktivitas, muat ulang, hadiah keluarga dan kelas. Ruang milik akun lain tidak dapat dibaca/diubah. Hadiah hanya untuk ruang keluarga.
8. Klon https://github.com/alimutohar/kiddiary atau gunakan tombol Klon & Deploy di portal. Isi environment yang sama; ubah BETTER_AUTH_URL dan NEXT_PUBLIC_APP_URL ke URL produksi. Build otomatis menyiapkan schema Turso secara idempotent. Gunakan database KidDiary khusus milik Anda, bukan database portal Stakku.
9. Buka aplikasi produksi, masukkan lisensi. Maksimal tiga domain aktif per lisensi. Domain aktif terlihat di app.stakku.id/dashboard.

Kredensial/key tidak boleh masuk Git. Jangan mengunggah .env, database, data anak, node_modules atau .next. Laporan diekspor dari aplikasi; tidak ada upload media R2 pada versi ini. Biaya mengikuti paket layanan Anda.

Migrasi data legacy memerlukan ekspor terverifikasi terpisah; paket tidak menyertakan data Turso lama atau passwordnya. Dukungan: stakku.app@gmail.com.

Source dapat dibaca publik. Publikasi source tidak memberikan lisensi pemakaian gratis: aplikasi hasil deploy tetap memerlukan lisensi KidDiary aktif dan terikat hostname. Jangan menghapus pemeriksaan lisensi.
