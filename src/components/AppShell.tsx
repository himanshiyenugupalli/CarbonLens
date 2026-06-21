import type { ReactNode } from "react";
import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "./Logo";
import { BackgroundLeaf } from "./Doodles";
import { User, LogOut, LayoutDashboard, Settings, HelpCircle, Menu, X } from "lucide-react";
import { useState } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    queryClient.clear();
    navigate({ to: "/" });
  };

  const navLinks = [
    { name: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { name: "Profile", to: "/profile", icon: User },
    { name: "Settings", to: "/settings", icon: Settings },
    { name: "Help", to: "/help", icon: HelpCircle },
  ];

  return (
    <div className="h-screen flex relative overflow-hidden">
      {/* Large animated background element */}
      <div className="pointer-events-none fixed -top-40 -right-40 h-[800px] w-[800px] text-[var(--green-accent)] opacity-10 mix-blend-multiply dark:mix-blend-screen [animation:var(--animate-leaf-sway)] z-0">
        <BackgroundLeaf className="h-full w-full" />
      </div>
      <div className="pointer-events-none fixed -bottom-40 -left-40 h-[600px] w-[600px] text-[var(--magenta-accent)] opacity-10 mix-blend-multiply dark:mix-blend-screen [animation:var(--animate-leaf-sway)] z-0" style={{ animationDelay: '-6s' }}>
        <BackgroundLeaf className="h-full w-full transform scale-x-[-1]" />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-[var(--foreground)]/10 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-[40px] transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-full flex-col px-5 py-8">
          <div className="flex items-center justify-between mb-10 pl-2">
            <Link to="/dashboard" onClick={() => setIsSidebarOpen(false)}>
              <Logo />
            </Link>
            <button 
              className="lg:hidden p-2 text-muted-foreground transition hover:text-foreground"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.name}
                  to={link.to}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-[15px] font-medium transition-all duration-300 ${
                    isActive 
                      ? "bg-gradient-to-r from-[var(--green-accent)] to-[var(--magenta-accent)] text-white shadow-md shadow-[var(--green-accent)]/20" 
                      : "text-muted-foreground hover:bg-[var(--border)] hover:text-foreground"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground"}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6">
            <div className="mb-4 flex items-center px-4">
               <ThemeToggle />
               <span className="ml-3 text-sm text-muted-foreground font-medium">Theme</span>
            </div>
            <button
              onClick={handleSignOut}
              className="group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-[15px] font-medium text-[var(--destructive)] transition-colors hover:bg-[var(--destructive)]/10"
            >
              <LogOut className="h-5 w-5" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-[40px] px-6 py-4 lg:hidden">
           <Link to="/dashboard" className="scale-90 origin-left">
            <Logo />
          </Link>
          <button 
            className="p-2 text-muted-foreground transition hover:text-foreground"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto w-full relative z-10">
          <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-8 lg:px-16">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
