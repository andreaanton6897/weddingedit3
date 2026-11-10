import { MobileTabBar, MobileTopBar, Sidebar } from "@/components/app-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopBar />
        <main className="mx-auto w-full max-w-6xl flex-1 px-5 pb-32 pt-8 sm:px-8 lg:px-12 lg:pb-16 lg:pt-12">
          {children}
        </main>
      </div>
      <MobileTabBar />
    </div>
  );
}
