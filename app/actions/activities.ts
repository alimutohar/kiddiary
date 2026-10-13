'use server';

import { createClient } from '@/utils/turso/server';
import { Activity, ActivityCategorySlug, PrayerName } from '@/lib/types';
import { DEFAULT_ACTIVITIES } from '@/lib/constants';
import { revalidatePath } from 'next/cache';

export async function getActivities(spaceId: string): Promise<Activity[]> {
  if (!spaceId) return [];

  const database = await createClient();

  const { data, error } = await database
    .from('activities')
    .select('*')
    .eq('space_id', spaceId)
    .order('sort_order', { ascending: true });

  if (error || !data || data.length === 0) {
    // Jika belum ada aktivitas di ruang ini, auto-seed template default
    return await seedDefaultActivities(spaceId);
  }

  return data as Activity[];
}

export async function seedDefaultActivities(spaceId: string): Promise<Activity[]> {
  const database = await createClient();

  const activitiesToInsert = DEFAULT_ACTIVITIES.map((item) => ({
    space_id: spaceId,
    title: item.title,
    category_slug: item.category_slug,
    description: item.description,
    star_reward: item.star_reward,
    icon: item.icon,
    is_prayer_5_times: item.is_prayer_5_times,
    prayer_name: item.prayer_name || null,
    sort_order: item.sort_order,
    is_active: true,
  }));

  const { data, error } = await database
    .from('activities')
    .insert(activitiesToInsert)
    .select();

  if (error || !data) {
    return [];
  }

  return data as Activity[];
}

export async function createActivity(formData: FormData) {
  const spaceId = formData.get('space_id') as string;
  const title = formData.get('title') as string;
  const categorySlug = (formData.get('category_slug') as ActivityCategorySlug) || 'custom';
  const description = formData.get('description') as string;
  const starReward = parseInt((formData.get('star_reward') as string) || '1', 10);
  const icon = (formData.get('icon') as string) || 'sparkles';
  const isPrayer = formData.get('is_prayer_5_times') === 'true';
  const prayerName = (formData.get('prayer_name') as PrayerName) || null;

  if (!spaceId || !title) {
    return { error: 'Judul aktivitas dan ruang wajib diisi.' };
  }

  const database = await createClient();

  const { data, error } = await database
    .from('activities')
    .insert({
      space_id: spaceId,
      title,
      category_slug: categorySlug,
      description: description || null,
      star_reward: starReward,
      icon,
      is_prayer_5_times: isPrayer,
      prayer_name: prayerName,
      sort_order: 99,
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/app');
  return { success: true, activity: data };
}

export async function toggleActivityStatus(activityId: string, isActive: boolean) {
  const database = await createClient();

  const { error } = await database
    .from('activities')
    .update({ is_active: isActive })
    .eq('id', activityId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/app');
  return { success: true };
}
