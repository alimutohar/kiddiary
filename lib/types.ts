export type SpaceType = 'family' | 'classroom';
export type MemberRole = 'owner' | 'parent' | 'teacher' | 'observer';
export type ActivityCategorySlug = 'ibadah' | 'adab' | 'belajar' | 'kemandirian' | 'kesehatan' | 'custom';
export type PrayerName = 'subuh' | 'dzuhur' | 'ashar' | 'maghrib' | 'isya';
export type LogStatus = 'draft' | 'pending' | 'approved' | 'rejected';
export type PrayerTiming = 'on_time' | 'late' | 'qadha' | 'not_performed';
export type LocationMode = 'jamaah_masjid' | 'jamaah_rumah' | 'munfarid';
export type RewardType = 'idr' | 'gold_grams' | 'item' | 'experience';
export type TransactionType = 'earned' | 'fulfilled' | 'adjustment';

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  preferred_role: string;
  created_at: string;
}

export interface Space {
  id: string;
  owner_id: string;
  name: string;
  space_type: SpaceType;
  description: string | null;
  invite_code: string | null;
  is_active: boolean;
  created_at: string;
}

export interface SpaceMember {
  id: string;
  space_id: string;
  user_id: string;
  role: MemberRole;
  joined_at: string;
}

export interface Child {
  id: string;
  space_id: string;
  name: string;
  nickname: string | null;
  birth_date: string | null;
  gender: 'male' | 'female' | null;
  avatar_url: string | null;
  pin_code: string | null;
  notes: string | null;
  total_stars: number;
  created_at: string;
}

export interface Activity {
  id: string;
  space_id: string;
  category_id?: string | null;
  category_slug: ActivityCategorySlug;
  title: string;
  description: string | null;
  star_reward: number;
  icon: string;
  is_prayer_5_times: boolean;
  prayer_name?: PrayerName | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  space_id: string;
  child_id: string;
  activity_id: string;
  log_date: string;
  status: LogStatus;
  timing?: PrayerTiming | null;
  location_mode?: LocationMode | null;
  has_rawatib: boolean;
  has_dzikir: boolean;
  notes?: string | null;
  stars_awarded: number;
  verified_by?: string | null;
  verified_at?: string | null;
  created_at: string;
  activity?: Activity;
}

export interface RewardPledge {
  id: string;
  space_id: string;
  child_id: string;
  title: string;
  description: string | null;
  reward_type: RewardType;
  target_value: number;
  target_unit: string;
  stars_required: number;
  icon: string;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  child?: Child;
}

export interface RewardLedgerEntry {
  id: string;
  space_id: string;
  child_id: string;
  pledge_id?: string | null;
  transaction_type: TransactionType;
  amount: number;
  unit: string;
  notes?: string | null;
  created_by?: string | null;
  created_at: string;
  pledge?: RewardPledge;
  child?: Child;
}

export interface ClassSession {
  id: string;
  space_id: string;
  teacher_id: string;
  session_date: string;
  title: string;
  topic?: string | null;
  observations: string;
  next_steps?: string | null;
  attendee_child_ids: string[];
  created_at: string;
}
