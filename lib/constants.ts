import { ActivityCategorySlug, PrayerName } from './types';

export interface DefaultActivityTemplate {
  title: string;
  category_slug: ActivityCategorySlug;
  description: string;
  star_reward: number;
  icon: string;
  is_prayer_5_times: boolean;
  prayer_name?: PrayerName;
  sort_order: number;
}

export const DEFAULT_ACTIVITIES: DefaultActivityTemplate[] = [
  {
    title: 'Sholat Subuh',
    category_slug: 'ibadah',
    description: 'Sholat Subuh tepat waktu, disunnahkan berjamaah & dzikir pagi',
    star_reward: 2,
    icon: 'sunrise',
    is_prayer_5_times: true,
    prayer_name: 'subuh',
    sort_order: 1,
  },
  {
    title: 'Sholat Dzuhur',
    category_slug: 'ibadah',
    description: 'Sholat Dzuhur 4 rakaat dengan rawatib qabliyah/ba’diyah',
    star_reward: 1,
    icon: 'sun',
    is_prayer_5_times: true,
    prayer_name: 'dzuhur',
    sort_order: 2,
  },
  {
    title: 'Sholat Ashar',
    category_slug: 'ibadah',
    description: 'Sholat Ashar 4 rakaat sebelum waktu maghrib',
    star_reward: 1,
    icon: 'cloud-sun',
    is_prayer_5_times: true,
    prayer_name: 'ashar',
    sort_order: 3,
  },
  {
    title: 'Sholat Maghrib',
    category_slug: 'ibadah',
    description: 'Sholat Maghrib berjamaah & dzikir petang',
    star_reward: 2,
    icon: 'sunset',
    is_prayer_5_times: true,
    prayer_name: 'maghrib',
    sort_order: 4,
  },
  {
    title: 'Sholat Isya',
    category_slug: 'ibadah',
    description: 'Sholat Isya 4 rakaat & witir sebelum tidur',
    star_reward: 1,
    icon: 'moon',
    is_prayer_5_times: true,
    prayer_name: 'isya',
    sort_order: 5,
  },
  {
    title: 'Membaca Al-Qur’an / Iqro’',
    category_slug: 'ibadah',
    description: 'Mengaji minimal 1 halaman / 1 ruku bersama keluarga',
    star_reward: 2,
    icon: 'book-open',
    is_prayer_5_times: false,
    sort_order: 6,
  },
  {
    title: 'Merapikan Tempat Tidur',
    category_slug: 'kemandirian',
    description: 'Merawat kebersihan kamar dan melipat selimut sendiri',
    star_reward: 1,
    icon: 'sparkles',
    is_prayer_5_times: false,
    sort_order: 7,
  },
  {
    title: 'Belajar & Kerjakan Tugas',
    category_slug: 'belajar',
    description: 'Mengulang materi pelajaran atau membaca buku jendela ilmu',
    star_reward: 2,
    icon: 'graduation-cap',
    is_prayer_5_times: false,
    sort_order: 8,
  },
  {
    title: 'Membantu Orang Tua / Adab Santun',
    category_slug: 'adab',
    description: 'Berbicara lemah lembut & membantu pekerjaan rumah',
    star_reward: 2,
    icon: 'heart',
    is_prayer_5_times: false,
    sort_order: 9,
  },
  {
    title: 'Gosok Gigi & Cuci Kaki Sebelum Tidur',
    category_slug: 'kesehatan',
    description: 'Menjaga kebersihan diri sebelum beristirahat',
    star_reward: 1,
    icon: 'smile',
    is_prayer_5_times: false,
    sort_order: 10,
  },
];
