'use server';

import { createClient } from '@/utils/turso/server';
import { RewardPledge, RewardLedgerEntry, RewardType, TransactionType } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function getPledges(spaceId: string, childId?: string): Promise<RewardPledge[]> {
  if (!spaceId) return [];

  const database = await createClient();

  let query = database
    .from('rewards_pledges')
    .select('*, child:children(*)')
    .eq('space_id', spaceId)
    .order('created_at', { ascending: false });

  if (childId) {
    query = query.eq('child_id', childId);
  }

  const { data, error } = await query;

  if (error || !data) {
    return [];
  }

  return data as RewardPledge[];
}

export async function createPledge(formData: FormData) {
  const spaceId = formData.get('space_id') as string;
  const childId = formData.get('child_id') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const rewardType = (formData.get('reward_type') as RewardType) || 'idr';
  const targetValue = parseFloat((formData.get('target_value') as string) || '0');
  const targetUnit = (formData.get('target_unit') as string) || 'rupiah';
  const starsRequired = parseInt((formData.get('stars_required') as string) || '10', 10);
  const icon = (formData.get('icon') as string) || 'gift';

  if (!spaceId || !childId || !title) {
    return { error: 'Form janji hadiah tidak lengkap.' };
  }

  const database = await createClient();

  const { data, error } = await database
    .from('rewards_pledges')
    .insert({
      space_id: spaceId,
      child_id: childId,
      title,
      description: description || null,
      reward_type: rewardType,
      target_value: targetValue,
      target_unit: targetUnit,
      stars_required: starsRequired,
      icon,
      status: 'active',
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/app');
  return { success: true, pledge: data };
}

export async function getLedger(spaceId: string, childId?: string): Promise<{
  entries: RewardLedgerEntry[];
  summary: {
    totalEarnedIdr: number;
    totalFulfilledIdr: number;
    balanceIdr: number;
    totalGoldGramsEarned: number;
    totalGoldGramsFulfilled: number;
    goldBalance: number;
  };
}> {
  if (!spaceId) {
    return {
      entries: [],
      summary: {
        totalEarnedIdr: 0,
        totalFulfilledIdr: 0,
        balanceIdr: 0,
        totalGoldGramsEarned: 0,
        totalGoldGramsFulfilled: 0,
        goldBalance: 0,
      },
    };
  }

  const database = await createClient();

  let query = database
    .from('rewards_ledger')
    .select('*, pledge:rewards_pledges(*), child:children(*)')
    .eq('space_id', spaceId)
    .order('created_at', { ascending: false });

  if (childId) {
    query = query.eq('child_id', childId);
  }

  const { data, error } = await query;

  if (error || !data) {
    return {
      entries: [],
      summary: {
        totalEarnedIdr: 0,
        totalFulfilledIdr: 0,
        balanceIdr: 0,
        totalGoldGramsEarned: 0,
        totalGoldGramsFulfilled: 0,
        goldBalance: 0,
      },
    };
  }

  const entries = data as RewardLedgerEntry[];

  let totalEarnedIdr = 0;
  let totalFulfilledIdr = 0;
  let totalGoldGramsEarned = 0;
  let totalGoldGramsFulfilled = 0;

  entries.forEach((e) => {
    const val = Number(e.amount) || 0;
    if (e.unit === 'rupiah' || e.unit === 'idr') {
      if (e.transaction_type === 'earned') totalEarnedIdr += val;
      if (e.transaction_type === 'fulfilled') totalFulfilledIdr += val;
    } else if (e.unit === 'gram' || e.unit === 'gold_grams') {
      if (e.transaction_type === 'earned') totalGoldGramsEarned += val;
      if (e.transaction_type === 'fulfilled') totalGoldGramsFulfilled += val;
    }
  });

  return {
    entries,
    summary: {
      totalEarnedIdr,
      totalFulfilledIdr,
      balanceIdr: Math.max(0, totalEarnedIdr - totalFulfilledIdr),
      totalGoldGramsEarned,
      totalGoldGramsFulfilled,
      goldBalance: Math.max(0, totalGoldGramsEarned - totalGoldGramsFulfilled),
    },
  };
}

export async function addLedgerTransaction(formData: FormData) {
  const spaceId = formData.get('space_id') as string;
  const childId = formData.get('child_id') as string;
  const pledgeId = (formData.get('pledge_id') as string) || null;
  const transactionType = formData.get('transaction_type') as TransactionType;
  const amount = parseFloat((formData.get('amount') as string) || '0');
  const unit = (formData.get('unit') as string) || 'rupiah';
  const notes = (formData.get('notes') as string) || '';

  if (!spaceId || !childId || !transactionType || amount <= 0) {
    return { error: 'Mohon isi data transaksi dengan valid.' };
  }

  const database = await createClient();
  const { data: { user } } = await database.auth.getUser();

  const { data, error } = await database
    .from('rewards_ledger')
    .insert({
      space_id: spaceId,
      child_id: childId,
      pledge_id: pledgeId,
      transaction_type: transactionType,
      amount,
      unit,
      notes,
      created_by: user?.id || null,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/app');
  return { success: true, entry: data };
}
