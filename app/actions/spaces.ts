'use server';

import { createClient } from '@/utils/turso/server';
import { Space, SpaceType } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const ACTIVE_SPACE_COOKIE = 'kiddiary_active_space';

export async function getUserSpaces(): Promise<{ spaces: Space[]; activeSpace: Space | null }> {
  const database = await createClient();
  const { data: { user } } = await database.auth.getUser();

  if (!user) {
    return { spaces: [], activeSpace: null };
  }

  // Ambil ruang milik sendiri atau ruang di mana user adalah member
  const { data: ownedSpaces } = await database
    .from('spaces')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: true });

  const { data: memberSpacesData } = await database
    .from('space_members')
    .select('space_id, spaces(*)')
    .eq('user_id', user.id);

  const memberSpaces = (memberSpacesData || [])
    .map((m: any) => m.spaces)
    .filter(Boolean) as Space[];

  const allSpacesMap = new Map<string, Space>();
  (ownedSpaces || []).forEach((s: Space) => allSpacesMap.set(s.id, s as Space));
  memberSpaces.forEach((s) => allSpacesMap.set(s.id, s as Space));

  const spaces = Array.from(allSpacesMap.values());

  // Tentukan active space dari cookie atau space pertama
  const cookieStore = await cookies();
  const activeSpaceId = cookieStore.get(ACTIVE_SPACE_COOKIE)?.value;

  let activeSpace = spaces.find((s) => s.id === activeSpaceId) || spaces[0] || null;

  // Jika belum ada ruang sama sekali, buat ruang keluarga default
  if (spaces.length === 0) {
    const { data: newSpace } = await database
      .from('spaces')
      .insert({
        owner_id: user.id,
        name: 'Keluarga Bahagia',
        space_type: 'family',
        description: 'Ruang Tumbuh Kembang & Ibadah Mandiri',
      })
      .select()
      .single();

    if (newSpace) {
      activeSpace = newSpace as Space;
      spaces.push(activeSpace);
    }
  }

  return { spaces, activeSpace };
}

export async function setActiveSpace(spaceId: string) {
  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_SPACE_COOKIE, spaceId, { path: '/', maxAge: 60 * 60 * 24 * 30 });
  revalidatePath('/app');
  return { success: true };
}

export async function createSpace(formData: FormData) {
  const name = formData.get('name') as string;
  const spaceType = (formData.get('space_type') as SpaceType) || 'family';
  const description = formData.get('description') as string;

  const database = await createClient();
  const { data: { user } } = await database.auth.getUser();

  if (!user) {
    return { error: 'Pengguna tidak terautentikasi.' };
  }

  const { data, error } = await database
    .from('spaces')
    .insert({
      owner_id: user.id,
      name,
      space_type: spaceType,
      description,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  if (data) {
    await setActiveSpace(data.id);
  }

  revalidatePath('/app');
  return { success: true, space: data };
}
