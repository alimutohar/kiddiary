export interface SiteConfig {
  name: string;
  description: string;
  tagline: string;
  url: string;
  ogImage: string;
  links: {
    github?: string;
    docs?: string;
  };
  navigation: {
    title: string;
    href: string;
  }[];
}

export const siteConfig: SiteConfig = {
  name: 'KidDiary',
  tagline: 'Niat Baik, Langkah Nyata Menemani Tumbuh Kembang Si Kecil',
  description:
    'Aplikasi pendamping tumbuh kembang anak terpadu: Tracker ibadah harian, reward bintang motivasi, jurnal momen emas, dan arsitektur Dual-Space privat untuk keluarga & guru.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ogImage: '/og-image.png',
  links: {
    docs: 'https://stakku.id/docs/kiddiary',
  },
  navigation: [
    { title: 'Beranda', href: '/' },
    { title: 'Fitur', href: '#fitur' },
    { title: 'Dual Space', href: '#dual-space' },
    { title: 'Pratinjau', href: '#preview' },
  ],
};
