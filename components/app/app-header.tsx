'use client';

import { useState } from 'react';
import { Space, Child } from '@/lib/types';
import { setActiveSpace, createSpace } from '@/app/actions/spaces';
import { setActiveChild, createChild } from '@/app/actions/children';
import { Sparkles, Users, Home, GraduationCap, Plus, ChevronDown, Check, UserPlus, X } from 'lucide-react';

interface AppHeaderProps {
  spaces: Space[];
  activeSpace: Space | null;
  childrenList: Child[];
  activeChild: Child | null;
}

export function AppHeader({
  spaces,
  activeSpace,
  childrenList,
  activeChild,
}: AppHeaderProps) {
  const [spaceDropdownOpen, setSpaceDropdownOpen] = useState(false);
  const [childDropdownOpen, setChildDropdownOpen] = useState(false);
  const [createSpaceModalOpen, setCreateSpaceModalOpen] = useState(false);
  const [createChildModalOpen, setCreateChildModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2">
          {/* Space Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setSpaceDropdownOpen(!spaceDropdownOpen);
                setChildDropdownOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all text-left text-xs text-white"
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  activeSpace?.space_type === 'classroom'
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-indigo-500/20 text-indigo-300'
                }`}
              >
                {activeSpace?.space_type === 'classroom' ? (
                  <GraduationCap className="w-3 h-3" />
                ) : (
                  <Home className="w-3 h-3" />
                )}
              </div>
              <span className="font-semibold max-w-[100px] truncate">
                {activeSpace?.name || 'Pilih Ruang'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Dropdown Space */}
            {spaceDropdownOpen && (
              <div className="absolute left-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5">
                  Daftar Ruang
                </div>
                <div className="space-y-1">
                  {spaces.map((s) => (
                    <button
                      key={s.id}
                      onClick={async () => {
                        await setActiveSpace(s.id);
                        setSpaceDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                        s.id === activeSpace?.id
                          ? 'bg-indigo-600/20 text-indigo-300 font-medium'
                          : 'text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {s.space_type === 'classroom' ? (
                          <GraduationCap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        ) : (
                          <Home className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        )}
                        <span className="truncate">{s.name}</span>
                      </div>
                      {s.id === activeSpace?.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setSpaceDropdownOpen(false);
                      setCreateSpaceModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-indigo-400 hover:bg-indigo-500/10 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Buat Ruang Baru</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Child Selector (Khusus jika ada profil anak) */}
          {activeSpace?.space_type === 'family' ? (
            <div className="relative">
              <button
                onClick={() => {
                  setChildDropdownOpen(!childDropdownOpen);
                  setSpaceDropdownOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all text-xs text-white"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-amber-500 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                  {activeChild?.nickname?.[0] || activeChild?.name?.[0] || '👶'}
                </div>
                <span className="font-semibold max-w-[90px] truncate">
                  {activeChild?.nickname || activeChild?.name || 'Pilih Anak'}
                </span>
                <div className="flex items-center gap-1 text-[11px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded-full">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>{activeChild?.total_stars || 0}</span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Dropdown Child */}
              {childDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5">
                    Profil Anak
                  </div>
                  <div className="space-y-1">
                    {childrenList.map((c) => (
                      <button
                        key={c.id}
                        onClick={async () => {
                          await setActiveChild(c.id);
                          setChildDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                          c.id === activeChild?.id
                            ? 'bg-amber-500/20 text-amber-300 font-medium'
                            : 'text-slate-300 hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-bold">{c.nickname || c.name}</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-400 text-[11px]">
                          <Sparkles className="w-3 h-3" />
                          <span>{c.total_stars}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setChildDropdownOpen(false);
                        setCreateChildModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Tambah Profil Anak</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              <GraduationCap className="w-3.5 h-3.5" />
              <span className="font-medium">Mode Guru</span>
            </div>
          )}
        </div>
      </header>

      {/* Modal Tambah Ruang Baru */}
      {createSpaceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
            <button
              onClick={() => setCreateSpaceModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-1">Buat Ruang Baru</h3>
            <p className="text-xs text-slate-400 mb-4">
              Pilih tipe ruang sesuai kebutuhan keluarga atau kegiatan belajar.
            </p>

            <form
              action={async (formData) => {
                await createSpace(formData);
                setCreateSpaceModalOpen(false);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Ruang</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Misal: Keluarga Bahagia / Kelas Tahfidz"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tipe Ruang</label>
                <select
                  name="space_type"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs outline-none"
                >
                  <option value="family">Ruang Keluarga (Privat + Hadiah)</option>
                  <option value="classroom">Ruang Pendidikan (Observasi Guru)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Deskripsi Singkat</label>
                <input
                  type="text"
                  name="description"
                  placeholder="Opsional"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all cursor-pointer"
              >
                Simpan Ruang
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah Profil Anak */}
      {createChildModalOpen && activeSpace && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
            <button
              onClick={() => setCreateChildModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-1">Tambah Profil Anak</h3>
            <p className="text-xs text-slate-400 mb-4">
              Anak dapat memiliki profil mandiri tanpa perlu membuat alamat email.
            </p>

            <form
              action={async (formData) => {
                await createChild(formData);
                setCreateChildModalOpen(false);
              }}
              className="space-y-3.5 text-xs"
            >
              <input type="hidden" name="space_id" value={activeSpace.id} />

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Misal: Muhammad Fatih"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Panggilan</label>
                <input
                  type="text"
                  name="nickname"
                  placeholder="Misal: Fatih"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    name="birth_date"
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Jenis Kelamin</label>
                  <select
                    name="gender"
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs outline-none"
                  >
                    <option value="male">Laki-laki</option>
                    <option value="female">Perempuan</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-medium rounded-xl transition-all cursor-pointer"
              >
                Buat Profil Anak
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
