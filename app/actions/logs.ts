'use server';

import { createClient } from '@/utils/turso/server';
import { ActivityLog, LogStatus, LocationMode, PrayerTiming } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function getDailyLogs(spaceId: string, childId: string, dateStr: string): Promise<ActivityLog[]> {
  if (!spaceId || !childId) return [];

  const database = await createClient();

  const { data, error } = await database
    .from('activity_logs')
    .select('*, activity:activities(*)')
    .eq('space_id', spaceId)
    .eq('child_id', childId)
    .eq('log_date', dateStr);

  if (error || !data) {
    return [];
  }

  return data as ActivityLog[];
}

export async function saveActivityLog(formData: FormData) {
  const spaceId = formData.get('space_id') as string;
  const childId = formData.get('child_id') as string;
  const activityId = formData.get('activity_id') as string;
  const logDate = (formData.get('log_date') as string) || new Date().toISOString().split('T')[0];
  const timing = (formData.get('timing') as PrayerTiming) || 'on_time';
  const locationMode = (formData.get('location_mode') as LocationMode) || 'jamaah_rumah';
  const hasRawatib = formData.get('has_rawatib') === 'true';
  const hasDzikir = formData.get('has_dzikir') === 'true';
  const notes = (formData.get('notes') as string) || '';
  const starAwarded = parseInt((formData.get('stars_awarded') as string) || '1', 10);
  const status = (formData.get('status') as LogStatus) || 'approved';

  if (!spaceId || !childId || !activityId) {
    return { error: 'Data pencatatan tidak lengkap.' };
  }

  const database = await createClient();
  const { data: { user } } = await database.auth.getUser();

  // Upsert log aktivitas
  const { data, error } = await database
    .from('activity_logs')
    .upsert(
      {
        space_id: spaceId,
        child_id: childId,
        activity_id: activityId,
        log_date: logDate,
        timing,
        location_mode: locationMode,
        has_rawatib: hasRawatib,
        has_dzikir: hasDzikir,
        notes,
        stars_awarded: starAwarded,
        status,
        verified_by: user?.id || null,
        verified_at: new Date().toISOString(),
      },
      { onConflict: 'child_id,activity_id,log_date' }
    )
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  // Jika approved, update total bintang anak
  if (status === 'approved') {
    // Hitung ulang total bintang anak dari activity_logs approved
    const { data: totalStarsData } = await database
      .from('activity_logs')
      .select('stars_awarded')
      .eq('child_id', childId)
      .eq('status', 'approved');

    const totalStars = (totalStarsData || []).reduce((acc: number, curr: {stars_awarded:number}) => acc + (curr.stars_awarded || 0), 0);

    await database
      .from('children')
      .update({ total_stars: totalStars })
      .eq('id', childId);
  }

  revalidatePath('/app');
  return { success: true, log: data };
}

export async function deleteActivityLog(logId: string, childId: string) {
  const database = await createClient();

  const { error } = await database.from('activity_logs').delete().eq('id', logId);

  if (error) {
    return { error: error.message };
  }

  // Recalculate stars
  const { data: totalStarsData } = await database
    .from('activity_logs')
    .select('stars_awarded')
    .eq('child_id', childId)
    .eq('status', 'approved');

  const totalStars = (totalStarsData || []).reduce((acc: number, curr: {stars_awarded:number}) => acc + (curr.stars_awarded || 0), 0);

  await database
    .from('children')
    .update({ total_stars: totalStars })
    .eq('id', childId);

  revalidatePath('/app');
  return { success: true };
}

export async function reviewActivityLog(logId: string, newStatus: LogStatus) {
  const database = await createClient();
  const { data: { user } } = await database.auth.getUser();

  const { data: log, error } = await database
    .from('activity_logs')
    .update({
      status: newStatus,
      verified_by: user?.id || null,
      verified_at: new Date().toISOString(),
    })
    .eq('id', logId)
    .select('child_id')
    .single();

  if (error) {
    return { error: error.message };
  }

  if (log?.child_id) {
    const { data: totalStarsData } = await database
      .from('activity_logs')
      .select('stars_awarded')
      .eq('child_id', log.child_id)
      .eq('status', 'approved');

    const totalStars = (totalStarsData || []).reduce((acc: number, curr: {stars_awarded:number}) => acc + (curr.stars_awarded || 0), 0);

    await database
      .from('children')
      .update({ total_stars: totalStars })
      .eq('id', log.child_id);
  }

  revalidatePath('/app');
  return { success: true };
}

export async function getLogHistory(spaceId: string, childId?: string, limit = 50): Promise<ActivityLog[]> {
  if (!spaceId) return [];

  const database = await createClient();

  let query = database
    .from('activity_logs')
    .select('*, activity:activities(*)')
    .eq('space_id', spaceId)
    .order('log_date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (childId) {
    query = query.eq('child_id', childId);
  }

  const { data, error } = await query;

  if (error || !data) {
    return [];
  }

  return data as ActivityLog[];
}
