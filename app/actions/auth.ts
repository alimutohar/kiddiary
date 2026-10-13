'use server';
import { client } from '@/db';

import { createClient } from '@/utils/turso/server';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const database = await createClient();

  const { error } = await database.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect('/app');
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;
  const preferredRole = formData.get('role') === 'teacher' ? 'teacher' : 'parent';
  const database = await createClient();

  const { data, error } = await database.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        preferred_role: preferredRole,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Jika user langsung terverifikasi atau auto-confirmed
  if (data?.user) {
    // Inisialisasi ruang pertama (Ruang Keluarga default)
    const spaceName = preferredRole === 'teacher' ? 'Kelas Belajar' : 'Keluarga Bahagia';
    const spaceType = preferredRole === 'teacher' ? 'classroom' : 'family';
    
    await client.execute({sql:'INSERT INTO spaces(id,owner_id,name,space_type,description) VALUES(?,?,?,?,?)',args:[crypto.randomUUID(),data.user.id,spaceName,spaceType,preferredRole==='teacher'?'Ruang Observasi Siswa':'Ruang Tumbuh Kembang Anak']});
  }

  redirect('/app');
}

export async function signout() {
  const database = await createClient();
  await database.auth.signOut();
  redirect('/login');
}
