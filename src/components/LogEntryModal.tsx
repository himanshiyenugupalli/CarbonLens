import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plane, Zap, UtensilsCrossed, ShoppingBag } from "lucide-react";

type Category = "Travel" | "Energy" | "Food" | "Shopping";
const CATS: { key: Category; icon: typeof Plane }[] = [
  { key: "Travel", icon: Plane },
  { key: "Energy", icon: Zap },
  { key: "Food", icon: UtensilsCrossed },
  { key: "Shopping", icon: ShoppingBag },
];

export function LogEntryModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [cat, setCat] = useState<Category>("Travel");
  const today = new Date().toISOString().slice(0, 10);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong max-w-lg border-0 p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Log a new activity</DialogTitle>
        </DialogHeader>

        <div className="mt-2 flex flex-wrap gap-2">
          {CATS.map(({ key, icon: Icon }) => {
            const active = cat === key;
            return (
              <button
                key={key}
                onClick={() => setCat(key)}
                className={`pill ${active ? "pill-active" : ""} inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium`}
              >
                <Icon className="h-3.5 w-3.5" /> {key}
              </button>
            );
          })}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onOpenChange(false);
          }}
          className="mt-5 space-y-4"
        >
          {cat === "Travel" && (
            <>
              <Field label="Mode">
                <Select options={["Car", "Bus", "Train", "Flight", "Bike"]} />
              </Field>
              <Field label="Distance (km)">
                <Input type="number" placeholder="e.g. 12" />
              </Field>
            </>
          )}
          {cat === "Energy" && (
            <>
              <Field label="Type">
                <Select options={["Electricity", "Gas"]} />
              </Field>
              <div className="grid grid-cols-[minmax(0,1fr)_7rem] gap-3">
                <Field label="Usage">
                  <Input type="number" placeholder="e.g. 220" />
                </Field>
                <Field label="Unit">
                  <Select options={["kWh", "therms"]} />
                </Field>
              </div>
            </>
          )}
          {cat === "Food" && (
            <>
              <Field label="Meal type">
                <Select options={["Meat-heavy", "Vegetarian", "Vegan"]} />
              </Field>
              <Field label="Number of meals">
                <Input type="number" placeholder="e.g. 3" />
              </Field>
            </>
          )}
          {cat === "Shopping" && (
            <>
              <Field label="Category">
                <Select options={["Clothing", "Electronics", "Other"]} />
              </Field>
              <Field label="Approx. spend">
                <Input type="number" placeholder="e.g. 50" />
              </Field>
            </>
          )}

          <Field label="Date">
            <Input type="date" defaultValue={today} />
          </Field>

          <button
            type="submit"
            className="mt-2 w-full rounded-2xl bg-[var(--leaf)] py-3 font-semibold text-[oklch(0.15_0.03_160)] shadow-[0_10px_30px_-12px_var(--leaf)] transition hover:brightness-105"
          >
            Save Entry
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-2.5 text-sm outline-none backdrop-blur transition focus:border-[var(--leaf)]"
    />
  );
}

function Select({ options }: { options: string[] }) {
  return (
    <select className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2.5 text-sm outline-none backdrop-blur transition focus:border-[var(--leaf)]">
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}
