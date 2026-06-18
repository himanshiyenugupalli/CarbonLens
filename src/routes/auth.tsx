import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LeafSprig, LensRing, SunRays } from "@/components/Doodles";
import { ThemeToggle } from "@/components/ThemeToggle";

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

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password || (mode === "signup" && !name)) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      const user = { name: name || email.split("@")[0], email };
      localStorage.setItem("cl_user", JSON.stringify(user));
    } catch {}
    navigate({ to: "/dashboard" });
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
