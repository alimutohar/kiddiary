'use server';

import { createClient } from '@/utils/turso/server';
import { ClassSession } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function getClassSessions(spaceId: string): Promise<ClassSession[]> {
  if (!spaceId) return [];

  const database = await createClient();

  const { data, error } = await database
    .from('class_sessions')
    .select('*')
    .eq('space_id', spaceId)
    .order('session_date', { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as ClassSession[];
}

export async function createClassSession(formData: FormData) {
  const spaceId = formData.get('space_id') as string;
  const sessionDate = (formData.get('session_date') as string) || new Date().toISOString().split('T')[0];
  const title = formData.get('title') as string;
  const topic = formData.get('topic') as string;
  const observations = formData.get('observations') as string;
  const nextSteps = formData.get('next_steps') as string;
  const attendeeChildIdsStr = (formData.get('attendee_child_ids') as string) || '';

  const attendeeChildIds = attendeeChildIdsStr
    ? attendeeChildIdsStr.split(',').filter(Boolean)
    : [];

  if (!spaceId || !title || !observations) {
    return { error: 'Judul sesi dan observasi kelas wajib diisi.' };
  }

  const database = await createClient();
  const { data: { user } } = await database.auth.getUser();

  if (!user) {
    return { error: 'Pengguna tidak terautentikasi.' };
  }

  const { data, error } = await database
    .from('class_sessions')
    .insert({
      space_id: spaceId,
      teacher_id: user.id,
      session_date: sessionDate,
      title,
      topic: topic || null,
      observations,
      next_steps: nextSteps || null,
      attendee_child_ids: attendeeChildIds,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/app');
  return { success: true, session: data };
}

export async function deleteClassSession(sessionId: string) {
  const database = await createClient();

  const { error } = await database.from('class_sessions').delete().eq('id', sessionId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/app');
  return { success: true };
}
