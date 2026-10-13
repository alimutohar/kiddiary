import { getUserSpaces } from '@/app/actions/spaces';
import { getChildren } from '@/app/actions/children';
import { getActivities } from '@/app/actions/activities';
import { getDailyLogs } from '@/app/actions/logs';
import { getPledges } from '@/app/actions/rewards';
import Link from 'next/link';
import { Sparkles, CheckCircle2, ArrowRight, Heart, Gift, Award, Plus, Calendar, Clock, Smile } from 'lucide-react';

export default async function HomePage() {
  const { activeSpace } = await getUserSpaces();

  if (!activeSpace) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Belum ada ruang yang dipilih.</p>
      </div>
    );
  }

  const { activeChild, children: childrenList } = await getChildren(activeSpace.id);
  const todayStr = new Date().toISOString().split('T')[0];

  // If there are no children yet in a family space, show quick onboarding card
  if (activeSpace.space_type === 'family' && (!childrenList || childrenList.length === 0)) {
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-indigo-900/60 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 text-center shadow-xl">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/20 text-amber-400 flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Selamat Datang di KidDiary!</h2>
          <p className="text-xs text-slate-300 leading-relaxed mb-6">
            Mulai langkah nyata mendampingi kebiasaan baik si kecil tanpa beban ranking atau scoring keimanan.
          </p>
          <Link
            href="/app/anak"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Profil Anak Pertama</span>
          </Link>
        </div>
      </div>
    );
  }

  const activities = await getActivities(activeSpace.id);
  const dailyLogs = activeChild
    ? await getDailyLogs(activeSpace.id, activeChild.id, todayStr)
    : [];

  const completedCount = dailyLogs.filter((l) => l.status === 'approved' || l.status === 'pending').length;
  const totalActivities = activities.filter((a) => a.is_active).length;
  const progressPercent = totalActivities > 0 ? Math.round((completedCount / totalActivities) * 100) : 0;

  const pledges = activeSpace.space_type === 'family' && activeChild
    ? await getPledges(activeSpace.id, activeChild.id)
    : [];
  const activePledge = pledges.find((p) => p.status === 'active');

  const todayFormatted = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-4">
      {/* Slogan & Greeting Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            <span>{todayFormatted}</span>
          </div>
          <h1 className="text-lg font-bold text-white mt-0.5">
            {activeSpace.space_type === 'classroom'
              ? 'Ruang Observasi Kelas'
              : `Halo, Ayah & Bunda ${activeChild?.nickname ? `(${activeChild.nickname})` : ''}`}
          </h1>
        </div>
        {activeChild && (
          <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-amber-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{activeChild.total_stars} Bintang</span>
          </div>
        )}
      </div>

      {/* CARD 1: Ringkasan Capaian Hari Ini (Progress Ringkasan) */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Langkah Hari Ini</h3>
              <p className="text-[11px] text-slate-400">
                {completedCount} dari {totalActivities} kegiatan tercatat
              </p>
            </div>
          </div>
          <span className="text-sm font-black text-indigo-400">{progressPercent}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <span className="text-slate-400 text-[11px]">
            {progressPercent === 100
              ? '✨ Maa syaa Allah, semua kegiatan lengkap!'
              : 'Terus dampingi dengan lemah lembut & kasih sayang.'}
          </span>
          <Link
            href="/app/catat"
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>Catat</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* CARD 2: Momen & Pengingat "Niat Baik, Langkah Nyata" */}
      <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/20 rounded-3xl p-5 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5 fill-amber-500/20" />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-bold text-amber-300">Prinsip Pendampingan</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              "Fokus pada proses kebaikan dan pembiasaan menyenangkan, bukan perbandingan ranking antar anak."
            </p>
          </div>
        </div>
      </div>

      {/* CARD 3: Janji Hadiah / Target Bintang Terdekat (Khusus Ruang Keluarga) */}
      {activeSpace.space_type === 'family' ? (
        activePledge ? (
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Janji Hadiah Aktif</h3>
                  <p className="text-[11px] text-slate-400 truncate max-w-[170px]">
                    {activePledge.title}
                  </p>
                </div>
              </div>
              <Link
                href="/app/hadiah"
                className="text-[11px] font-semibold text-amber-400 hover:text-amber-300"
              >
                Lihat Ledger
              </Link>
            </div>

            <div className="bg-slate-950/60 rounded-2xl p-3 border border-slate-800/80 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Target Bintang</span>
                <div className="font-bold text-white flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{activeChild?.total_stars || 0} / {activePledge.stars_required}</span>
                </div>
              </div>
              <div className="text-right space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Bentuk Hadiah</span>
                <div className="font-bold text-amber-300">
                  {activePledge.reward_type === 'idr' && `Rp ${Number(activePledge.target_value).toLocaleString('id-ID')}`}
                  {activePledge.reward_type === 'gold_grams' && `${activePledge.target_value} gr Emas`}
                  {activePledge.reward_type === 'item' && 'Barang Spesial'}
                  {activePledge.reward_type === 'experience' && 'Pengalaman Seru'}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-3xl p-5 text-center">
            <Gift className="w-6 h-6 text-slate-500 mx-auto mb-2" />
            <div className="text-xs font-bold text-slate-300">Belum Ada Janji Hadiah</div>
            <p className="text-[11px] text-slate-400 mt-1 mb-3">
              Buat janji reward (IDR, Emas 0.01g, atau Pengalaman) untuk memotivasi anak.
            </p>
            <Link
              href="/app/hadiah"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Janji Hadiah</span>
            </Link>
          </div>
        )
      ) : (
        /* CARD Khusus Ruang Pendidikan: Sesi Observasi Kelas Terakhir */
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white">Sesi Observasi Kelas</h3>
            <Link href="/app/kelas" className="text-xs font-semibold text-amber-400">
              Kelola Sesi
            </Link>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Catat perkembangan karakter, kemandirian, dan adab murid tanpa ranking kompetitif.
          </p>
          <Link
            href="/app/kelas"
            className="w-full py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Observasi Sesi Kelas</span>
          </Link>
        </div>
      )}
    </div>
  );
}
