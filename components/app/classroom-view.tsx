'use client';

import { useState } from 'react';
import { Space, Child, ClassSession } from '@/lib/types';
import { createClassSession, deleteClassSession } from '@/app/actions/classroom';
import { GraduationCap, Plus, Calendar, CheckSquare, Sparkles, Trash2, X } from 'lucide-react';

interface ClassroomViewProps {
  space: Space;
  childrenList: Child[];
  sessions: ClassSession[];
}

export function ClassroomView({
  space,
  childrenList,
  sessions,
}: ClassroomViewProps) {
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white">Ruang Pendidikan</h1>
          <p className="text-xs text-slate-400">
            Observasi perkembangan murid & rencana bimbingan lanjutan
          </p>
        </div>
        <button
          onClick={() => setShowSessionModal(true)}
          className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Sesi Baru</span>
        </button>
      </div>

      {/* Daftar Sesi Observasi Kelas */}
      <div className="space-y-3">
        {sessions.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-6">
            <GraduationCap className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">Belum ada sesi observasi kelas yang dicatat.</p>
          </div>
        ) : (
          sessions.map((session) => {
            const formattedDate = new Date(session.session_date).toLocaleDateString('id-ID', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });

            return (
              <div
                key={session.id}
                className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formattedDate}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white mt-1">{session.title}</h3>
                    {session.topic && (
                      <span className="inline-block text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full mt-1">
                        Topik: {session.topic}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={async () => {
                      if (confirm('Hapus catatan sesi kelas ini?')) {
                        await deleteClassSession(session.id);
                      }
                    }}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 space-y-2 text-xs">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Observasi Guru:
                    </div>
                    <p className="text-slate-200 mt-0.5 leading-relaxed">
                      {session.observations}
                    </p>
                  </div>

                  {session.next_steps && (
                    <div className="pt-2 border-t border-slate-800">
                      <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                        Langkah Bimbingan Lanjut:
                      </div>
                      <p className="text-amber-200/90 mt-0.5 leading-relaxed">
                        {session.next_steps}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Sesi Kelas Baru */}
      {showSessionModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
            <button
              onClick={() => setShowSessionModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-white mb-1">Catat Sesi Kelas</h3>
            <p className="text-xs text-slate-400 mb-4">
              Observasi perkembangan karakter, tahsin, atau adab kelas.
            </p>

            <form
              action={async (formData) => {
                setLoading(true);
                formData.append('space_id', space.id);
                await createClassSession(formData);
                setShowSessionModal(false);
                setLoading(false);
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tanggal Sesi</label>
                <input
                  type="date"
                  name="session_date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Judul Sesi</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Misal: Sesi Praktik Wudhu & Sholat"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Topik / Tema</label>
                <input
                  type="text"
                  name="topic"
                  placeholder="Misal: Kesabaran & Ketertiban"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Hasil Observasi Guru</label>
                <textarea
                  name="observations"
                  rows={3}
                  required
                  placeholder="Catatan keaktifan, kemandirian, dan respon murid..."
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Langkah Selanjutnya (Action Plan)</label>
                <input
                  type="text"
                  name="next_steps"
                  placeholder="Misal: Pendalaman hafalan doa ruku'..."
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Menyimpan...' : 'Simpan Sesi Observasi'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
