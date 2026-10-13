import Link from 'next/link';
import { ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300">
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Ketentuan Layanan (Terms of Service)</h1>
          <p className="text-xs text-slate-400 mt-1">Terakhir diperbarui: 3 Oktober 2026</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-xs text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">1. Pengantar & Definisi</h2>
            <p>
              KidDiary adalah aplikasi pembiasaan positif dan tracker ibadah harian berbasis Bring Your Own Cloud (BYOC). Dengan menggunakan layanan ini, Anda menyetujui seluruh ketentuan yang berlaku.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">2. Prinsip Non-Komparasi & Etika</h2>
            <p>
              KidDiary dirancang dengan prinsip anti-ranking dan zero-scoring keimanan. Pengguna dilarang menyalahgunakan platform untuk membanding-bandingkan pencapaian anak secara publik atau merugikan psikologis anak.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">3. Kepemilikan & Database Mandiri (BYOC)</h2>
            <p>
              Seluruh data keluarga dan catatan ibadah disimpan langsung di infrastruktur database Turso milik pengguna. Pengguna memiliki kontrol 100% atas data pribadi masing-masing.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">4. Lisensi & Penggunaan</h2>
            <p>
              Lisensi KidDiary dilindungi oleh Stakku Guard. Penggunaan template atau kode tunduk pada batasan lisensi yang dibeli melalui Stakku Hub.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
