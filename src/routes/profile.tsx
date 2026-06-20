import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile: CarbonLens" },
      { name: "description", content: "Manage your personal information." },
    ],
  }),
  component: ProfilePage,
});

const COMMUTE = ["Car", "Public transit", "Bike", "Walk", "Mixed"];
const DIET = ["Omnivore", "Vegetarian", "Vegan", "Pescatarian"];
const ENERGY = ["Grid", "Partial renewable", "Full renewable"];

function ProfilePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState(false);

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

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const [formData, setFormData] = useState({
    full_name: "",
    location: "",
    household_size: "1",
    commute_mode: "Mixed",
    diet_type: "Omnivore",
    energy_source: "Grid",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        location: profile.location || "",
        household_size: String(profile.household_size || 1),
        commute_mode: profile.commute_mode || "Mixed",
        diet_type: profile.diet_type || "Omnivore",
        energy_source: profile.energy_source || "Grid",
      });
    }
  }, [profile]);

  const updateProfile = useMutation({
    mutationFn: async (newData: typeof formData) => {
      if (!session?.user?.id) throw new Error("No user");
      const { error } = await supabase.from("profiles").update({
        full_name: newData.full_name,
        location: newData.location,
        household_size: parseInt(newData.household_size, 10) || 1,
        commute_mode: newData.commute_mode,
        diet_type: newData.diet_type,
        energy_source: newData.energy_source,
      }).eq("id", session.user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  });

  if (sessionLoading || profileLoading) return <AppShell><div className="animate-pulse">Loading...</div></AppShell>;

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl animate-fade-in">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
          <p className="mt-2 text-sm text-muted-foreground">Manage your personal information and footprint baseline.</p>
        </div>

        <div className="glass-strong overflow-hidden p-6 sm:p-10">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              updateProfile.mutate(formData);
            }}
            className="space-y-6"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Full Name">
                <input
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Alex Doe"
                  className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-3 outline-none backdrop-blur focus:border-[var(--leaf)]"
                />
              </Field>
              <Field label="Location">
                <input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="City, Country"
                  className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-3 outline-none backdrop-blur focus:border-[var(--leaf)]"
                />
              </Field>
            </div>

            <Field label="Household Size">
              <input
                type="number"
                min={1}
                value={formData.household_size}
                onChange={(e) => setFormData({ ...formData, household_size: e.target.value })}
                className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-3 outline-none backdrop-blur focus:border-[var(--leaf)] sm:w-1/2"
              />
            </Field>

            <Field label="Primary commute">
              <Pills options={COMMUTE} value={formData.commute_mode} onChange={(v) => setFormData({ ...formData, commute_mode: v })} />
            </Field>

            <Field label="Diet">
              <Pills options={DIET} value={formData.diet_type} onChange={(v) => setFormData({ ...formData, diet_type: v })} />
            </Field>

            <Field label="Home energy source">
              <Pills options={ENERGY} value={formData.energy_source} onChange={(v) => setFormData({ ...formData, energy_source: v })} />
            </Field>

            <div className="mt-8 flex items-center gap-4 border-t border-[var(--glass-border)] pt-6">
              <button
                type="submit"
                disabled={updateProfile.isPending}
                className="rounded-2xl bg-[var(--leaf)] px-6 py-3 text-sm font-semibold text-[oklch(0.15_0.03_160)] shadow-[0_10px_30px_-12px_var(--leaf)] transition hover:brightness-105 disabled:opacity-50"
              >
                {updateProfile.isPending ? "Saving..." : "Save Changes"}
              </button>
              {success && <span className="text-sm font-medium text-[var(--leaf)]">Changes saved!</span>}
              {updateProfile.isError && <span className="text-sm font-medium text-[var(--alert)]">Failed to save.</span>}
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Pills({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = o === value;
        return (
          <button
            type="button"
            key={o}
            onClick={() => onChange(o)}
            className={`pill ${active ? "pill-active" : ""} px-4 py-2 text-sm font-medium`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}
