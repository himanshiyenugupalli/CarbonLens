import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LeafSprig, LensRing, SunRays } from "@/components/Doodles";
import { ThemeToggle } from "@/components/ThemeToggle";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in: CarbonLens" },
      { name: "description", content: "Sign in or create your CarbonLens account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password || (mode === "signup" && !name)) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } }
        });
        if (error) throw error;

        if (data.user) {
          try {
            const stored = localStorage.getItem("cl_profile");
            if (stored) {
              const parsed = JSON.parse(stored);
              await supabase.from("profiles").update({
                full_name: name,
                location: parsed.location,
                household_size: parseInt(parsed.household, 10) || 1,
                commute_mode: parsed.commute,
                diet_type: parsed.diet,
                energy_source: parsed.energy
              }).eq("id", data.user.id);
              localStorage.removeItem("cl_profile");
            }
          } catch (e) {
            console.error("Failed to hydrate profile", e);
          }
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/dashboard' } });
  };

  return (
    <div className="relative min-h-screen px-4 py-6 sm:px-8">
      <SunRays className="pointer-events-none absolute left-6 top-24 h-16 w-16 text-[var(--leaf)] opacity-20" />
      <LensRing className="pointer-events-none absolute -bottom-10 right-6 h-56 w-56 text-[var(--lens)] opacity-15" />
      <LeafSprig className="pointer-events-none absolute left-8 bottom-12 h-20 w-20 text-[var(--leaf)] opacity-25" />

      <header className="mx-auto flex max-w-2xl items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[var(--leaf)] to-[var(--lens)] text-[oklch(0.15_0.03_160)]">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="7" />
              <path d="M12 5 Q 16 9 12 19" />
            </svg>
          </span>
          CarbonLens
        </Link>
        <ThemeToggle />
      </header>

      <main className="mx-auto mt-10 max-w-md">
        <div className="glass-strong relative overflow-hidden p-6 sm:p-8">
          <p className="text-sm uppercase tracking-widest text-[var(--lens)]">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            {mode === "signin" ? "Sign in" : "Sign up"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Pick up where you left off."
              : "Start tracking your footprint in under a minute."}
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <Field label="Name">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex"
                  className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-3 outline-none backdrop-blur focus:border-[var(--leaf)]"
                />
              </Field>
            )}
            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-3 outline-none backdrop-blur focus:border-[var(--leaf)]"
              />
            </Field>
            <Field label="Password">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-3 outline-none backdrop-blur focus:border-[var(--leaf)]"
              />
            </Field>

            {error && <p className="text-sm text-[var(--lens)]">{error}</p>}

            <button
              type="submit"
              className="w-full rounded-2xl bg-[var(--leaf)] px-6 py-3 text-sm font-semibold text-[oklch(0.15_0.03_160)] shadow-[0_10px_30px_-12px_var(--leaf)] transition hover:brightness-105"
            >
              {mode === "signin" ? "Sign in" : "Create account"}
            </button>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-[var(--glass-border)]"></div>
              <span className="flex-shrink-0 px-4 text-xs text-muted-foreground">or</span>
              <div className="flex-grow border-t border-[var(--glass-border)]"></div>
            </div>

            <button
              type="button"
              onClick={signInWithGoogle}
              className="w-full rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-6 py-3 text-sm font-semibold backdrop-blur transition hover:bg-[var(--glass-border)] flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
              Continue with Google
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "New to CarbonLens?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="font-medium text-[var(--lens)] hover:underline"
            >
              {mode === "signin" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
