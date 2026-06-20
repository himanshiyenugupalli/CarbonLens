import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAIPersonalizedTip } from "@/lib/ai";
import { supabase } from "@/lib/supabase";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Car, Home, Apple, ShoppingBag, Lightbulb, Plus, TrendingDown, AlertTriangle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { LeafSprig, LensRing, Wave, Sprout, GlobeDoodle } from "@/components/Doodles";
import { LogEntryModal } from "@/components/LogEntryModal";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard: CarbonLens" },
      { name: "description", content: "Your personal carbon footprint at a glance." },
    ],
  }),
  component: Dashboard,
});

const trend = [
  { w: "W1", kg: 380 }, { w: "W2", kg: 360 }, { w: "W3", kg: 410 },
  { w: "W4", kg: 340 }, { w: "W5", kg: 320 }, { w: "W6", kg: 300 },
  { w: "W7", kg: 285 }, { w: "W8", kg: 260 },
];

const categories = [
  { name: "Travel", icon: Car, kg: 520, pct: 42 },
  { name: "Home Energy", icon: Home, kg: 310, pct: 25 },
  { name: "Food", icon: Apple, kg: 248, pct: 20 },
  { name: "Shopping", icon: ShoppingBag, kg: 162, pct: 13 },
];

// Threshold above which we treat the monthly footprint as concerning
const HIGH_THRESHOLD_KG = 1500;

