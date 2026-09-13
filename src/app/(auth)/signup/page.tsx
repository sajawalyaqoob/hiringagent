"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { signupSchema } from "@/lib/validations/auth";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [acceptTerms, setAcceptTerms] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = signupSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
      acceptTerms,
    });

    if (!validation.success) {
      setError(validation.error.issues[0]?.message || "Please check your inputs");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "signup", email, password, name }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to create account.");
        setLoading(false);
        return;
      }

      router.push("/dashboard/profile");
    } catch {
      setError("An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Card className="border-[#d5d9d9] shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-bold text-[#0f1111]">Create Your Career Profile</CardTitle>
        <CardDescription>
          Calibrate your actual skills and access deterministic job matching in 3 minutes.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xs border border-[#fecaca] bg-[#fef2f2] p-2.5 text-xs text-[#c41c1c]">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0f1111]" htmlFor="name">
              Full Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Alex Morgan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0f1111]" htmlFor="email">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="alex.morgan@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0f1111]" htmlFor="password">
              Password (min. 8 characters)
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0f1111]" htmlFor="confirm-password">
              Confirm Password
            </label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-start pt-1">
            <input
              id="terms"
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-0.5 h-3.5 w-3.5 rounded-xs border-[#d5d9d9] text-[#f08804] focus:ring-[#f08804]"
            />
            <label htmlFor="terms" className="ml-2 text-xs text-[#565959] leading-tight">
              I agree to the Terms of Service, Privacy Policy, and Zero-Hallucination Data Processing Standard.
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full font-bold mt-2"
            isLoading={loading}
          >
            Create Career Account
            <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2 border-t border-[#f3f4f6] text-center text-xs text-[#565959]">
        <div>
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-[#b45309] hover:underline">
            Sign In Here
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
