import Link from 'next/link';
import {
  Sparkles,
  Heart,
  Star,
  BookOpen,
  Award,
  ShieldCheck,
  Users,
  CheckCircle2,
  ArrowRight,
  Smile,
  Calendar,
  Layers,
  FileDown,
  Coins,
  CheckSquare,
  Lock,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Background Decorative Blobs */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -left-40 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-amber-500 text-white shadow-md shadow-indigo-500/20 transition-transform group-hover:scale-105">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">
                Kid<span className="text-indigo-400">Diary</span>
              </span>
              <span className="hidden sm:inline-block ml-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[11px] font-semibold text-indigo-300">
                Dual Space Edition
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#fitur" className="transition hover:text-indigo-400">
              Fitur Unggulan
            </a>
            <a href="#dual-space" className="transition hover:text-indigo-400">
              Dual Space
            </a>
            <a href="#prinsip" className="transition hover:text-indigo-400">
              Prinsip Bebas Ranking
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-900 hover:text-white"
            >
              Masuk
            </Link>
            <Link
              href="/app"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:opacity-95"
            >
              Buka Aplikasi
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 pt-12 pb-20 sm:px-6 lg:pt-20">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Niat Baik, Langkah Nyata Menemani Tumbuh Kembang Si Kecil</span>
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Tracker Ibadah & Kebiasaan Anak <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-amber-300 to-rose-400 bg-clip-text text-transparent">
              Tanpa Ranking & Scoring Keimanan
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-400 leading-relaxed">
            Membangun generasi cerdas dan berkarakter mulia lewat gamifikasi bintang motivasi,
            ledger hadiah riil (IDR & Emas), serta isolasi ketat antara Ruang Keluarga vs Ruang Pendidikan.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-amber-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:opacity-95 cursor-pointer"
            >
              <Smile className="h-5 w-5" />
              Mulai Ruang Keluarga Gratis
            </Link>
            <Link
              href="/app"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/80 px-7 py-3.5 text-base font-semibold text-slate-200 backdrop-blur-sm transition hover:bg-slate-800"
            >
              Buka Demo Aplikasi
            </Link>
          </div>

          {/* Value Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Database Mandiri BYOC (Turso)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-indigo-400" />
              <span>Isolasi Data Keluarga vs Guru</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-amber-400" />
              <span>Ekspor Laporan HTML Standalone Offline</span>
            </div>
          </div>
        </div>

        {/* Live Interactive Preview Card */}
        <div id="preview" className="mx-auto mt-14 max-w-4xl">
          <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl p-6 shadow-2xl sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-2xl font-bold text-amber-400">
                  👦
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">Muhammad Fatih</h3>
                    <span className="rounded-full bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-0.5 text-xs font-semibold text-indigo-300">
                      Ruang Keluarga
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Niat Baik, Langkah Nyata • Tracker Mandiri</p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-2xl bg-amber-500/10 px-4 py-2.5 border border-amber-500/20">
                <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
                <div>
                  <span className="text-xs font-medium text-amber-300">Bintang Apresiasi</span>
                  <p className="text-lg font-extrabold text-amber-400">28 Bintang</p>
                </div>
              </div>
            </div>

            {/* Checklist Preview */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center justify-between rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 font-bold">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Sholat Subuh di Masjid</p>
                    <p className="text-[11px] text-emerald-400 font-medium">+2 Bintang &bull; Berjamaah</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-lg">
                  Selesai
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 font-bold">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Membaca Al-Qur'an / Iqra</p>
                    <p className="text-[11px] text-emerald-400 font-medium">+2 Bintang &bull; 1 Halaman</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-lg">
                  Selesai
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900 text-slate-400">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-300">Merapikan Tempat Tidur</p>
                    <p className="text-[11px] text-slate-500">+1 Bintang ⭐</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-lg">
                  Belum
                </span>
              </div>
            </div>

            {/* Target Reward Banner */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border border-indigo-500/30 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-amber-400 backdrop-blur-sm">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Janji Hadiah: Tabungan Emas Mini 0.025 gr</h4>
                  <p className="text-xs text-indigo-200">Tersisa 2 bintang lagi untuk mencairkan hadiah!</p>
                </div>
              </div>
              <div className="w-full sm:w-32 bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
                <div className="bg-amber-400 h-full w-[90%] rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="fitur" className="border-t border-slate-800/80 bg-slate-900/50 py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              5 Navigasi Mobile-First & Modul Lengkap
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
              Dirancang Khusus Menemani Tumbuh Kembang Positif
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base">
              Menghilangkan komparasi ranking dan scoring keimanan agar si kecil bangga dengan proses belajarnya.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Fitur 1: Sholat & Ibadah 5 Waktu */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 transition hover:border-slate-700">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400">
                <CheckSquare className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-white">Pencatatan Sholat Multi-Dimensi</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Catat ketepatan waktu, pelaksanaan berjamaah di masjid/rumah, sholat rawatib, hingga dzikir dengan mudah.
              </p>
            </div>

            {/* Fitur 2: Ledger Hadiah Privat */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 transition hover:border-slate-700">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400">
                <Coins className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-white">Ledger Hadiah Riil (IDR & Emas)</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Janji reward nyata (uang saku, emas 0.01g, pengalaman) dengan buku kas mutasi kompensasi bersih privat keluarga.
              </p>
            </div>

            {/* Fitur 3: Ekspor HTML Standalone Offline */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 transition hover:border-slate-700">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                <FileDown className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-white">Laporan HTML Standalone Offline</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Unduh rekam jejak pembiasaan anak dalam satu file HTML mandiri yang dapat dibuka langsung tanpa kuota internet.
              </p>
            </div>

            {/* Fitur 4: Dual Space Architecture */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 transition hover:border-slate-700">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-400">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-white">Dual-Space Architecture</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Pemisahan ruang yang ketat: Catatan hadiah privat keluarga tidak akan pernah bocor atau terlihat oleh guru sekolah.
              </p>
            </div>

            {/* Fitur 5: Tanpa Wajib Akun Email Anak */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 transition hover:border-slate-700">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-400">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-white">Profil Anak Mandiri Tanpa Email</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Orang tua dapat mendaftarkan banyak anak tanpa perlu membuat email pribadi untuk si kecil.
              </p>
            </div>

            {/* Fitur 6: Privasi BYOC Turso */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 transition hover:border-slate-700">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-white">Privasi Mandiri BYOC</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Data keluarga disimpan di database Turso Anda sendiri. 100% aman, tanpa tracking analitik pihak ketiga.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-bold text-white">KidDiary</span>
            <span className="text-xs text-slate-500">© 2026. Niat baik, langkah nyata.</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <Link href="/login" className="hover:text-indigo-400">
              Masuk
            </Link>
            <Link href="/register" className="hover:text-indigo-400">
              Daftar
            </Link>
            <Link href="/app" className="hover:text-indigo-400">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
