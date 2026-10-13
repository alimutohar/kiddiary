'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, CheckSquare, History, FileText, Menu, Sparkles } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      title: 'Beranda',
      href: '/app',
      icon: Home,
      exact: true,
    },
    {
      title: 'Catat',
      href: '/app/catat',
      icon: CheckSquare,
      highlight: true,
    },
    {
      title: 'Riwayat',
      href: '/app/riwayat',
      icon: History,
    },
    {
      title: 'Laporan',
      href: '/app/laporan',
      icon: FileText,
    },
    {
      title: 'Menu',
      href: '/app/menu',
      icon: Menu,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/85 backdrop-blur-xl border-t border-slate-800/80 pb-safe">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname?.startsWith(item.href);
          const Icon = item.icon;

          if (item.highlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -top-3 flex flex-col items-center group"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 via-indigo-600 to-amber-500 p-0.5 shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
                  <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                    <Icon className="w-5 h-5 text-amber-400 group-hover:text-amber-300 transition-colors" />
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-amber-400 mt-0.5">
                  {item.title}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-indigo-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span className="text-[10px] mt-1">{item.title}</span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-indigo-400 mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
