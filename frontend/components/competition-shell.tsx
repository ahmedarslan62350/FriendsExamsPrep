import { AppSidebar } from "@/components/app-sidebar";
import { AuthGuard } from "@/components/auth-guard";
import { MobileNav } from "@/components/mobile-nav";
import { TopNavbar } from "@/components/top-navbar";

export function CompetitionShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)] px-3 pb-24 pt-3 sm:px-4 lg:pb-6">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-3 lg:flex-row lg:gap-4">
        <AppSidebar />
        <div className="min-w-0 flex-1">
          <TopNavbar />
          <main className="space-y-4">
            <AuthGuard>{children}</AuthGuard>
          </main>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
