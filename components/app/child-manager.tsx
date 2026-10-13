'use client';

import { useState } from 'react';
import { Child, Space } from '@/lib/types';
import { createChild, updateChild, deleteChild, setActiveChild } from '@/app/actions/children';
import { UserPlus, Sparkles, Edit2, Trash2, Check, User, Plus, X, Calendar } from 'lucide-react';

interface ChildManagerProps {
  space: Space;
  childrenList: Child[];
  activeChild: Child | null;
}

export function ChildManager({ space, childrenList, activeChild }: ChildManagerProps) {
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white">Profil Anak</h1>
          <p className="text-xs text-slate-400">
            Kelola profil anak mandiri tanpa wajib membuat akun email
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah</span>
        </button>
      </div>

      {childrenList.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-6">
          <User className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-xs text-slate-400">Belum ada anak yang terdaftar di ruang ini.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {childrenList.map((c) => {
            const isSelected = c.id === activeChild?.id;

            return (
              <div
                key={c.id}
                className={`bg-slate-900/80 backdrop-blur-xl border rounded-3xl p-4 transition-all ${
                  isSelected ? 'border-amber-500/40 bg-amber-500/5' : 'border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 p-0.5 flex items-center justify-center font-bold text-white text-base">
                      {c.nickname?.[0] || c.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-white">{c.name}</h4>
                        {c.nickname && (
                          <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                            ({c.nickname})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span>{c.gender === 'male' ? 'Laki-laki' : 'Perempuan'}</span>
                        {c.birth_date && (
                          <>
                            <span>&bull;</span>
                            <span>{new Date(c.birth_date).toLocaleDateString('id-ID')}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1 text-amber-400 font-bold text-xs bg-amber-500/10 px-2.5 py-1 rounded-full">
                      <Sparkles className="w-3 h-3" />
                      <span>{c.total_stars}</span>
                    </div>

                    <button
                      onClick={() => setEditingChild(c)}
                      className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {!isSelected && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex justify-end">
                    <button
                      onClick={async () => {
                        await setActiveChild(c.id);
                      }}
                      className="text-xs text-indigo-400 font-semibold hover:underline"
                    >
                      Jadikan Anak Aktif →
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Add Child */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-white mb-3">Tambah Profil Anak</h3>

            <form
              action={async (formData) => {
                setLoading(true);
                formData.append('space_id', space.id);
                await createChild(formData);
                setShowAddModal(false);
                setLoading(false);
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Misal: Maryam Az-Zahra"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Panggilan</label>
                <input
                  type="text"
                  name="nickname"
                  placeholder="Misal: Maryam"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    name="birth_date"
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Jenis Kelamin</label>
                  <select
                    name="gender"
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none"
                  >
                    <option value="male">Laki-laki</option>
                    <option value="female">Perempuan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Catatan Tambahan</label>
                <input
                  type="text"
                  name="notes"
                  placeholder="Opsional (misal: hobi, alergi, dsb)"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Menyimpan...' : 'Simpan Profil'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Child */}
      {editingChild && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
            <button
              onClick={() => setEditingChild(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-white mb-3">Edit Profil Anak</h3>

            <form
              action={async (formData) => {
                setLoading(true);
                formData.append('child_id', editingChild.id);
                await updateChild(formData);
                setEditingChild(null);
                setLoading(false);
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingChild.name}
                  required
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Panggilan</label>
                <input
                  type="text"
                  name="nickname"
                  defaultValue={editingChild.nickname || ''}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    name="birth_date"
                    defaultValue={editingChild.birth_date || ''}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Jenis Kelamin</label>
                  <select
                    name="gender"
                    defaultValue={editingChild.gender || 'male'}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none"
                  >
                    <option value="male">Laki-laki</option>
                    <option value="female">Perempuan</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all cursor-pointer"
              >
                {loading ? 'Menyimpan...' : 'Perbarui Profil'}
              </button>

              <button
                type="button"
                onClick={async () => {
                  if (confirm('Yakin ingin menghapus profil ini?')) {
                    await deleteChild(editingChild.id);
                    setEditingChild(null);
                  }
                }}
                className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Hapus Profil
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
