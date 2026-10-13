import { getUserSpaces } from '@/app/actions/spaces';
import { getChildren } from '@/app/actions/children';
import { getLogHistory, reviewActivityLog } from '@/app/actions/logs';
import { Sparkles, CheckCircle2, Clock, MapPin, Calendar, Check, X, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default async function RiwayatPage() {
  const { activeSpace } = await getUserSpaces();

  if (!activeSpace) {
    return (
      <div className="text-center py-12 text-slate-400">
        Pilih ruang terlebih dahulu.
      </div>
    );
  }

  const { activeChild } = await getChildren(activeSpace.id);
  const logs = await getLogHistory(activeSpace.id, activeChild?.id, 40);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white">Riwayat Langkah Kebaikan</h1>
          <p className="text-xs text-slate-400">
            Jejak pembiasaan dan catatan waktu ibadah harian
          </p>
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-6">
          <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-xs text-slate-400">Belum ada catatan aktivitas di ruang ini.</p>
          <Link
            href="/app/catat"
            className="inline-block mt-3 text-xs text-indigo-400 font-semibold hover:underline"
          >
            Mulai Catat Sekarang →
          </Link>
        </div>
      ) : (
        <div className="space-y-2.5">
          {logs.map((log) => {
            const logDate = new Date(log.log_date).toLocaleDateString('id-ID', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
            });

            return (
              <div
                key={log.id}
                className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-3.5 shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md">
                      {logDate}
                    </span>
                    <span className="text-xs font-bold text-white">
                      {log.activity?.title || 'Aktivitas'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>+{log.stars_awarded}</span>
                    </span>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        log.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : log.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {log.status === 'approved' ? 'Terverifikasi' : log.status}
                    </span>
                  </div>
                </div>

                {/* Sholat Details */}
                {(log.timing || log.location_mode || log.has_rawatib || log.has_dzikir) && (
                  <div className="flex flex-wrap gap-1.5 text-[10px] text-slate-300">
                    {log.timing && (
                      <span className="bg-slate-800/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-indigo-400" />
                        <span>
                          {log.timing === 'on_time'
                            ? 'Tepat Waktu'
                            : log.timing === 'late'
                            ? 'Terlambat'
                            : 'Qadha'}
                        </span>
                      </span>
                    )}

                    {log.location_mode && (
                      <span className="bg-slate-800/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 text-amber-400" />
                        <span>
                          {log.location_mode === 'jamaah_masjid'
                            ? 'Masjid'
                            : log.location_mode === 'jamaah_rumah'
                            ? 'Rumah'
                            : 'Sendiri'}
                        </span>
                      </span>
                    )}

                    {log.has_rawatib && (
                      <span className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                        + Rawatib
                      </span>
                    )}

                    {log.has_dzikir && (
                      <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-md">
                        + Dzikir
                      </span>
                    )}
                  </div>
                )}

                {log.notes && (
                  <p className="text-[11px] text-slate-400 italic bg-slate-950/40 p-2 rounded-xl">
                    "{log.notes}"
                  </p>
                )}

                {/* State Machine Review Buttons jika pending */}
                {log.status === 'pending' && (
                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800">
                    <form
                      action={async () => {
                        'use server';
                        await reviewActivityLog(log.id, 'approved');
                      }}
                    >
                      <button
                        type="submit"
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-semibold rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <Check className="w-3 h-3" />
                        <span>Setujui</span>
                      </button>
                    </form>

                    <form
                      action={async () => {
                        'use server';
                        await reviewActivityLog(log.id, 'rejected');
                      }}
                    >
                      <button
                        type="submit"
                        className="px-2.5 py-1 bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 text-[10px] font-semibold rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <X className="w-3 h-3" />
                        <span>Tolak</span>
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
