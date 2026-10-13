'use client';

import { useState } from 'react';
import { signup } from '@/app/actions/auth';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, Mail, Lock, User, AlertCircle, Home, GraduationCap } from 'lucide-react';

export default function RegisterPage() {
  const [role, setRole] = useState<'parent' | 'teacher'>('parent');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    formData.append('role', role);
    const res = await signup(formData);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-amber-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <span className="text-2xl font-black tracking-tight text-white">KidDiary</span>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Mulai Niat Baik Hari Ini
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Buat ruang privat keluarga atau ruang observasi kelas Anda
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-slate-900/80 backdrop-blur-xl py-8 px-6 shadow-2xl ring-1 ring-white/10 rounded-3xl sm:px-10">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 text-rose-300 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Role Choice */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setRole('parent')}
              className={`p-3 rounded-2xl border text-left flex flex-col items-center gap-2 transition-all cursor-pointer ${
                role === 'parent'
                  ? 'bg-indigo-600/20 border-indigo-500 ring-2 ring-indigo-500/30 text-white'
                  : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Home className={`w-5 h-5 ${role === 'parent' ? 'text-indigo-400' : 'text-slate-500'}`} />
              <div className="text-center">
                <div className="text-xs font-bold">Ruang Keluarga</div>
                <div className="text-[10px] text-slate-400">Orang Tua & Anak</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole('teacher')}
              className={`p-3 rounded-2xl border text-left flex flex-col items-center gap-2 transition-all cursor-pointer ${
                role === 'teacher'
                  ? 'bg-amber-600/20 border-amber-500 ring-2 ring-amber-500/30 text-white'
                  : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <GraduationCap className={`w-5 h-5 ${role === 'teacher' ? 'text-amber-400' : 'text-slate-500'}`} />
              <div className="text-center">
                <div className="text-xs font-bold">Ruang Pendidikan</div>
                <div className="text-[10px] text-slate-400">Guru & Mentor</div>
              </div>
            </button>
          </div>

          <form action={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="Misal: Ayah Budi / Bunda Siti / Ustadzah Sarah"
                  className="w-full pl-11 pr-4 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="email@keluarga.id"
                  className="w-full pl-11 pr-4 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Minimal 6 karakter"
                  className="w-full pl-11 pr-4 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-indigo-600 to-amber-600 hover:from-indigo-500 hover:to-amber-500 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Menyiapkan Ruang...' : (
                <>
                  <span>Daftar & Masuk ke Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <p className="text-sm text-slate-400">
              Sudah punya akun?{' '}
              <Link href="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Bebas dari iklan, ranking kompetitif, dan scoring keimanan</span>
        </div>
      </div>
    </div>
  );
}
