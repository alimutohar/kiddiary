import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300">
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Kebijakan Privasi (Privacy Policy)</h1>
          <p className="text-xs text-slate-400 mt-1">Perlindungan Data Keluarga & Anak &bull; Standar BYOC</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-xs text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">1. Perlindungan Data Anak</h2>
            <p>
              KidDiary menerapkan arsitektur profil anak tanpa kewajiban membuat akun email atau memberikan identitas sensitif publik. Profil anak dikelola seutuhnya di bawah naungan akun orang tua/wali.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">2. Isolasi Ruang Keluarga vs Ruang Pendidikan</h2>
            <p>
              Sistem menerapkan pemisahan data mutlak: Guru atau anggota di Ruang Pendidikan tidak dapat mengakses, melihat, atau memodifikasi data janji hadiah privat dan buku kas keluarga Anda.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">3. Tanpa Iklan & Pelacak Pihak Ketiga</h2>
            <p>
              Aplikasi ini 100% bebas dari jaringan periklanan pihak ketiga (*third-party ad trackers*). Data aktivitas tidak pernah dijual atau dimonetisasi kepada pihak luar.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
