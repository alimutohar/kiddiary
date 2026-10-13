'use client';

import { useState } from 'react';
import { Space, Child, RewardPledge, RewardLedgerEntry, RewardType, TransactionType } from '@/lib/types';
import { createPledge, addLedgerTransaction } from '@/app/actions/rewards';
import { Gift, Sparkles, Plus, Coins, Trophy, CheckCircle2, History, X, AlertCircle } from 'lucide-react';

interface RewardLedgerViewProps {
  space: Space;
  child: Child;
  pledges: RewardPledge[];
  ledger: {
    entries: RewardLedgerEntry[];
    summary: {
      totalEarnedIdr: number;
      totalFulfilledIdr: number;
      balanceIdr: number;
      totalGoldGramsEarned: number;
      totalGoldGramsFulfilled: number;
      goldBalance: number;
    };
  };
}

export function RewardLedgerView({
  space,
  child,
  pledges,
  ledger,
}: RewardLedgerViewProps) {
  const [showPledgeModal, setShowPledgeModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedPledge, setSelectedPledge] = useState<RewardPledge | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white">Ledger Hadiah Privat</h1>
          <p className="text-xs text-slate-400">
            Apresiasi bertahap & kompensasi riil untuk {child.nickname || child.name}
          </p>
        </div>
        <button
          onClick={() => setShowPledgeModal(true)}
          className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Janji Baru</span>
        </button>
      </div>

      {/* Saldo Kompensasi Bersih (IDR & Emas) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-4 shadow-xl">
          <div className="flex items-center gap-2 text-amber-400 mb-1">
            <Coins className="w-4 h-4" />
            <span className="text-[11px] font-bold text-slate-300">Tabungan IDR</span>
          </div>
          <div className="text-lg font-black text-amber-400">
            Rp {ledger.summary.balanceIdr.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
            <span>Masuk: Rp {ledger.summary.totalEarnedIdr.toLocaleString('id-ID')}</span>
            <span>Cair: Rp {ledger.summary.totalFulfilledIdr.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-950/40 via-slate-900 to-slate-900 border border-yellow-500/30 rounded-3xl p-4 shadow-xl">
          <div className="flex items-center gap-2 text-yellow-400 mb-1">
            <Trophy className="w-4 h-4" />
            <span className="text-[11px] font-bold text-slate-300">Tabungan Emas</span>
          </div>
          <div className="text-lg font-black text-yellow-300">
            {ledger.summary.goldBalance.toFixed(2)} gr
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
            <span>Diperoleh: {ledger.summary.totalGoldGramsEarned.toFixed(2)}g</span>
          </div>
        </div>
      </div>

      {/* Tombol Catat Transaksi Pembayaran / Realisasi Hadiah */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            setSelectedPledge(null);
            setShowTransactionModal(true);
          }}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Catat Pencairan / Tambah Saldo Riil</span>
        </button>
      </div>

      {/* Daftar Janji Hadiah Aktif */}
      <div className="space-y-2">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">
          Daftar Janji Hadiah ({pledges.length})
        </div>

        {pledges.length === 0 ? (
          <div className="text-center py-8 bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-4">
            <Gift className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">Belum ada janji hadiah yang dibuat.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {pledges.map((p) => {
              const currentStars = child.total_stars;
              const isEligible = currentStars >= p.stars_required;

              return (
                <div
                  key={p.id}
                  className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                        <Gift className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{p.title}</h4>
                        <div className="text-[11px] text-amber-300 font-semibold mt-0.5">
                          {p.reward_type === 'idr' && `Rp ${Number(p.target_value).toLocaleString('id-ID')}`}
                          {p.reward_type === 'gold_grams' && `${p.target_value} gram Emas`}
                          {p.reward_type === 'item' && 'Barang Impian'}
                          {p.reward_type === 'experience' && 'Pengalaman / Liburan'}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1 justify-end">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>{currentStars} / {p.stars_required} ⭐</span>
                      </span>
                    </div>
                  </div>

                  {p.description && (
                    <p className="text-[11px] text-slate-400 italic bg-slate-950/40 p-2 rounded-xl">
                      {p.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-xs">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isEligible
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isEligible ? '✨ Target Tercapai' : 'Sedang Berjalan'}
                    </span>

                    <button
                      onClick={() => {
                        setSelectedPledge(p);
                        setShowTransactionModal(true);
                      }}
                      className="px-3 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-semibold rounded-lg text-[11px] transition-colors cursor-pointer"
                    >
                      Kompensasikan ke Ledger
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Riwayat Ledger Transaksi */}
      <div className="space-y-2 pt-2">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">
          Riwayat Transaksi Ledger ({ledger.entries.length})
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl divide-y divide-slate-800/80 overflow-hidden">
          {ledger.entries.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500">
              Belum ada riwayat transaksi kas hadiah.
            </div>
          ) : (
            ledger.entries.map((entry) => (
              <div key={entry.id} className="p-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${
                      entry.transaction_type === 'earned' ? 'bg-emerald-400' : 'bg-amber-400'
                    }`} />
                    <span>{entry.notes || (entry.transaction_type === 'earned' ? 'Reward Masuk' : 'Pencairan Hadiah')}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {new Date(entry.created_at).toLocaleDateString('id-ID')}
                  </div>
                </div>

                <div className={`font-bold ${
                  entry.transaction_type === 'earned' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {entry.transaction_type === 'earned' ? '+' : '-'}
                  {entry.unit === 'rupiah' || entry.unit === 'idr'
                    ? `Rp ${Number(entry.amount).toLocaleString('id-ID')}`
                    : `${entry.amount} gr`}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Buat Janji Hadiah */}
      {showPledgeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
            <button
              onClick={() => setShowPledgeModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-white mb-1">Buat Janji Hadiah</h3>
            <p className="text-xs text-slate-400 mb-4">
              Reward privat untuk memotivasi anak tanpa komparasi sosial.
            </p>

            <form
              action={async (formData) => {
                setLoading(true);
                formData.append('space_id', space.id);
                formData.append('child_id', child.id);
                await createPledge(formData);
                setShowPledgeModal(false);
                setLoading(false);
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Judul Hadiah</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Misal: Tabungan Sepeda / Emas Mini"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Bentuk Reward</label>
                <select
                  name="reward_type"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none"
                >
                  <option value="idr">Uang Tunai / Tabungan (IDR)</option>
                  <option value="gold_grams">Emas Fisik (Gram / Misal: 0.01 gr)</option>
                  <option value="item">Barang / Mainan Spesial</option>
                  <option value="experience">Pengalaman / Jalan-jalan</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nilai / Nominal</label>
                  <input
                    type="number"
                    step="any"
                    name="target_value"
                    required
                    placeholder="Misal: 50000 atau 0.05"
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Satuan</label>
                  <select
                    name="target_unit"
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none"
                  >
                    <option value="rupiah">Rupiah (IDR)</option>
                    <option value="gram">Gram Emas</option>
                    <option value="item">Unit / Pcs</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Bintang yang Dibutuhkan</label>
                <input
                  type="number"
                  name="stars_required"
                  required
                  defaultValue="20"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Deskripsi & Syarat Lembut</label>
                <input
                  type="text"
                  name="description"
                  placeholder="Misal: Konsisten sholat subuh 10 hari..."
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Menyimpan...' : 'Simpan Janji Hadiah'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Transaksi Ledger */}
      {showTransactionModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
            <button
              onClick={() => setShowTransactionModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-white mb-1">Catat Mutasi Ledger</h3>
            <p className="text-xs text-slate-400 mb-4">
              Rekam kompensasi yang diperoleh atau pencairan hadiah riil.
            </p>

            <form
              action={async (formData) => {
                setLoading(true);
                formData.append('space_id', space.id);
                formData.append('child_id', child.id);
                if (selectedPledge) {
                  formData.append('pledge_id', selectedPledge.id);
                }
                await addLedgerTransaction(formData);
                setShowTransactionModal(false);
                setLoading(false);
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Jenis Transaksi</label>
                <select
                  name="transaction_type"
                  defaultValue="earned"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none"
                >
                  <option value="earned">+ Saldo Masuk (Reward Diperoleh)</option>
                  <option value="fulfilled">- Pencairan / Hadiah Diserahkan</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Jumlah</label>
                  <input
                    type="number"
                    step="any"
                    name="amount"
                    defaultValue={selectedPledge?.target_value || 10000}
                    required
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Satuan</label>
                  <select
                    name="unit"
                    defaultValue={selectedPledge?.target_unit || 'rupiah'}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none"
                  >
                    <option value="rupiah">Rupiah (IDR)</option>
                    <option value="gram">Gram Emas</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Keterangan Catatan</label>
                <input
                  type="text"
                  name="notes"
                  defaultValue={selectedPledge ? `Kompensasi: ${selectedPledge.title}` : ''}
                  placeholder="Misal: Hadiah berhasil diserahkan secara tunai"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Menyimpan...' : 'Simpan ke Ledger'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
