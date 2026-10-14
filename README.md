# KidDiary 1.0.0 — Turso

Aplikasi keluarga dan kelas, bukan platform Stakku. Next.js, Better Auth, Turso libSQL, Tailwind. R2 tidak diperlukan pada versi ini.

1. Ekstrak paket dan buka folder di Antigravity.
2. Jalankan npm install. Salin .env.local.example ke .env.local. Buat database Turso milik Anda dan isi URL/token hanya di server.
3. Buat BETTER_AUTH_SECRET secara acak (node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"). Atur URL aplikasi.
4. Jalankan npm run db:push. Jangan arahkan script ini ke database portal Stakku atau milik orang lain.
5. Jalankan npm run build lalu npm run start. Buka /activate dan isi lisensi KidDiary. Hostname harus sama persis; localhost juga membutuhkan lisensi pengujian.
6. Setelah aktivasi berhasil, buat akun aplikasi di /register. Pemilik instalasi harus menggunakan email yang sama dengan pembelian untuk pemulihan melalui portal. Akun KidDiary terpisah dari akun portal pembelian; pilih password sendiri.
7. Uji profil anak, catat aktivitas, muat ulang, hadiah keluarga dan kelas. Ruang milik akun lain tidak dapat dibaca/diubah. Hadiah hanya untuk ruang keluarga.
8. Jalur utama tanpa GitHub pembeli: buka folder paket di Antigravity, login Vercel CLI dengan akun Anda, isi environment server di Vercel lalu deploy folder melalui Vercel CLI. Atur BETTER_AUTH_URL dan NEXT_PUBLIC_APP_URL ke hostname produksi. Build otomatis menyiapkan skema Turso khusus milik Anda. Jangan memakai database portal Stakku. Menyalin repository ke GitHub sendiri tetap pilihan tambahan, bukan syarat deploy.
9. Buka aplikasi produksi, masukkan lisensi. Maksimal tiga domain aktif per lisensi. Domain aktif terlihat di app.stakku.id/dashboard.

Kredensial/key tidak boleh masuk Git. Jangan mengunggah .env, database, data anak, node_modules atau .next. Laporan diekspor dari aplikasi; tidak ada upload media R2 pada versi ini. Biaya mengikuti paket layanan Anda.

Migrasi data legacy memerlukan ekspor terverifikasi terpisah; paket tidak menyertakan data Turso lama atau passwordnya. Dukungan: stakku.app@gmail.com.

Source dapat dibaca publik. Publikasi source tidak memberikan lisensi pemakaian gratis: aplikasi hasil deploy tetap memerlukan lisensi KidDiary aktif dan terikat hostname. Jangan menghapus pemeriksaan lisensi.

## Pemulihan akun pemilik tanpa Resend pembeli

Masuk ulang ke app.stakku.id dengan email pembelian → Setup produk → Pulihkan akun pemilik → pilih domain aktif → buat kode. Dalam lima menit, buka /recover-owner pada aplikasi yang dipilih dan masukkan kode beserta password baru 12–128 karakter. Kode sekali pakai; kode baru menggantikan kode sebelumnya. Password baru diproses Better Auth pada server aplikasi dan tidak dikirim ke Stakku. Semua sesi akun tersebut dicabut setelah berhasil; login kembali.

Hanya akun aplikasi dengan email pemilik lisensi terverifikasi yang dapat dipulihkan. Email pemilik aplikasi harus sama dengan email pembelian. Lisensi/domain harus tetap aktif; kunci lisensi saja bukan kode reset. Tidak dapat mereset akun lain, tidak ada password bawaan, dan tidak perlu key Resend pembeli. Jika akun dengan email pembelian belum dibuat, buat akun tersebut dahulu; kode yang sudah dicoba mungkin perlu dibuat ulang. Gunakan paket terbaru yang mendukung halaman /recover-owner.

Simpan folder kerja serta backup Turso. Jalur tanpa Git tidak memberi auto-deploy saat source Stakku berubah: tinjau rilis baru di https://github.com/alimutohar/kiddiary lalu deploy ulang secara sadar. Panduan: https://app.stakku.id/help/antigravity.
