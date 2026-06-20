import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/lib/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut, Download, Trash2, Bell } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings: CarbonLens" },
      { name: "description", content: "Manage application preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  useEffect(() => {
    if (!sessionLoading && !session) {
      navigate({ to: "/auth" });
    }
  }, [session, sessionLoading, navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    queryClient.clear();
    navigate({ to: "/auth" });
  };

  if (sessionLoading) return <AppShell><div className="animate-pulse">Loading...</div></AppShell>;

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl animate-fade-in">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">App Settings</h1>
          <p className="mt-2 text-sm text-muted-foreground">Manage your application preferences and data.</p>
        </div>

        <div className="glass-strong overflow-hidden p-6 sm:p-10 space-y-8">
          
          <section>
            <h2 className="text-lg font-semibold border-b border-[var(--glass-border)] pb-2 mb-4">Preferences</h2>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium flex items-center gap-2"><Bell className="w-4 h-4" /> Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive weekly footprint summaries</p>
              </div>
              <button className="rounded-full bg-[var(--leaf)] w-10 h-6 p-1 flex justify-end">
                <span className="bg-white rounded-full w-4 h-4 shadow"></span>
              </button>
            </div>
            {/* The theme toggle is in the AppShell header natively, no need to duplicate complex logic here */}
          </section>

          <section>
            <h2 className="text-lg font-semibold border-b border-[var(--glass-border)] pb-2 mb-4">Data & Privacy</h2>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[var(--glass-border)] transition border border-[var(--glass-border)] text-sm font-medium">
                <span className="flex items-center gap-2"><Download className="w-4 h-4 text-muted-foreground"/> Export My Data</span>
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[var(--alert)]/10 transition border border-[var(--alert)]/20 text-sm font-medium text-[var(--alert)]">
                <span className="flex items-center gap-2"><Trash2 className="w-4 h-4"/> Delete Account</span>
              </button>
            </div>
          </section>

          <section className="pt-4 border-t border-[var(--glass-border)]">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[var(--ash)] px-6 py-3 text-sm font-semibold text-white shadow transition hover:brightness-105"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </section>

        </div>
      </div>
    </AppShell>
  );
}
