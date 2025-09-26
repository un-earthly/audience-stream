import { DashboardNav } from "./dashboard-nav";
import { DashboardSidebar } from "./dashboard-sidebar";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <DashboardNav />
        <div className="h-[calc(100vh-4.5rem)] lg:flex lg:flex-row flex flex-col">
          <div className="hidden lg:block">
            <DashboardSidebar />
          </div>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}