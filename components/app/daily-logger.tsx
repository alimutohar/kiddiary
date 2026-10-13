'use client';

import { useState } from 'react';
import { Activity, ActivityLog, Child, Space, ActivityCategorySlug } from '@/lib/types';
import { saveActivityLog, deleteActivityLog } from '@/app/actions/logs';
import { createActivity } from '@/app/actions/activities';
import {
  Sparkles,
  Check,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  CloudSun,
  BookOpen,
  Heart,
  Smile,
  CheckCircle2,
  Shield,
  Plus,
  X,
  Award,
  GraduationCap,
} from 'lucide-react';

interface DailyLoggerProps {
  space: Space;
  child: Child;
  activities: Activity[];
  initialLogs: ActivityLog[];
  dateStr: string;
}

export function DailyLogger({
  space,
  child,
  activities: initialActivities,
  initialLogs,
  dateStr,
}: DailyLoggerProps) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [logs, setLogs] = useState<Record<string, ActivityLog>>(() => {
    const map: Record<string, ActivityLog> = {};
    initialLogs.forEach((l) => {
      map[l.activity_id] = l;
    });
    return map;
  });

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [creatingActivity, setCreatingActivity] = useState(false);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'sunrise': return <Sunrise className="w-5 h-5 text-amber-400" />;
      case 'sun': return <Sun className="w-5 h-5 text-amber-300" />;
      case 'cloud-sun': return <CloudSun className="w-5 h-5 text-orange-400" />;
      case 'sunset': return <Sunset className="w-5 h-5 text-rose-400" />;
      case 'moon': return <Moon className="w-5 h-5 text-indigo-400" />;
      case 'book-open': return <BookOpen className="w-5 h-5 text-emerald-400" />;
      case 'heart': return <Heart className="w-5 h-5 text-rose-400" />;
      case 'smile': return <Smile className="w-5 h-5 text-teal-400" />;
      case 'graduation-cap': return <GraduationCap className="w-5 h-5 text-sky-400" />;
      case 'award': return <Award className="w-5 h-5 text-amber-400" />;
      default: return <Sparkles className="w-5 h-5 text-indigo-400" />;
    }
  };

  async function handleQuickToggle(activity: Activity) {
    const currentLog = logs[activity.id];
    setSavingId(activity.id);

    if (currentLog) {
      // Hapus log
      await deleteActivityLog(currentLog.id, child.id);
      setLogs((prev) => {
        const next = { ...prev };
        delete next[activity.id];
        return next;
      });
    } else {
      // Simpan log default approved
      const formData = new FormData();
      formData.append('space_id', space.id);
      formData.append('child_id', child.id);
      formData.append('activity_id', activity.id);
      formData.append('log_date', dateStr);
      formData.append('stars_awarded', activity.star_reward.toString());
      formData.append('status', 'approved');
      formData.append('timing', 'on_time');
      formData.append('location_mode', 'jamaah_rumah');

      const res = await saveActivityLog(formData);
      if (res.success && res.log) {
        setLogs((prev) => ({
          ...prev,
          [activity.id]: res.log as ActivityLog,
        }));
      }
    }
    setSavingId(null);
  }

  async function handleDetailSubmit(e: React.FormEvent<HTMLFormElement>, activity: Activity) {
    e.preventDefault();
    setSavingId(activity.id);

    const formData = new FormData(e.currentTarget);
    formData.append('space_id', space.id);
    formData.append('child_id', child.id);
    formData.append('activity_id', activity.id);
    formData.append('log_date', dateStr);
    formData.append('stars_awarded', activity.star_reward.toString());
    formData.append('status', 'approved');

    const res = await saveActivityLog(formData);
    if (res.success && res.log) {
      setLogs((prev) => ({
        ...prev,
        [activity.id]: res.log as ActivityLog,
      }));
      setExpandedId(null);
    }
    setSavingId(null);
  }

  return (
    <div className="space-y-3">
      {/* Header List & Tombol Tambah Kegiatan Custom */}
      <div className="flex items-center justify-between px-1">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Daftar Rencana & Pembiasaan ({activities.length})
        </div>
        <button
          type="button"
          onClick={() => setShowAddActivityModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-semibold transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Kegiatan Custom</span>
        </button>
      </div>

      {activities.map((act) => {
        const log = logs[act.id];
        const isCompleted = !!log;
        const isExpanded = expandedId === act.id;
        const isSaving = savingId === act.id;

        return (
          <div
            key={act.id}
            className={`bg-slate-900/80 backdrop-blur-xl border rounded-3xl transition-all overflow-hidden ${
              isCompleted
                ? 'border-indigo-500/40 bg-indigo-950/20'
                : 'border-slate-800/80 hover:border-slate-700'
            }`}
          >
            {/* Row Item Utama */}
            <div className="p-4 flex items-center justify-between gap-3">
              {/* Icon & Title */}
              <div
                className="flex items-center gap-3.5 flex-1 min-w-0 cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : act.id)}
              >
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${
                    isCompleted
                      ? 'bg-indigo-500/20 border-indigo-500/40 text-white'
                      : 'bg-slate-800/60 border-slate-700/60'
                  }`}
                >
                  {getIcon(act.icon)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white truncate">
                      {act.title}
                    </span>
                    <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>+{act.star_reward}</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {act.description || (act.is_prayer_5_times ? 'Ibadah Sholat 5 Waktu' : 'Kebiasaan Baik')}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                {act.is_prayer_5_times && (
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : act.id)}
                    className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                )}

                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => handleQuickToggle(act)}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all cursor-pointer ${
                    isCompleted
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-500/25'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
                  }`}
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : isCompleted ? (
                    <Check className="w-5 h-5 stroke-[3]" />
                  ) : (
                    <div className="w-3 h-3 rounded-full border border-slate-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Form Detail Sholat / Aktivitas Multi-Dimensi */}
            {isExpanded && (
              <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 bg-slate-950/40 text-xs">
                <form onSubmit={(e) => handleDetailSubmit(e, act)} className="space-y-3">
                  {act.is_prayer_5_times && (
                    <>
                      {/* Waktu Pelaksanaan */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-indigo-400" />
                          <span>Waktu Pelaksanaan</span>
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {[
                            { value: 'on_time', label: 'Tepat Waktu' },
                            { value: 'late', label: 'Terlambat' },
                            { value: 'qadha', label: 'Qadha' },
                          ].map((opt) => (
                            <label
                              key={opt.value}
                              className="flex items-center justify-center p-2 rounded-xl bg-slate-900 border border-slate-800 text-center cursor-pointer has-checked:border-indigo-500 has-checked:bg-indigo-600/20 has-checked:text-white text-slate-300 text-[11px]"
                            >
                              <input
                                type="radio"
                                name="timing"
                                value={opt.value}
                                defaultChecked={(log?.timing || 'on_time') === opt.value}
                                className="hidden"
                              />
                              <span>{opt.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Tempat / Cara Sholat */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-400" />
                          <span>Tempat / Tata Cara</span>
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {[
                            { value: 'jamaah_masjid', label: 'Masjid' },
                            { value: 'jamaah_rumah', label: 'Di Rumah' },
                            { value: 'munfarid', label: 'Sendiri' },
                          ].map((opt) => (
                            <label
                              key={opt.value}
                              className="flex items-center justify-center p-2 rounded-xl bg-slate-900 border border-slate-800 text-center cursor-pointer has-checked:border-amber-500 has-checked:bg-amber-600/20 has-checked:text-white text-slate-300 text-[11px]"
                            >
                              <input
                                type="radio"
                                name="location_mode"
                                value={opt.value}
                                defaultChecked={(log?.location_mode || 'jamaah_rumah') === opt.value}
                                className="hidden"
                              />
                              <span>{opt.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Sunnah Tambahan (Rawatib & Dzikir) */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer text-slate-300 text-[11px]">
                          <input
                            type="checkbox"
                            name="has_rawatib"
                            value="true"
                            defaultChecked={log?.has_rawatib || false}
                            className="rounded text-indigo-600 focus:ring-0"
                          />
                          <span>+ Sholat Rawatib</span>
                        </label>
                        <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer text-slate-300 text-[11px]">
                          <input
                            type="checkbox"
                            name="has_dzikir"
                            value="true"
                            defaultChecked={log?.has_dzikir || false}
                            className="rounded text-amber-600 focus:ring-0"
                          />
                          <span>+ Dzikir & Doa</span>
                        </label>
                      </div>
                    </>
                  )}

                  {/* Catatan Pendampingan */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Catatan / Evaluasi Lembut
                    </label>
                    <input
                      type="text"
                      name="notes"
                      defaultValue={log?.notes || ''}
                      placeholder="Misal: Fatih semangat adzan sendiri..."
                      className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                    >
                      {isSaving ? 'Menyimpan...' : 'Simpan Detail Catatan'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedId(null)}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                    >
                      Tutup
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        );
      })}

      {/* Modal Tambah Kegiatan Custom */}
      {showAddActivityModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
            <button
              onClick={() => setShowAddActivityModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-white mb-1">Tambah Rencana Kegiatan Custom</h3>
            <p className="text-xs text-slate-400 mb-4">
              Buat target pembiasaan atau kebaikan baru sesuai kebutuhan anak.
            </p>

            <form
              action={async (formData) => {
                setCreatingActivity(true);
                formData.append('space_id', space.id);
                const res = await createActivity(formData);
                if (res.success && res.activity) {
                  setActivities((prev) => [...prev, res.activity as Activity]);
                  setShowAddActivityModal(false);
                }
                setCreatingActivity(false);
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Kegiatan</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Misal: Hafalan Surat Pendek / Bantu Cuci Piring"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Kategori Kebiasaan</label>
                <select
                  name="category_slug"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none"
                >
                  <option value="ibadah">Ibadah & Doa</option>
                  <option value="adab">Adab & Akhlak</option>
                  <option value="belajar">Belajar & Membaca</option>
                  <option value="kemandirian">Kemandirian & Tanggung Jawab</option>
                  <option value="kesehatan">Kesehatan & Kebersihan</option>
                  <option value="custom">Kebiasaan Lainnya (Custom)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Bintang Apresiasi</label>
                  <input
                    type="number"
                    name="star_reward"
                    required
                    defaultValue="1"
                    min="1"
                    max="10"
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Pilihan Ikon</label>
                  <select
                    name="icon"
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none"
                  >
                    <option value="sparkles">✨ Bintang / Sparkles</option>
                    <option value="book-open">📖 Buku / Mengaji</option>
                    <option value="heart">❤️ Kasih Sayang / Adab</option>
                    <option value="graduation-cap">🎓 Belajar / Sekolah</option>
                    <option value="smile">😊 Kebersihan / Mandiri</option>
                    <option value="award">🏆 Prestasi / Hadiah</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Deskripsi / Petunjuk</label>
                <input
                  type="text"
                  name="description"
                  placeholder="Opsional (misal: 15 menit setiap pagi)"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={creatingActivity}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50"
              >
                {creatingActivity ? 'Menyimpan Kegiatan...' : 'Tambahkan ke Rencana Harian'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
