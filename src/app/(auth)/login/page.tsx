"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { loginSchema } from "@/lib/validations/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const fillDemoCredentials = () => {
    setEmail("alex.morgan@example.com");
    setPassword("EnterpriseScale2026!");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = loginSchema.safeParse({ email, password, rememberMe });
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || "Invalid credentials format");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Login failed. Please check your credentials.");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto border-[#d5d9d9] shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-bold text-[#0f1111]">Sign In to HireBoost</CardTitle>
        <CardDescription>
          Access your calibrated career profile, ATS resume scores, and application tracker.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="mb-4 rounded-xs border border-[#fde68a] bg-[#fffbeb] p-3 text-xs text-[#b45309]">
          <div className="flex items-center justify-between font-bold">
            <span>Evaluating the SaaS Architecture?</span>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="rounded-xs bg-[#f08804] px-2 py-0.5 text-[11px] font-bold text-[#0f1111] hover:bg-[#d97706] transition-colors"
            >
              Fill Demo Credentials
            </button>
          </div>
          <p className="mt-1 text-[11px] text-[#565959]">
            Pre-populates sample senior engineer profile data.
          </p>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xs border border-[#fecaca] bg-[#fef2f2] p-2.5 text-xs text-[#c41c1c]">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0f1111]" htmlFor="email">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#0f1111]" htmlFor="password">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs text-[#b45309] hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-3.5 w-3.5 rounded-xs border-[#d5d9d9] text-[#f08804] focus:ring-[#f08804]"
            />
            <label htmlFor="remember-me" className="ml-2 text-xs text-[#565959]">
              Remember this device for 30 days
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full font-bold"
            isLoading={loading}
          >
            Sign In
            <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2 border-t border-[#f3f4f6] text-center text-xs text-[#565959]">
        <div>
          Don&apos;t have an account yet?{" "}
          <Link href="/signup" className="font-bold text-[#b45309] hover:underline">
            Create an Account
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
