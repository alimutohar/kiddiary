import { getUserSpaces } from '@/app/actions/spaces';
import { signout } from '@/app/actions/auth';
import { createClient } from '@/utils/turso/server';
import Link from 'next/link';
import { Users, Gift, GraduationCap, ShieldCheck, LogOut, ChevronRight, Home, Sparkles, UserCheck } from 'lucide-react';

export default async function MenuPage() {
  const { spaces, activeSpace } = await getUserSpaces();
  const database = await createClient();
  const { data: { user } } = await database.auth.getUser();

  const menuSections = [
    {
      title: 'Modul Utama',
      items: [
        {
          title: 'Kelola Profil Anak',
          desc: 'Tambah & edit nama, tanggal lahir, avatar tanpa email',
          href: '/app/anak',
          icon: Users,
          color: 'text-indigo-400 bg-indigo-500/10',
        },
        {
          title: 'Ledger Hadiah Privat',
          desc: 'Janji reward IDR, Emas 0.01g, & riwayat kompensasi',
          href: '/app/hadiah',
          icon: Gift,
          color: 'text-amber-400 bg-amber-500/10',
          familyOnly: true,
        },
        {
          title: 'Ruang Observasi Kelas',
          desc: 'Catatan sesi kelas, kelompok siswa & langkah lanjut',
          href: '/app/kelas',
          icon: GraduationCap,
          color: 'text-emerald-400 bg-emerald-500/10',
        },
      ],
    },
  ];

  return (
    <div className="space-y-4">
      {/* User Info Card */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-amber-500 p-0.5 shadow-lg">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-bold text-white text-base">
            {user?.email?.[0].toUpperCase() || 'U'}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-bold text-white truncate">
            {user?.user_metadata?.full_name || user?.email}
          </div>
          <div className="text-[11px] text-slate-400 truncate mt-0.5">
            {user?.email}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-indigo-400 mt-1">
            <ShieldCheck className="w-3 h-3" />
            <span>Ruang Aktif: {activeSpace?.name}</span>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      {menuSections.map((section, idx) => (
        <div key={idx} className="space-y-2">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2">
            {section.title}
          </div>

          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden divide-y divide-slate-800/80">
            {section.items.map((item, itemIdx) => {
              if (item.familyOnly && activeSpace?.space_type !== 'family') {
                return null;
              }

              const Icon = item.icon;

              return (
                <Link
                  key={itemIdx}
                  href={item.href}
                  className="flex items-center justify-between p-4 hover:bg-slate-800/40 transition-colors group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                </Link>
              );
            })}
          </div>
        </div>
      ))}

      {/* Slogan Philosophy */}
      <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl text-center space-y-1">
        <div className="text-xs font-bold text-slate-300">KidDiary by Stakku</div>
        <div className="text-[10px] text-slate-400">
          "Niat baik, langkah nyata." &bull; Isolasi Data Keluarga vs Sekolah
        </div>
      </div>

      {/* Logout Action */}
      <form action={signout}>
        <button
          type="submit"
          className="w-full py-3 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 font-semibold rounded-2xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar dari Akun</span>
        </button>
      </form>
    </div>
  );
}
