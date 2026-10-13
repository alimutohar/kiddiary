# KidDiary — Antigravity

Baca README.md dan panduan Next.js dalam node_modules/next/dist/docs sebelum mengubah kode. Gunakan Next.js, Tailwind, Better Auth dan Turso existing. KISS/YAGNI; jangan menambah marketplace atau checkout.

Setup: npm install; salin .env.local.example ke .env.local; isi kredensial database pembeli hanya di server; npm run db:push; npm run build. Lisensi dimasukkan pada /activate dan diverifikasi oleh api.stakku.id. Jangan menampilkan atau mengirim secret. Jangan memasukkan database atau .env ke paket/Git.

Pertahankan stakku-guard.ts dan public key existing. Jangan menghapus aktivasi wajib. Token Vercel/R2 tidak diperlukan untuk KidDiary 1.0.0. Setiap query data harus terikat ruang yang dapat diakses akun. Hadiah hanya untuk ruang keluarga dan pemilik; anggota kelas tidak boleh mengakses hadiah keluarga.

Untuk deploy gunakan akun hosting pemilik, hostname lengkap, secret autentikasi acak dan database Turso sendiri. Login KidDiary berbeda dari portal pembeli. Maksimal tiga domain/subdomain aktif per lisensi. Lakukan pengujian alur inti dan isolasi akun saat mengubah database/auth.
