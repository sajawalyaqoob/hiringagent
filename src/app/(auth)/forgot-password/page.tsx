"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { forgotPasswordSchema } from "@/lib/validations/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = forgotPasswordSchema.safeParse({ email });
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || "Please enter a valid email");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <Card className="border-[#d5d9d9] shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-bold text-[#0f1111]">Reset Password</CardTitle>
        <CardDescription>
          Enter your registered email address to receive password reset instructions.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {submitted ? (
          <div className="rounded-xs border border-[#a7f3d0] bg-[#ecfdf5] p-4 text-xs text-[#067d62] space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              <CheckCircle2 className="h-4 w-4" />
              <span>Reset Link Dispatched</span>
            </div>
            <p className="leading-relaxed">
              If an account exists for <strong className="text-[#0f1111]">{email}</strong>, you will receive instructions to reset your credentials shortly.
            </p>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#0f1111]"
              >
                Send to another email
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-xs border border-[#fecaca] bg-[#fef2f2] p-2.5 text-xs text-[#c41c1c]">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0f1111]" htmlFor="email">
                Registered Account Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full font-bold"
              isLoading={loading}
            >
              <Mail className="h-3.5 w-3.5 mr-1.5" />
              Send Reset Instructions
            </Button>
          </form>
        )}
      </CardContent>

      <CardFooter className="border-t border-[#f3f4f6] text-center text-xs text-[#565959]">
        <Link href="/login" className="inline-flex items-center gap-1 font-bold text-[#b45309] hover:underline mx-auto">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </CardFooter>
    </Card>
  );
}
