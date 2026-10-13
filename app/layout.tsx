import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'KidDiary - Buku Harian, Tracker Kebiasaan Baik & Ibadah Anak',
  description:
    'Aplikasi pendamping tumbuh kembang anak terpadu: Catatan ibadah harian, reward bintang motivasi, jurnal momen emas, serta kolaborasi harmonis antara orang tua dan guru.',
  keywords: [
    'KidDiary',
    'buku harian anak',
    'tracker ibadah anak',
    'kebiasaan baik anak',
    'parenting app',
    'dual-space family education',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-[#fdfbf7] text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
