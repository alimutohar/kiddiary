import { getUserSpaces } from '@/app/actions/spaces';
import { getChildren } from '@/app/actions/children';
import { getLogHistory } from '@/app/actions/logs';
import { ExportReportBtn } from '@/components/app/export-report-btn';
import { Sparkles, Calendar, TrendingUp, CheckCircle, ShieldCheck, Heart } from 'lucide-react';

export default async function LaporanPage() {
  const { activeSpace } = await getUserSpaces();

  if (!activeSpace) {
    return <div className="text-center py-12 text-slate-400">Pilih ruang terlebih dahulu.</div>;
  }

  const { activeChild } = await getChildren(activeSpace.id);
  const logs = await getLogHistory(activeSpace.id, activeChild?.id, 100);

  const totalLogs = logs.length;
  const onTimePrayers = logs.filter((l) => l.timing === 'on_time').length;
  const rawatibCount = logs.filter((l) => l.has_rawatib).length;
  const dzikirCount = logs.filter((l) => l.has_dzikir).length;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-white">Laporan & Evaluasi Positif</h1>
        <p className="text-xs text-slate-400">
          Ringkasan konsistensi tumbuh kembang tanpa sistem komparasi ranking
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-4">
          <div className="flex items-center gap-2 text-indigo-400 mb-1">
            <CheckCircle className="w-4 h-4" />
            <span className="text-[11px] font-semibold text-slate-300">Total Kebaikan</span>
          </div>
          <div className="text-2xl font-black text-white">{totalLogs}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Aktivitas tercatat</p>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-4">
          <div className="flex items-center gap-2 text-amber-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span className="text-[11px] font-semibold text-slate-300">Bintang Terkumpul</span>
          </div>
          <div className="text-2xl font-black text-amber-400">{activeChild?.total_stars || 0}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Apresiasi konsistensi</p>
        </div>
      </div>

      {/* Multi-Dimensi Ibadah Metrics */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          Kedisiplinan Sholat & Sunnah
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
            <span className="text-slate-300">Sholat Tepat Waktu</span>
            <span className="font-bold text-indigo-400">{onTimePrayers} kali</span>
          </div>
          <div className="flex justify-between items-center bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
            <span className="text-slate-300">Sholat Sunnah Rawatib</span>
            <span className="font-bold text-emerald-400">{rawatibCount} kali</span>
          </div>
          <div className="flex justify-between items-center bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
            <span className="text-slate-300">Dzikir & Doa Bada Sholat</span>
            <span className="font-bold text-amber-400">{dzikirCount} kali</span>
          </div>
        </div>
      </div>

      {/* Ekspor Laporan HTML Standalone */}
      <div className="bg-gradient-to-br from-indigo-950/30 to-slate-900 border border-indigo-500/20 rounded-3xl p-5 space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Ekspor Mandiri Offline</h4>
            <p className="text-[11px] text-slate-400">
              Dokumen HTML standalone tanpa dependensi server luar
            </p>
          </div>
        </div>

        <ExportReportBtn space={activeSpace} child={activeChild} logs={logs} />
      </div>
    </div>
  );
}
