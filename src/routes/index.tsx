import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

import {
  ArrowRight,
  Leaf,
  LineChart,
  Sparkles,
  Github,
  Twitter,
  Mail,
  Activity,
  Lightbulb,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import {
  LeafSprig,
  LensRing,
  SunRays,
  CloudSquiggle,
  Wave,
  Sprout,
  Mountains,
  GlobeDoodle,
  Bike,
  Recycle,
} from "@/components/Doodles";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CarbonLens: Understand. Track. Reduce." },
      { name: "description", content: "A calm, friendly personal carbon footprint tracker. See where your emissions come from and shrink them with small, kind steps." },
      { property: "og:title", content: "CarbonLens: Personal carbon footprint tracker" },
      { property: "og:description", content: "Understand. Track. Reduce." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const navigate = useNavigate();
  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  useEffect(() => {
    if (!sessionLoading && session) {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [session, sessionLoading, navigate]);

  return (
    <div className="relative min-h-screen overflow-clip">
      {/* Floating doodle field */}
      <SunRays className="pointer-events-none absolute left-6 top-24 h-20 w-20 text-[var(--leaf)] opacity-25 [animation:var(--animate-spin-slow)]" />
      <CloudSquiggle className="pointer-events-none absolute right-10 top-32 h-8 w-40 text-[var(--lens)] opacity-30 [animation:var(--animate-drift)]" />
      <LensRing className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 text-[var(--lens)] opacity-15 [animation:var(--animate-spin-slow)]" />
      <LeafSprig className="pointer-events-none absolute right-8 top-72 h-24 w-24 text-[var(--leaf)] opacity-30 [animation:var(--animate-float)]" />
      <Mountains className="pointer-events-none absolute left-1/2 top-[42rem] hidden h-20 w-72 -translate-x-1/2 text-[var(--ash)] opacity-30 sm:block" />
      <GlobeDoodle className="pointer-events-none absolute right-16 top-[28rem] h-28 w-28 text-[var(--coal)] opacity-15 dark:text-[var(--mint)] [animation:var(--animate-float)]" />
      <Bike className="pointer-events-none absolute left-8 top-[34rem] h-20 w-32 text-[var(--ash)] opacity-30 [animation:var(--animate-drift)]" />
      <Sprout className="pointer-events-none absolute left-1/3 top-[58rem] h-20 w-20 text-[var(--leaf)] opacity-25 [animation:var(--animate-float)]" />
      <Recycle className="pointer-events-none absolute right-1/4 top-[64rem] h-20 w-20 text-[var(--lens)] opacity-25 [animation:var(--animate-spin-slow)]" />

      <div className="px-4 py-6 sm:px-8">
        {/* Header */}
        <header className="sticky top-4 z-50 mx-auto flex max-w-6xl items-center justify-between glass px-6 py-3">
          <Link to="/" className="flex items-center">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#features" className="story-link hover:text-foreground">Features</a>
            <a href="#how" className="story-link hover:text-foreground">How it works</a>
            <a href="#faq" className="story-link hover:text-foreground">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/auth"
              className="rounded-2xl px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Sign in
            </Link>
            <ThemeToggle />
          </div>
        </header>

        {/* Hero */}
        <main className="mx-auto mt-16 max-w-6xl sm:mt-24">
          <section className="relative animate-fade-in text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-1 text-xs font-medium text-[var(--ash)] backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--leaf)] [animation:var(--animate-pulse-soft)]" />
              Personal carbon, kindly tracked
            </div>
            <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              <span className="text-[var(--coal)] dark:text-foreground">See your footprint</span>{" "}
              <span className="bg-gradient-to-r from-[var(--leaf)] to-[var(--lens)] bg-clip-text text-transparent">
                clearly
              </span>
              .
              <br />
              <span className="text-[var(--ash)]">Shrink it</span> gently.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
              CarbonLens turns everyday choices into a calm, encouraging picture of your impact.
              No guilt, just clarity.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/onboarding"
                className="hover-scale inline-flex items-center gap-2 rounded-2xl bg-[var(--leaf)] px-6 py-3 text-sm font-semibold text-[oklch(0.15_0.03_160)] shadow-[0_10px_30px_-12px_var(--leaf)] transition hover:brightness-105"
              >
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-6 py-3 text-sm font-semibold backdrop-blur transition hover:border-[var(--leaf)]"
              >
                I already have an account
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Free to use · No credit card · Takes 2 minutes
            </p>
          </section>

          {/* Stats strip */}
          <section className="mt-16 grid animate-fade-in gap-3 sm:grid-cols-3">
            {[
              { v: "4.6t", l: "Avg yearly footprint" },
              { v: "−18%", l: "Typical reduction in 3 months" },
              { v: "12k+", l: "Activities logged this week" },
            ].map((s) => (
              <div key={s.l} className="glass flex items-baseline justify-between p-5 hover-scale">
                <span className="text-3xl font-bold text-[var(--coal)] dark:text-foreground">
                  {s.v}
                </span>
                <span className="text-xs uppercase tracking-widest text-[var(--ash)]">{s.l}</span>
              </div>
            ))}
          </section>

          {/* Features */}
          <section id="features" className="mt-24 scroll-mt-28">
            <div className="mb-10 text-center">
              <p className="text-sm uppercase tracking-widest text-[var(--lens)]">What it does</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Built around the way you already live
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { i: Leaf, t: "Earthy & calm", d: "A friendly companion, never alarming, always encouraging." },
                { i: LineChart, t: "Clear trends", d: "Spot patterns over weeks. Celebrate small wins." },
                { i: Sparkles, t: "Tiny nudges", d: "Personalised tips that actually fit your life." },
                { i: Activity, t: "Quick log", d: "Add a trip, meal, or bill in under 10 seconds." },
                { i: ShieldCheck, t: "Private by default", d: "Your data stays with you, no creepy sharing." },
                { i: Lightbulb, t: "Honest signals", d: "We use red only when something genuinely needs a look." },
              ].map(({ i: Icon, t, d }) => (
                <div key={t} className="glass group p-6 transition hover:-translate-y-1">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[var(--leaf)]/20 to-[var(--lens)]/20 text-[var(--moss)] transition group-hover:scale-110 dark:text-[var(--mint)]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold">{t}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{d}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How it works */}
          <section id="how" className="mt-24 scroll-mt-28">
            <div className="mb-10 text-center">
              <p className="text-sm uppercase tracking-widest text-[var(--lens)]">How it works</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Three small steps, one clearer picture
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { n: "01", t: "Tell us a bit", d: "A 60-second onboarding to estimate your baseline." },
                { n: "02", t: "Log as you go", d: "Travel, food, energy, shopping, quick taps, no spreadsheets." },
                { n: "03", t: "See & shrink", d: "Trends, comparisons, and gentle nudges that actually stick." },
              ].map((s) => (
                <div key={s.n} className="glass relative overflow-hidden p-6">
                  <span className="text-5xl font-bold text-[var(--ash)]/40">{s.n}</span>
                  <h3 className="mt-2 text-lg font-semibold">{s.t}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
                  <Wave className="pointer-events-none absolute -bottom-1 left-4 h-3 w-32 text-[var(--lens)] opacity-30" />
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="mt-24 scroll-mt-28">
            <div className="mb-10 text-center">
              <p className="text-sm uppercase tracking-widest text-[var(--lens)]">FAQ</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Good questions
              </h2>
            </div>
            <div className="mx-auto grid max-w-3xl gap-3">
              {[
                { q: "Is CarbonLens free?", a: "Yes, fully free during early access. No credit card, no nags." },
                { q: "Where does my data live?", a: "Locally on your device for now. You're always in control." },
                { q: "Will it shame me?", a: "Never. We only show red when a value is genuinely far above safe averages." },
              ].map((f) => (
                <details key={f.q} className="glass group p-5">
                  <summary className="cursor-pointer list-none text-sm font-semibold">
                    <span className="mr-2 text-[var(--leaf)] group-open:hidden">+</span>
                    <span className="mr-2 hidden text-[var(--alert)] group-open:inline">–</span>
                    {f.q}
                  </summary>
                  <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="mt-24">
            <div className="glass-strong relative overflow-hidden p-8 text-center sm:p-12">
              <SunRays className="pointer-events-none absolute -left-6 -top-6 h-32 w-32 text-[var(--leaf)] opacity-20 [animation:var(--animate-spin-slow)]" />
              <GlobeDoodle className="pointer-events-none absolute -right-6 -bottom-6 h-32 w-32 text-[var(--lens)] opacity-20 [animation:var(--animate-float)]" />
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to meet your footprint?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                It's lighter than you fear, and easier to shrink than you think.
              </p>
              <Link
                to="/onboarding"
                className="hover-scale mt-6 inline-flex items-center gap-2 rounded-2xl bg-[var(--coal)] px-6 py-3 text-sm font-semibold text-[var(--mint)] transition hover:brightness-110 dark:bg-[var(--leaf)] dark:text-[oklch(0.15_0.03_160)]"
              >
                Start free <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="mx-auto mt-24 max-w-6xl border-t border-[var(--glass-border)] pt-10 pb-8">
          <div className="grid gap-8 sm:grid-cols-4">
            <div className="sm:col-span-2">
              <Logo />
              <p className="mt-3 max-w-sm text-sm text-muted-foreground">
                A kinder lens on your carbon footprint. Built with care for everyday earthlings.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--ash)]">Product</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li><a href="#features" className="story-link text-muted-foreground hover:text-foreground">Features</a></li>
                <li><a href="#how" className="story-link text-muted-foreground hover:text-foreground">How it works</a></li>
                <li><Link to="/auth" className="story-link text-muted-foreground hover:text-foreground">Sign in</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--ash)]">Connect</p>
              <ul className="mt-3 flex gap-3">
                <li><a href="#" aria-label="GitHub" className="grid h-9 w-9 place-items-center rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--ash)] transition hover:text-[var(--leaf)]"><Github className="h-4 w-4" /></a></li>
                <li><a href="#" aria-label="Twitter" className="grid h-9 w-9 place-items-center rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--ash)] transition hover:text-[var(--leaf)]"><Twitter className="h-4 w-4" /></a></li>
                <li><a href="mailto:hi@carbonlens.app" aria-label="Email" className="grid h-9 w-9 place-items-center rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--ash)] transition hover:text-[var(--leaf)]"><Mail className="h-4 w-4" /></a></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-[var(--glass-border)] pt-6 text-xs text-muted-foreground sm:flex-row">
            <p>© {new Date().getFullYear()} CarbonLens. Made with leaves & lenses.</p>
            <p>Privacy · Terms · Cookies</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
