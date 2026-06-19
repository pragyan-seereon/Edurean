import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { portalHomeForRole } from "@/lib/portal-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { GraduationCap, Loader2, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Scholaris ERP" }] }),
  component: LoginPage,
});

function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("rahul@dpsnorth.edu.in");
  const [password, setPassword] = useState("demo1234");
  const [loading, setLoading] = useState(false);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email || !password) return toast.error("Email and password are required");
    setLoading(true);
    try {
      const u = await auth.login(email, password);
      toast.success("Welcome back");
      router.navigate({ to: portalHomeForRole(u.role) });
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const quickAs = async (preset: string) => {
    setEmail(preset);
    setPassword("demo1234");
    setLoading(true);
    try {
      const u = await auth.login(preset, "demo1234");
      router.navigate({ to: portalHomeForRole(u.role) });
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Brand panel */}
      <div className="hidden lg:flex relative bg-sidebar text-sidebar-foreground p-10 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-25" />
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute bottom-0 -left-20 h-80 w-80 rounded-full bg-primary/40 blur-3xl" />
        <div className="relative">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-lg gradient-primary flex items-center justify-center shadow-lg">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <div className="font-display text-lg font-semibold">Scholaris ERP</div>
              <div className="text-[11px] uppercase tracking-wider text-sidebar-foreground/60">Enterprise · CBSE Edition</div>
            </div>
          </Link>
        </div>
        <div className="relative space-y-6 max-w-md">
          <h1 className="font-display text-4xl font-semibold leading-tight">
            The operating system for modern educational institutes.
          </h1>
          <p className="text-sm text-sidebar-foreground/75 leading-relaxed">
            Admissions, academics, fees, payroll, transport, hostel, communications — unified in one beautifully simple platform trusted by 600+ schools.
          </p>
          <div className="space-y-3">
            {[
              { icon: ShieldCheck, t: "ISO 27001 · DPDP compliant", d: "Bank-grade security, role-based access, full audit trails." },
              { icon: Zap, t: "Real-time everywhere", d: "Attendance, payments, notices — live on web and mobile." },
              { icon: Sparkles, t: "Built for CBSE", d: "Aligned with NEP, board reporting, exam structures and forms." },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-md bg-sidebar-accent flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <div className="text-sm font-medium">{t}</div>
                  <div className="text-xs text-sidebar-foreground/65">{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative text-xs text-sidebar-foreground/55">© 2026 Scholaris Technologies · All rights reserved</div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="h-9 w-9 rounded-md gradient-primary flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold">Scholaris ERP</span>
          </div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">Welcome back</h2>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to your institute workspace.</p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs">Work email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@institute.edu.in" autoComplete="email" required />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs">Password</Label>
                <Link to="/forgot-password" className="text-[11px] text-primary hover:underline">Forgot?</Link>
              </div>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" required />
            </div>
            <Button type="submit" disabled={loading} className="w-full gradient-primary border-0">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
            </Button>
          </form>

          <div className="relative my-6 flex items-center">
            <div className="flex-1 border-t" />
            <span className="px-3 text-[10px] uppercase tracking-wider text-muted-foreground">Demo personas</span>
            <div className="flex-1 border-t" />
          </div>

          <Card className="p-2 grid grid-cols-2 gap-1 border-border/60">
            {[
              { label: "Super Admin", email: "superadmin@scholaris.io" },
              { label: "Principal", email: "principal@dps.edu.in" },
              { label: "Teacher", email: "teacher@dps.edu.in" },
              { label: "Student", email: "student@dps.edu.in" },
            ].map((p) => (
              <Button key={p.email} variant="ghost" size="sm" className="justify-start text-xs font-normal" onClick={() => quickAs(p.email)} disabled={loading}>
                <span className="h-1.5 w-1.5 rounded-full bg-success mr-2" />
                {p.label}
              </Button>
            ))}
          </Card>

          <p className="mt-6 text-xs text-muted-foreground text-center">
            New institute? <Link to="/signup" className="text-primary hover:underline font-medium">Start a free trial</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
