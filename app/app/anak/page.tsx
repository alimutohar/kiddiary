import { getUserSpaces } from '@/app/actions/spaces';
import { getChildren } from '@/app/actions/children';
import { ChildManager } from '@/components/app/child-manager';

export default async function AnakPage() {
  const { activeSpace } = await getUserSpaces();

  if (!activeSpace) {
    return <div className="text-center py-12 text-slate-400">Pilih ruang terlebih dahulu.</div>;
  }

  const { children: childrenList, activeChild } = await getChildren(activeSpace.id);

  return (
    <ChildManager
      space={activeSpace}
      childrenList={childrenList}
      activeChild={activeChild}
    />
  );
}
