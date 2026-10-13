import Link from 'next/link';
import { ArrowLeft, Mail, MessageSquare, Sparkles } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300">
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Hubungi Kami (Contact Support)</h1>
          <p className="text-xs text-slate-400 mt-1">Dukungan teknis & konsultasi implementasi KidDiary</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-xs text-slate-300 leading-relaxed">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2">
              <Mail className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-white text-sm">Email Support</h3>
              <p className="text-slate-400">support@stakku.id</p>
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2">
              <MessageSquare className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white text-sm">Komunitas Developer</h3>
              <p className="text-slate-400">t.me/stakkuhub</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
