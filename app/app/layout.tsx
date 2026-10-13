import { createClient } from '@/utils/turso/server';
import { redirect } from 'next/navigation';
import { getUserSpaces } from '@/app/actions/spaces';
import { getChildren } from '@/app/actions/children';
import { AppHeader } from '@/components/app/app-header';
import { BottomNav } from '@/components/app/bottom-nav';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const database = await createClient();
  const { data: { user } } = await database.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { spaces, activeSpace } = await getUserSpaces();
  const { children: childrenList, activeChild } = activeSpace
    ? await getChildren(activeSpace.id)
    : { children: [], activeChild: null };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-full max-w-lg h-80 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col flex-1 pb-24">
        <AppHeader
          spaces={spaces}
          activeSpace={activeSpace}
          childrenList={childrenList}
          activeChild={activeChild}
        />
        <main className="max-w-md mx-auto w-full px-4 pt-4 flex-1">
          {children}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
