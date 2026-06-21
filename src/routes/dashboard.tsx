import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAIPersonalizedTip, getAIEnvironmentalNews } from "@/lib/ai";
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
import { Car, Home, Apple, ShoppingBag, Lightbulb, Plus, TrendingDown, AlertTriangle, Leaf, Globe } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { LogEntryModal } from "@/components/LogEntryModal";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw redirect({ to: "/auth", replace: true });
    }
  },
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

const HIGH_THRESHOLD_KG = 1500;

function Dashboard() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [editLog, setEditLog] = useState<ActivityLog | null>(null);

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
    staleTime: Infinity,
  });

  const { data: aiNews, isLoading: isNewsLoading } = useQuery({
    queryKey: ["ai-news"],
    queryFn: () => getAIEnvironmentalNews(),
    staleTime: Infinity,
  });

  const isHigh = stats.totalKg > HIGH_THRESHOLD_KG;
  
  if (sessionLoading) return null;

  return (
    <AppShell>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in pb-8">
        
        {/* HERO / TOTAL - 2 columns */}
        <section className={`glass-strong col-span-1 md:col-span-2 relative p-8 sm:p-10 flex flex-col justify-between ${isHigh ? "ring-2 ring-[var(--alert)]/40" : ""}`}>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              Overview
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Hello, {profile?.full_name ? profile.full_name.split(' ')[0] : 'there'}
            </h1>
          </div>
          
          <div className="mt-10 mb-6 flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground">This month's footprint</span>
            <div className="flex items-baseline gap-2">
              <span className={`text-6xl sm:text-7xl font-bold tracking-tighter ${isHigh ? "text-[var(--alert)]" : "text-foreground"}`}>
                {stats.totalKg.toLocaleString()}
              </span>
              <span className="text-xl font-medium text-muted-foreground">kg CO₂</span>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-4">
            {isHigh ? (
              <div className="inline-flex items-center gap-2 text-sm text-[var(--alert)]">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-semibold">Above safe level. Let's bring it down.</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 text-sm">
                <TrendingDown className="h-5 w-5 text-[var(--leaf)]" />
                <span className="font-semibold text-foreground">12% below national average</span>
              </div>
            )}
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--leaf)] px-6 py-3 text-sm font-semibold text-[oklch(0.96_0.02_130)] shadow-sm transition hover:opacity-90"
            >
              <Plus className="h-4 w-4" /> Log Activity
            </button>
          </div>
        </section>

        {/* AI TIP - 1 column */}
        <section className="glass col-span-1 p-8 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--background)] text-[var(--foreground)] shadow-sm border border-[var(--border)]">
              <Lightbulb className="h-5 w-5" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">AI Insight</span>
          </div>
          
          <div className="flex-grow flex flex-col justify-center py-4">
            {isTipLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 w-full rounded bg-[var(--muted)]"></div>
                <div className="h-4 w-5/6 rounded bg-[var(--muted)]"></div>
                <div className="h-4 w-4/6 rounded bg-[var(--muted)]"></div>
              </div>
            ) : (
              <p className="text-xl font-medium leading-relaxed tracking-tight text-foreground">
                {aiTip || "Try swapping two short car trips for a walk or bike ride, you could save around 8 kg CO₂ this week."}
              </p>
            )}
          </div>

          <Link
            to="/onboarding"
            className="mt-4 text-sm font-semibold text-[var(--lens)] hover:text-foreground transition flex items-center gap-1"
          >
            Tuning with your info... &rarr;
          </Link>
        </section>

        {/* CATEGORIES - 3 columns */}
        <section className="col-span-1 md:col-span-3 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: "Travel", icon: Car, kg: stats.travelKg, pct: stats.travelPct },
            { name: "Home Energy", icon: Home, kg: stats.energyKg, pct: stats.energyPct },
            { name: "Food", icon: Apple, kg: stats.foodKg, pct: stats.foodPct },
            { name: "Shopping", icon: ShoppingBag, kg: stats.shoppingKg, pct: stats.shoppingPct },
          ].map(({ name, icon: Icon, kg, pct }) => {
            const catHigh = kg > 450;
            return (
              <div key={name} className="glass p-6 transition hover:border-[var(--leaf)]">
                <div className="flex items-center justify-between">
                  <Icon className={`h-6 w-6 ${catHigh ? "text-[var(--alert)]" : "text-muted-foreground"}`} />
                  <span className={`text-xs font-bold tracking-wider ${catHigh ? "text-[var(--alert)]" : "text-muted-foreground"}`}>{pct}%</span>
                </div>
                <p className="mt-6 text-sm font-semibold text-muted-foreground uppercase tracking-wider">{name}</p>
                <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">
                  {kg} <span className="text-sm font-medium text-muted-foreground">kg</span>
                </p>
                <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--muted)]">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${catHigh ? "bg-[var(--alert)]" : "bg-[var(--leaf)]"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </section>

        {/* TREND CHART - 2 columns */}
        <section className="glass col-span-1 md:col-span-2 p-8 min-h-[320px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-semibold tracking-tight">8-Week Trend</h2>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">kg CO₂ / week</span>
          </div>
          <div className="flex-grow w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="currentColor" strokeOpacity={0.05} vertical={false} />
                <XAxis dataKey="w" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "currentColor", opacity: 0.5 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "currentColor", opacity: 0.5 }} />
                <Tooltip
                  contentStyle={{
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="kg"
                  stroke="var(--leaf)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "var(--leaf)", strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* PLEDGES - 1 column */}
        <section className="glass col-span-1 p-8">
          <h2 className="text-lg font-semibold tracking-tight mb-6 flex items-center gap-2">
            <Leaf className="h-5 w-5 text-[var(--leaf)]"/> Action Pledges
          </h2>
          <div className="space-y-5">
            {['Meatless Monday', 'Bike or walk to work', 'Unplug idle electronics', 'Use reusable bags'].map(pledge => (
              <label key={pledge} className="flex items-start gap-4 cursor-pointer group">
                <input type="checkbox" className="mt-0.5 w-5 h-5 accent-[var(--leaf)] rounded border-[var(--border)] bg-[var(--background)] transition" />
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition">{pledge}</span>
              </label>
            ))}
          </div>
        </section>

        {/* RECENT ACTIVITIES - 2 columns */}
        <section className="col-span-1 md:col-span-2 glass p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold tracking-tight">Recent Activities</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {logs?.slice(0, 6).map((log) => (
              <div 
                key={log.id} 
                onClick={() => setEditLog(log)} 
                className="group flex cursor-pointer items-center justify-between rounded-xl border border-transparent p-3 transition hover:bg-[var(--background)] hover:border-[var(--border)]"
              >
                <div>
                  <p className="font-semibold text-foreground capitalize">{log.category}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {log.amount} {log.unit} • {log.subtype}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[var(--alert)]">{log.co2_kg} <span className="text-xs font-medium text-muted-foreground">kg CO₂</span></p>
                </div>
              </div>
            ))}
            {(!logs || logs.length === 0) && (
              <p className="text-sm text-muted-foreground col-span-full">No activities logged yet.</p>
            )}
          </div>
        </section>

        {/* NEWS - 1 column */}
        <section className="col-span-1 glass p-8">
           <h2 className="text-lg font-semibold tracking-tight mb-6 flex items-center gap-2">
            <Globe className="h-5 w-5 text-[var(--lens)]"/> Environmental News
          </h2>
          <div className="space-y-6 mt-2">
            {isNewsLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-20 rounded-xl bg-[var(--background)]"></div>
                <div className="h-20 rounded-xl bg-[var(--background)]"></div>
              </div>
            ) : aiNews && Array.isArray(aiNews) ? (
              aiNews.map((news: any, idx: number) => (
                <div key={idx} className="border-t border-[var(--border)] pt-4 first:border-0 first:pt-0">
                  <p className={`text-xs font-bold mb-1 tracking-widest uppercase ${idx % 2 === 0 ? 'text-[var(--lens)]' : 'text-[var(--leaf)]'}`}>{news.category || "Awareness"}</p>
                  <h3 className="text-sm font-semibold text-foreground leading-snug">{news.title}</h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{news.description}</p>
                </div>
              ))
            ) : (
              <>
                <div className="border-t border-[var(--border)] pt-4 first:border-0 first:pt-0">
                  <p className="text-xs font-bold text-[var(--lens)] mb-1 tracking-widest uppercase">Global Trends</p>
                  <h3 className="text-sm font-semibold text-foreground leading-snug">Renewable energy passes 30% of global electricity</h3>
                </div>
                <div className="border-t border-[var(--border)] pt-4">
                  <p className="text-xs font-bold text-[var(--leaf)] mb-1 tracking-widest uppercase">Awareness</p>
                  <h3 className="text-sm font-semibold text-foreground leading-snug">The "Reduce, Reuse, Refill" Initiative</h3>
                </div>
              </>
            )}
          </div>
        </section>

      </div>

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
