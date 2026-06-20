import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plane, Zap, UtensilsCrossed, ShoppingBag, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Category = "Travel" | "Energy" | "Food" | "Shopping";
const CATS: { key: Category; icon: typeof Plane }[] = [
  { key: "Travel", icon: Plane },
  { key: "Energy", icon: Zap },
  { key: "Food", icon: UtensilsCrossed },
  { key: "Shopping", icon: ShoppingBag },
];

export interface ActivityLog {
  id: string;
  user_id?: string;
  category: string;
  subtype: string;
  amount: number;
  unit: string;
  co2_kg: number;
  log_date: string;
  created_at?: string;
}

export function LogEntryModal({ open, onOpenChange, editLog }: { open: boolean; onOpenChange: (o: boolean) => void; editLog?: ActivityLog | null }) {
  const [cat, setCat] = useState<Category>("Travel");
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (open && editLog) {
      setCat(editLog.category as Category);
    } else if (open && !editLog) {
      setCat("Travel");
    }
  }, [open, editLog]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong max-w-lg border-0 p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {editLog ? "Edit Activity" : "Log a new activity"}
          </DialogTitle>
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
          onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const data = Object.fromEntries(formData.entries());
            
            try {
              const { data: sessionData } = await supabase.auth.getSession();
              if (!sessionData.session) throw new Error("Not logged in");

              let co2_kg = 0;
              // Simple mock estimation if needed
              if (cat === "Travel") co2_kg = Number(data.distance || 0) * 0.2;
              else if (cat === "Energy") co2_kg = Number(data.usage || 0) * 0.5;
              else if (cat === "Food") co2_kg = Number(data.meals || 0) * 2;
              else if (cat === "Shopping") co2_kg = Number(data.spend || 0) * 0.1;

              const entry = { 
                user_id: sessionData.session.user.id,
                category: cat,
                subtype: data.mode || data.type || data.mealType || data.category || "Unknown",
                amount: Number(data.distance || data.usage || data.meals || data.spend || 0),
                unit: cat === "Travel" ? "km" : cat === "Energy" ? data.unit : cat === "Food" ? "meals" : "$",
                co2_kg,
                log_date: data.date as string
              };
              
              if (editLog) {
                await supabase.from("activity_logs").update(entry).eq("id", editLog.id);
              } else {
                await supabase.from("activity_logs").insert(entry);
              }
              
              window.location.reload();
            } catch (err) {
              console.error("Failed to save log:", err);
            }
            onOpenChange(false);
          }}
          className="mt-5 space-y-4"
        >
          {cat === "Travel" && (
            <>
              <Field label="Mode">
                <Select name="mode" options={["Car", "Bus", "Train", "Flight", "Bike"]} defaultValue={editLog?.category === "Travel" ? editLog.subtype : "Car"} />
              </Field>
              <Field label="Distance (km)">
                <Input name="distance" type="number" placeholder="e.g. 12" defaultValue={editLog?.category === "Travel" ? editLog.amount : ""} />
              </Field>
            </>
          )}
          {cat === "Energy" && (
            <>
              <Field label="Type">
                <Select name="type" options={["Electricity", "Gas"]} defaultValue={editLog?.category === "Energy" ? editLog.subtype : "Electricity"} />
              </Field>
              <div className="grid grid-cols-[minmax(0,1fr)_7rem] gap-3">
                <Field label="Usage">
                  <Input name="usage" type="number" placeholder="e.g. 220" defaultValue={editLog?.category === "Energy" ? editLog.amount : ""} />
                </Field>
                <Field label="Unit">
                  <Select name="unit" options={["kWh", "therms"]} defaultValue={editLog?.category === "Energy" ? editLog.unit : "kWh"} />
                </Field>
              </div>
            </>
          )}
          {cat === "Food" && (
            <>
              <Field label="Meal type">
                <Select name="mealType" options={["Meat-heavy", "Vegetarian", "Vegan"]} defaultValue={editLog?.category === "Food" ? editLog.subtype : "Meat-heavy"} />
              </Field>
              <Field label="Number of meals">
                <Input name="meals" type="number" placeholder="e.g. 3" defaultValue={editLog?.category === "Food" ? editLog.amount : ""} />
              </Field>
            </>
          )}
          {cat === "Shopping" && (
            <>
              <Field label="Category">
                <Select name="category" options={["Clothing", "Electronics", "Other"]} defaultValue={editLog?.category === "Shopping" ? editLog.subtype : "Clothing"} />
              </Field>
              <Field label="Approx. spend">
                <Input name="spend" type="number" placeholder="e.g. 50" defaultValue={editLog?.category === "Shopping" ? editLog.amount : ""} />
              </Field>
            </>
          )}

          <Field label="Date">
            <Input name="date" type="date" defaultValue={editLog ? editLog.log_date : today} />
          </Field>

          <div className="flex gap-3 pt-2">
            {editLog && (
              <button
                type="button"
                onClick={async () => {
                  await supabase.from("activity_logs").delete().eq("id", editLog.id);
                  window.location.reload();
                }}
                className="rounded-2xl bg-[var(--alert)]/10 px-4 py-3 text-[var(--alert)] transition hover:bg-[var(--alert)]/20"
                title="Delete Activity"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
            <button
              type="submit"
              className="w-full rounded-2xl bg-[var(--leaf)] py-3 font-semibold text-[oklch(0.15_0.03_160)] shadow-[0_10px_30px_-12px_var(--leaf)] transition hover:brightness-105"
            >
              {editLog ? "Save Changes" : "Save Entry"}
            </button>
          </div>
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

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: string[];
}

function Select({ options, ...props }: SelectProps) {
  return (
    <select 
      {...props}
      className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2.5 text-sm outline-none backdrop-blur transition focus:border-[var(--leaf)]"
    >
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}
