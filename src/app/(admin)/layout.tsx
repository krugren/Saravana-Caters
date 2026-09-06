import { Sidebar } from "@/components/admin/sidebar";
import { Topbar } from "@/components/admin/topbar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import { getPendingReviewCount } from "@/features/testimonials/actions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const pendingReviews = await getPendingReviewCount().catch(() => 0);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar user={session.user as any} pendingReviews={pendingReviews} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar user={session.user as any} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
      <Toaster position="bottom-right" richColors closeButton />
    </div>
  );
}
