import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LeafSprig, LensRing, SunRays, CloudSquiggle } from "@/components/Doodles";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Get started: CarbonLens" },
      { name: "description", content: "Set up your profile so CarbonLens can estimate and track your footprint." },
    ],
  }),
  component: Onboarding,
});

type Data = {
  location: string;
  household: string;
  commute: string;
  diet: string;
  energy: string;
};

const COMMUTE = ["Car", "Public transit", "Bike", "Walk", "Mixed"];
const DIET = ["Omnivore", "Vegetarian", "Vegan", "Pescatarian"];
const ENERGY = ["Grid", "Partial renewable", "Full renewable"];

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Data>({
    location: "",
    household: "1",
    commute: "Mixed",
    diet: "Omnivore",
    energy: "Grid",
  });

  const finish = () => {
    try {
      localStorage.setItem("cl_profile", JSON.stringify(data));
    } catch {}
    navigate({ to: "/auth" });
  };
  const next = () => (step < 4 ? setStep(step + 1) : finish());
  const back = () => step > 1 && setStep(step - 1);
  const pct = (step / 4) * 100;

  return (
    <div className="relative min-h-screen px-4 py-6 sm:px-8">
      <SunRays className="pointer-events-none absolute left-6 top-24 h-16 w-16 text-[var(--leaf)] opacity-20" />
      <CloudSquiggle className="pointer-events-none absolute right-8 top-40 h-8 w-32 text-[var(--lens)] opacity-25" />
      <LensRing className="pointer-events-none absolute -bottom-10 left-10 h-48 w-48 text-[var(--lens)] opacity-15" />

      <header className="mx-auto flex max-w-2xl items-center justify-between">
        <span className="flex items-center gap-2 font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[var(--leaf)] to-[var(--lens)] text-[oklch(0.15_0.03_160)]">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="7" />
              <path d="M12 5 Q 16 9 12 19" />
            </svg>
          </span>
          CarbonLens
        </span>
        <ThemeToggle />
      </header>

      <div className="mx-auto mt-8 max-w-2xl">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>Step {step} of 4</span>
          <span>{Math.round(pct)}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--muted)]">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: "var(--gradient-progress)" }} />
        </div>

        <div className="glass-strong relative mt-6 overflow-hidden p-6 sm:p-10">
          {step === 1 && (
            <div className="relative">
              <LeafSprig className="pointer-events-none absolute -right-2 -top-2 h-16 w-16 text-[var(--leaf)] opacity-30" />
              <p className="text-sm uppercase tracking-widest text-[var(--lens)]">Welcome</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">CarbonLens</h1>
              <p className="mt-3 text-lg text-muted-foreground">Understand. Track. Reduce.</p>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
                A calm, friendly way to see your carbon footprint and shrink it with small, doable steps. No guilt, just clarity.
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold">A bit about you</h2>
              <Field label="Where do you live?">
                <input
                  value={data.location}
                  onChange={(e) => setData({ ...data, location: e.target.value })}
                  placeholder="City, Country"
                  className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-3 outline-none backdrop-blur focus:border-[var(--leaf)]"
                />
              </Field>
              <Field label="Household size">
                <input
                  type="number"
                  min={1}
                  value={data.household}
                  onChange={(e) => setData({ ...data, household: e.target.value })}
                  className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-3 outline-none backdrop-blur focus:border-[var(--leaf)]"
                />
              </Field>
              <Field label="Primary commute">
                <Pills options={COMMUTE} value={data.commute} onChange={(v) => setData({ ...data, commute: v })} />
              </Field>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold">Your lifestyle</h2>
              <Field label="Diet">
                <Pills options={DIET} value={data.diet} onChange={(v) => setData({ ...data, diet: v })} />
              </Field>
              <Field label="Home energy source">
                <Pills options={ENERGY} value={data.energy} onChange={(v) => setData({ ...data, energy: v })} />
              </Field>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold">Looks good?</h2>
              <p className="text-sm text-muted-foreground">Here's what we'll use to estimate your starting footprint.</p>
              <dl className="grid gap-3 sm:grid-cols-2">
                <Summary k="Location" v={data.location || "Not set"} />
                <Summary k="Household" v={`${data.household} ${Number(data.household) === 1 ? "person" : "people"}`} />
                <Summary k="Commute" v={data.commute} />
                <Summary k="Diet" v={data.diet} />
                <Summary k="Energy" v={data.energy} />
              </dl>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              onClick={back}
              disabled={step === 1}
              className="rounded-2xl px-5 py-2.5 text-sm font-medium text-muted-foreground transition hover:text-foreground disabled:opacity-0"
            >
              ← Back
            </button>
            <button
              onClick={next}
              className="inline-flex items-center gap-2 rounded-2xl bg-[var(--leaf)] px-6 py-3 text-sm font-semibold text-[oklch(0.15_0.03_160)] shadow-[0_10px_30px_-12px_var(--leaf)] transition hover:brightness-105"
            >
              {step === 1 ? "Get Started" : step === 4 ? "Finish Setup" : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
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

function Summary({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-3 backdrop-blur">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{k}</dt>
      <dd className="mt-1 font-medium">{v}</dd>
    </div>
  );
}
