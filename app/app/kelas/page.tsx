import { getUserSpaces } from '@/app/actions/spaces';
import { getChildren } from '@/app/actions/children';
import { getClassSessions } from '@/app/actions/classroom';
import { ClassroomView } from '@/components/app/classroom-view';

export default async function KelasPage() {
  const { activeSpace } = await getUserSpaces();

  if (!activeSpace) {
    return <div className="text-center py-12 text-slate-400">Pilih ruang terlebih dahulu.</div>;
  }

  const { children: childrenList } = await getChildren(activeSpace.id);
  const sessions = await getClassSessions(activeSpace.id);

  return (
    <ClassroomView
      space={activeSpace}
      childrenList={childrenList}
      sessions={sessions}
    />
  );
}