function Dashboard() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [editLog, setEditLog] = useState<any>(null);

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

  const { data: profile } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const { data: logs } = useQuery({
    queryKey: ["logs", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const { data } = await supabase.from("activity_logs").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  // Calculate stats from logs
  const stats = useMemo(() => {
    if (!logs) return { totalKg: 0, travelKg: 0, energyKg: 0, foodKg: 0, shoppingKg: 0, travelPct: 0, energyPct: 0, foodPct: 0, shoppingPct: 0 };
    let travel = 0, energy = 0, food = 0, shopping = 0;
    logs.forEach(log => {
      const co2 = Number(log.co2_kg) || 0;
      if (log.category === "Travel") travel += co2;
      else if (log.category === "Energy") energy += co2;
      else if (log.category === "Food") food += co2;
      else if (log.category === "Shopping") shopping += co2;
    });
    const total = travel + energy + food + shopping;
    return {
      totalKg: Math.round(total),
      travelKg: Math.round(travel),
      energyKg: Math.round(energy),
      foodKg: Math.round(food),
      shoppingKg: Math.round(shopping),
      travelPct: total > 0 ? Math.round((travel / total) * 100) : 0,
      energyPct: total > 0 ? Math.round((energy / total) * 100) : 0,
      foodPct: total > 0 ? Math.round((food / total) * 100) : 0,
      shoppingPct: total > 0 ? Math.round((shopping / total) * 100) : 0,
    };
  }, [logs]);

  const { data: aiTip, isLoading: isTipLoading } = useQuery({
    queryKey: ["ai-tip", stats],
    queryFn: () => getAIPersonalizedTip({ data: { profile: profile || {}, stats } }),
    enabled: !!profile && stats.totalKg > 0,
  });

  const isHigh = stats.totalKg > HIGH_THRESHOLD_KG;
  
  if (sessionLoading) return null;

  return (
    <AppShell>
      <section className="relative animate-fade-in">
        <LeafSprig className="pointer-events-none absolute -top-4 right-2 h-20 w-20 text-[var(--lens)] opacity-30 [animation:var(--animate-float)]" />
        <Sprout className="pointer-events-none absolute -top-2 left-4 hidden h-16 w-16 text-[var(--leaf)] opacity-25 sm:block [animation:var(--animate-float)]" />
        <div className={`glass-strong relative overflow-hidden p-6 sm:p-10 ${isHigh ? "ring-2 ring-[var(--alert)]/40" : ""}`}>
          <LensRing className="pointer-events-none absolute -bottom-10 -right-10 h-56 w-56 text-[var(--leaf)] opacity-15 [animation:var(--animate-spin-slow)]" />
          <GlobeDoodle className="pointer-events-none absolute -bottom-8 left-6 hidden h-24 w-24 text-[var(--ash)] opacity-20 sm:block" />
          <p className="text-sm text-muted-foreground">
            Good afternoon, {profile?.full_name ? profile.full_name.split(' ')[0] : 'there'} 👋
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Your footprint this month
          </h1>
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <span
              className={`bg-clip-text text-5xl font-bold text-transparent sm:text-6xl ${
                isHigh
                  ? "bg-gradient-to-r from-[var(--alert)] to-[oklch(0.55_0.22_20)]"
                  : "bg-gradient-to-r from-[var(--leaf)] to-[var(--lens)]"
              }`}
            >
              {stats.totalKg.toLocaleString()}
            </span>
            <span className="pb-2 text-lg font-medium text-muted-foreground">kg CO₂</span>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {isHigh ? (
              <div className="pill inline-flex items-center gap-2 border-[var(--alert)]/40 bg-[var(--alert)]/10 px-4 py-2 text-sm text-[var(--alert)]">
                <AlertTriangle className="h-4 w-4 [animation:var(--animate-pulse-soft)]" />
                <span className="font-medium">Above safe level</span>
                <span className="text-[var(--ash)]">let's bring it down together</span>
              </div>
            ) : (
              <div className="pill inline-flex items-center gap-2 px-4 py-2 text-sm">
                <TrendingDown className="h-4 w-4 text-[var(--leaf)]" />
                <span className="font-medium">12% below</span>
                <span className="text-muted-foreground">national average</span>
              </div>
            )}
            <button
              onClick={() => setOpen(true)}
              className="hover-scale inline-flex items-center gap-2 rounded-2xl bg-[var(--leaf)] px-5 py-2.5 text-sm font-semibold text-[oklch(0.15_0.03_160)] shadow-[0_10px_30px_-12px_var(--leaf)] transition hover:brightness-105"
            >
              <Plus className="h-4 w-4" /> Log New Activity
            </button>
          </div>
        </div>
      </section>


      <section className="mt-6 grid animate-fade-in gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { name: "Travel", icon: Car, kg: stats.travelKg, pct: stats.travelPct },
          { name: "Home Energy", icon: Home, kg: stats.energyKg, pct: stats.energyPct },
          { name: "Food", icon: Apple, kg: stats.foodKg, pct: stats.foodPct },
          { name: "Shopping", icon: ShoppingBag, kg: stats.shoppingKg, pct: stats.shoppingPct },
        ].map(({ name, icon: Icon, kg, pct }) => {
          const catHigh = kg > 450;
          return (
            <div key={name} className="glass p-5 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <span className={`grid h-10 w-10 place-items-center rounded-xl ${catHigh ? "bg-[var(--alert)]/15 text-[var(--alert)]" : "bg-gradient-to-br from-[var(--leaf)]/20 to-[var(--lens)]/20 text-[var(--moss)] dark:text-[var(--mint)]"}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className={`text-xs font-medium ${catHigh ? "text-[var(--alert)]" : "text-muted-foreground"}`}>{pct}%</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{name}</p>
              <p className="mt-1 text-2xl font-semibold">
                {kg} <span className="text-sm font-normal text-muted-foreground">kg</span>
              </p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--muted)]">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    background: catHigh
                      ? "linear-gradient(90deg, var(--alert), oklch(0.55 0.22 20))"
                      : "var(--gradient-progress)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="glass relative overflow-hidden p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">8-week trend</h2>
            <span className="text-xs text-muted-foreground">kg CO₂ / week</span>
          </div>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="#2ECC71" />
                    <stop offset="100%" stopColor="#14B8A6" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="currentColor" strokeOpacity={0.08} vertical={false} />
                <XAxis dataKey="w" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "currentColor", opacity: 0.6 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "currentColor", opacity: 0.6 }} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="kg"
                  stroke="url(#lineGrad)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#14B8A6", strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <Wave className="pointer-events-none absolute -bottom-1 left-6 h-4 w-40 text-[var(--lens)] opacity-25" />
        </div>

        <div className="glass relative overflow-hidden p-6">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[var(--leaf)] to-[var(--lens)] text-[oklch(0.15_0.03_160)]">
              <Lightbulb className="h-4 w-4" />
            </span>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Personal AI Tip
            </h3>
          </div>
          {isTipLoading ? (
            <div className="mt-4 animate-pulse space-y-2">
              <div className="h-4 w-3/4 rounded bg-[var(--glass-border)]"></div>
              <div className="h-4 w-5/6 rounded bg-[var(--glass-border)]"></div>
              <div className="h-4 w-2/3 rounded bg-[var(--glass-border)]"></div>
            </div>
          ) : (
            <p className="mt-4 text-lg font-medium leading-snug">
              {aiTip || "Try swapping two short car trips for a walk or bike ride, you could save around 8 kg CO₂ this week."}
            </p>
          )}
          <Link
            to="/onboarding"
            className="mt-5 inline-flex text-sm font-medium text-[var(--lens)] hover:underline"
          >
            Tune your profile →
          </Link>
          <LeafSprig className="pointer-events-none absolute -bottom-4 -right-4 h-24 w-24 text-[var(--leaf)] opacity-20" />
        </div>
      </section>

      <section className="mt-8 animate-fade-in">
        <h2 className="text-xl font-semibold tracking-tight">Recent Activities</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {logs?.map((log) => (
            <div 
              key={log.id} 
              onClick={() => setEditLog(log)} 
              className="glass hover-scale flex cursor-pointer items-center justify-between p-4 transition"
              title="Click to edit"
            >
              <div>
                <p className="font-medium text-foreground capitalize">{log.category} - {log.subtype}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {log.amount} {log.unit} • {log.log_date}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-[var(--alert)]">{log.co2_kg} <span className="text-xs font-normal">kg CO₂</span></p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground opacity-70">Edit</p>
              </div>
            </div>
          ))}
          {(!logs || logs.length === 0) && (
            <p className="text-sm text-muted-foreground col-span-full">No activities logged yet.</p>
          )}
        </div>
      </section>

      <LogEntryModal 
        open={open || !!editLog} 
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) setEditLog(null);
        }} 
        editLog={editLog} 
      />
    </AppShell>
  );
}
