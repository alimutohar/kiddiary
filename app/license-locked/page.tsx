import Link from 'next/link';
import { ShieldAlert, KeyRound, ExternalLink, ArrowRight } from 'lucide-react';

export default function LicenseLockedPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string; status?: string }>;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fdfbf7] px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border-2 border-rose-100 bg-white p-8 text-center shadow-xl shadow-rose-50">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 shadow-inner">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
          Aktivasi Lisensi Diperlukan
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Domain ini belum terikat secara valid dengan kunci lisensi resmi Stakku Guard untuk KidDiary.
        </p>

        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-left border border-slate-200/80">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <KeyRound className="h-4 w-4 text-indigo-600" />
            <span>Cara Aktivasi Cepat:</span>
          </div>
          <ol className="mt-2.5 list-decimal pl-4 text-xs text-slate-600 space-y-1">
            <li>Buka terminal project Anda di Antigravity IDE.</li>
            <li>Gunakan skill <code className="bg-slate-200 px-1 py-0.5 rounded text-indigo-700">stakku-setup</code>.</li>
            <li>Masukkan lisensi Stakku dan domain website Anda.</li>
          </ol>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <a
            href="https://stakku.id"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700"
          >
            Buka Portal Stakku
            <ExternalLink className="h-4 w-4" />
          </a>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            Kembali ke Beranda
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
