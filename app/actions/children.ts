'use server';

import { createClient } from '@/utils/turso/server';
import { Child } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const ACTIVE_CHILD_COOKIE = 'kiddiary_active_child';

export async function getChildren(spaceId: string): Promise<{ children: Child[]; activeChild: Child | null }> {
  if (!spaceId) {
    return { children: [], activeChild: null };
  }

  const database = await createClient();

  const { data, error } = await database
    .from('children')
    .select('*')
    .eq('space_id', spaceId)
    .order('name', { ascending: true });

  if (error || !data) {
    return { children: [], activeChild: null };
  }

  const children = data as Child[];
  const cookieStore = await cookies();
  const activeChildId = cookieStore.get(ACTIVE_CHILD_COOKIE)?.value;

  const activeChild = children.find((c) => c.id === activeChildId) || children[0] || null;

  return { children, activeChild };
}

export async function setActiveChild(childId: string) {
  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_CHILD_COOKIE, childId, { path: '/', maxAge: 60 * 60 * 24 * 30 });
  revalidatePath('/app');
  return { success: true };
}

export async function createChild(formData: FormData) {
  const spaceId = formData.get('space_id') as string;
  const name = formData.get('name') as string;
  const nickname = formData.get('nickname') as string;
  const birthDate = formData.get('birth_date') as string;
  const gender = formData.get('gender') as string;
  const pinCode = formData.get('pin_code') as string;
  const notes = formData.get('notes') as string;

  if (!spaceId || !name) {
    return { error: 'Nama anak dan ruang wajib diisi.' };
  }

  const database = await createClient();

  const { data, error } = await database
    .from('children')
    .insert({
      space_id: spaceId,
      name,
      nickname: nickname || null,
      birth_date: birthDate || null,
      gender: (gender as 'male' | 'female') || null,
      pin_code: pinCode || null,
      notes: notes || null,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  if (data) {
    await setActiveChild(data.id);
  }

  revalidatePath('/app');
  return { success: true, child: data };
}

export async function updateChild(formData: FormData) {
  const childId = formData.get('child_id') as string;
  const name = formData.get('name') as string;
  const nickname = formData.get('nickname') as string;
  const birthDate = formData.get('birth_date') as string;
  const gender = formData.get('gender') as string;
  const pinCode = formData.get('pin_code') as string;
  const notes = formData.get('notes') as string;

  if (!childId || !name) {
    return { error: 'ID Anak dan nama wajib diisi.' };
  }

  const database = await createClient();

  const { error } = await database
    .from('children')
    .update({
      name,
      nickname: nickname || null,
      birth_date: birthDate || null,
      gender: (gender as 'male' | 'female') || null,
      pin_code: pinCode || null,
      notes: notes || null,
    })
    .eq('id', childId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/app');
  return { success: true };
}

export async function deleteChild(childId: string) {
  const database = await createClient();

  const { error } = await database.from('children').delete().eq('id', childId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/app');
  return { success: true };
}
