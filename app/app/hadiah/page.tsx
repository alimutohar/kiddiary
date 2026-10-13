import { getUserSpaces } from '@/app/actions/spaces';
import { getChildren } from '@/app/actions/children';
import { getPledges, getLedger } from '@/app/actions/rewards';
import { RewardLedgerView } from '@/components/app/reward-ledger-view';
import { ShieldAlert } from 'lucide-react';

export default async function HadiahPage() {
  const { activeSpace } = await getUserSpaces();

  if (!activeSpace) {
    return <div className="text-center py-12 text-slate-400">Pilih ruang terlebih dahulu.</div>;
  }

  // ISOLASI KETAT: Ruang Pendidikan tidak boleh mengakses Hadiah Keluarga
  if (activeSpace.space_type !== 'family') {
    return (
      <div className="text-center py-12 bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
        <ShieldAlert className="w-10 h-10 text-amber-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-white mb-1">Akses Privat Terisolasi</h3>
        <p className="text-xs text-slate-400 max-w-xs mx-auto">
          Modul janji hadiah & ledger finansial hanya tersedia untuk Ruang Keluarga dan tidak dapat diakses oleh guru di Ruang Pendidikan.
        </p>
      </div>
    );
  }

  const { activeChild } = await getChildren(activeSpace.id);

  if (!activeChild) {
    return (
      <div className="text-center py-12 bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
        <p className="text-xs text-slate-400">Pilih atau buat profil anak terlebih dahulu.</p>
      </div>
    );
  }

  const pledges = await getPledges(activeSpace.id, activeChild.id);
  const ledger = await getLedger(activeSpace.id, activeChild.id);

  return (
    <RewardLedgerView
      space={activeSpace}
      child={activeChild}
      pledges={pledges}
      ledger={ledger}
    />
  );
}
