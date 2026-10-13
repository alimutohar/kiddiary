import { getUserSpaces } from '@/app/actions/spaces';
import { getChildren } from '@/app/actions/children';
import { getActivities } from '@/app/actions/activities';
import { getDailyLogs } from '@/app/actions/logs';
import { DailyLogger } from '@/components/app/daily-logger';
import Link from 'next/link';
import { Calendar, UserPlus, Sparkles } from 'lucide-react';

export default async function CatatPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { activeSpace } = await getUserSpaces();

  if (!activeSpace) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Silakan pilih atau buat ruang terlebih dahulu.</p>
      </div>
    );
  }

  const { activeChild, children: childrenList } = await getChildren(activeSpace.id);

  if (!activeChild && activeSpace.space_type === 'family') {
    return (
      <div className="text-center py-12 bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
        <UserPlus className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-white mb-1">Belum Ada Profil Anak</h3>
        <p className="text-xs text-slate-400 mb-4 max-w-xs mx-auto">
          Buat profil anak untuk mulai mencatat pembiasaan ibadah dan kebaikan harian.
        </p>
        <Link
          href="/app/anak"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl"
        >
          <span>Buat Profil Anak</span>
        </Link>
      </div>
    );
  }

  const resolvedParams = await searchParams;
  const targetDate = resolvedParams.date || new Date().toISOString().split('T')[0];
  const activities = await getActivities(activeSpace.id);
  const initialLogs = activeChild
    ? await getDailyLogs(activeSpace.id, activeChild.id, targetDate)
    : [];

  const dateObj = new Date(targetDate);
  const dateFormatted = dateObj.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-4">
      {/* Date Header & Child Info */}
      <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-2xl px-4 py-3">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-white">{dateFormatted}</span>
        </div>
        {activeChild && (
          <div className="flex items-center gap-1 text-xs text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-full">
            <Sparkles className="w-3 h-3" />
            <span>{activeChild.nickname || activeChild.name}</span>
          </div>
        )}
      </div>

      {/* Daily Logger Component */}
      {activeChild && (
        <DailyLogger
          space={activeSpace}
          child={activeChild}
          activities={activities}
          initialLogs={initialLogs}
          dateStr={targetDate}
        />
      )}
    </div>
  );
}
