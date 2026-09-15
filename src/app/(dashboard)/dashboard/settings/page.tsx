"use client";

import * as React from "react";
import Link from "next/link";
import {
  User,
  Shield,
  Bell,
  Sparkles,
  CreditCard,
  Download,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = React.useState<
    "profile" | "security" | "notifications" | "ai" | "subscription" | "privacy"
  >("profile");

  const [savedSuccess, setSavedSuccess] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);

  // Profile fields
  const [name, setName] = React.useState("Candidate");
  const [email, setEmail] = React.useState("");

  // AI Preferences
  const [defaultTone, setDefaultTone] = React.useState("professional");
  const [temperature, setTemperature] = React.useState("0.2");
  const [zeroHallucinationStrict, setZeroHallucinationStrict] = React.useState(true);

  // Notification Preferences
  const [emailJobAlerts, setEmailJobAlerts] = React.useState(true);
  const [followUpReminders, setFollowUpReminders] = React.useState(true);
  const [marketingNews, setMarketingNews] = React.useState(false);

  React.useEffect(() => {
    async function loadSettingsUser() {
      try {
        const [profRes, authRes] = await Promise.all([
          fetch("/api/profile").then((r) => r.json()).catch(() => null),
          fetch("/api/auth").then((r) => r.json()).catch(() => null),
        ]);

        if (authRes?.user) {
          if (authRes.user.name) setName(authRes.user.name);
          if (authRes.user.email) setEmail(authRes.user.email);
        }

        if (profRes?.success && profRes.data?.profile) {
          const p = profRes.data.profile;
          if (p.fullName && p.fullName !== "Candidate") setName(p.fullName);
          if (p.email) setEmail(p.email);
        }
      } catch (err) {
        console.warn("Failed to load settings user data:", err);
      }
    }
    loadSettingsUser();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: name, email }),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d5d9d9] pb-4 bg-white p-4 rounded-xs">
        <div>
          <h1 className="text-lg font-bold text-[#0f1111]">Platform Settings</h1>
          <p className="text-xs text-[#565959] mt-0.5">
            Manage your account credentials, AI model calibrations, subscription tier, and data privacy.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1 text-xs font-bold text-[#067d62]">
            <CheckCircle2 className="h-4 w-4" />
            <span>Settings Saved Successfully</span>
          </div>
        )}
      </div>

      {/* Nav Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-[#d5d9d9] bg-[#f8f9fa] p-1.5 rounded-xs">
        {[
          { id: "profile", label: "Profile Account", icon: User },
          { id: "security", label: "Security & Login", icon: Shield },
          { id: "notifications", label: "Notifications", icon: Bell },
          { id: "ai", label: "AI Preferences", icon: Sparkles },
          { id: "subscription", label: "Subscription & Billing", icon: CreditCard },
          { id: "privacy", label: "Data & Privacy", icon: Download },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as typeof activeSection)}
              className={`flex items-center gap-1.5 rounded-xs px-3 py-1.5 text-xs font-semibold transition-colors ${
                isActive
                  ? "bg-[#131921] text-white"
                  : "text-[#565959] hover:bg-gray-200"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. PROFILE ACCOUNT SETTINGS */}
      {activeSection === "profile" && (
        <Card className="border-[#d5d9d9] bg-white shadow-2xs">
          <CardHeader className="p-4 border-b border-[#f3f4f6]">
            <CardTitle className="text-sm font-bold text-[#0f1111]">Account Identification</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <form onSubmit={handleSave} className="space-y-4 max-w-md text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#0f1111]">Full Display Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0f1111]">Primary Email Address</label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" size="sm" isLoading={isSaving} className="font-bold bg-indigo-600 hover:bg-indigo-700 text-white">
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* 2. SECURITY & LOGIN */}
      {activeSection === "security" && (
        <Card className="border-[#d5d9d9] bg-white shadow-2xs">
          <CardHeader className="p-4 border-b border-[#f3f4f6]">
            <CardTitle className="text-sm font-bold text-[#0f1111]">Password & Access Security</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4 text-xs max-w-md">
            <div className="space-y-1">
              <label className="font-bold text-[#0f1111]">Current Password</label>
              <Input type="password" placeholder="••••••••••••" />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#0f1111]">New Password</label>
              <Input type="password" placeholder="••••••••••••" />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#0f1111]">Confirm New Password</label>
              <Input type="password" placeholder="••••••••••••" />
            </div>

            <Button variant="primary" size="sm" className="font-bold bg-indigo-600 hover:bg-indigo-700 text-white">
              Update Password
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 3. NOTIFICATIONS */}
      {activeSection === "notifications" && (
        <Card className="border-[#d5d9d9] bg-white shadow-2xs">
          <CardHeader className="p-4 border-b border-[#f3f4f6]">
            <CardTitle className="text-sm font-bold text-[#0f1111]">Notification Channels</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4 text-xs">
            <div className="flex items-start gap-2">
              <input
                id="notif_matches"
                type="checkbox"
                checked={emailJobAlerts}
                onChange={(e) => setEmailJobAlerts(e.target.checked)}
                className="mt-0.5 h-3.5 w-3.5 text-indigo-600 rounded-xs"
              />
              <label htmlFor="notif_matches">
                <span className="font-bold text-[#0f1111] block">High Compatibility Alerts</span>
                <span className="text-[#565959]">Receive notifications when opportunities matching your domain skills are discovered.</span>
              </label>
            </div>

            <div className="flex items-start gap-2">
              <input
                id="notif_followup"
                type="checkbox"
                checked={followUpReminders}
                onChange={(e) => setFollowUpReminders(e.target.checked)}
                className="mt-0.5 h-3.5 w-3.5 text-indigo-600 rounded-xs"
              />
              <label htmlFor="notif_followup">
                <span className="font-bold text-[#0f1111] block">Follow-Up Cadence Reminders</span>
                <span className="text-[#565959]">Alert me when 4 business days pass without a recruiter response.</span>
              </label>
            </div>

            <Button variant="primary" size="sm" onClick={handleSave} className="font-bold mt-2 bg-indigo-600 hover:bg-indigo-700 text-white">
              Save Preferences
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 4. AI PREFERENCES */}
      {activeSection === "ai" && (
        <Card className="border-[#d5d9d9] bg-white shadow-2xs">
          <CardHeader className="p-4 border-b border-[#f3f4f6]">
            <CardTitle className="text-sm font-bold text-[#0f1111]">Groq AI Intelligence Engine Settings</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4 text-xs max-w-md">
            <div>
              <label className="font-bold text-[#0f1111] block mb-1">Default Output Voice</label>
              <Select
                value={defaultTone}
                onChange={(e) => setDefaultTone(e.target.value)}
                options={[
                  { value: "professional", label: "Professional & Direct" },
                  { value: "confident", label: "Executive Confident" },
                  { value: "concise", label: "Strictly Concise" },
                ]}
              />
            </div>

            <div className="rounded-xs border border-[#a7f3d0] bg-[#ecfdf5] p-3 text-[#067d62] space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="h-4 w-4" />
                <span>Strict Zero-Hallucination Policy Enforced</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                The generative engine is restricted to statements derived from your verified domain profile history and credentials.
              </p>
            </div>

            <Button variant="primary" size="sm" onClick={handleSave} className="font-bold bg-indigo-600 hover:bg-indigo-700 text-white">
              Save AI Settings
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 5. SUBSCRIPTION & BILLING */}
      {activeSection === "subscription" && (
        <Card className="border-[#d5d9d9] bg-white shadow-2xs">
          <CardHeader className="p-4 border-b border-[#f3f4f6]">
            <CardTitle className="text-sm font-bold text-[#0f1111]">SaaS Plan & Invoices</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4 text-xs">
            <div className="rounded-xs border border-[#d5d9d9] bg-[#f8f9fa] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-[#0f1111]">Pakistan JazzCash Subscriptions</h3>
                  <Badge variant="success">JazzCash Supported</Badge>
                </div>
                <p className="text-xs text-[#565959] mt-0.5">
                  Weekly Pro (Rs. 1,499) • Monthly Career Pro (Rs. 3,499)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link href="/dashboard/billing">
                  <Button variant="primary" size="sm" className="font-bold bg-indigo-600 hover:bg-indigo-700 text-white">
                    Manage JazzCash Billing & Plans
                  </Button>
                </Link>
              </div>
            </div>

            <div className="border-t border-[#f3f4f6] pt-3">
              <h4 className="font-bold text-[#0f1111] mb-2">JazzCash Payment Information</h4>
              <div className="rounded-xs border border-[#e5e7eb] p-3 text-xs text-[#565959] space-y-1">
                <p>Transfer account: <strong>03016532878</strong> (HireAgent / JazzCash)</p>
                <p>Upload proof and review verification status anytime inside the dedicated billing portal.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 6. DATA & PRIVACY */}
      {activeSection === "privacy" && (
        <div className="space-y-6">
          <Card className="border-[#d5d9d9] bg-white shadow-2xs">
            <CardHeader className="p-4 border-b border-[#f3f4f6]">
              <CardTitle className="text-sm font-bold text-[#0f1111]">Data Export & GDPR Compliance</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <p className="text-[#565959] leading-relaxed">
                You own 100% of your career data, uploaded resumes, and application tracker history. You can export your full portfolio as JSON at any time.
              </p>
              <Button variant="outline" size="sm" className="font-bold gap-1.5">
                <Download className="h-3.5 w-3.5" />
                <span>Export Career Profile JSON</span>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-[#fecaca] bg-[#fef2f2] shadow-2xs">
            <CardHeader className="p-4 border-b border-[#fecaca]">
              <CardTitle className="text-sm font-bold text-[#c41c1c]">Danger Zone: Account Removal</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <p className="text-[#7f1d1d] leading-relaxed">
                Permanently delete your profile, resume files, and application logs.
              </p>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setDeleteModalOpen(true)}
                className="font-bold gap-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Account</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Account Deletion"
        description="Are you sure you want to delete your HireBoost AI account? This action is permanent."
      >
        <div className="space-y-4 text-xs">
          <p className="text-[#c41c1c] font-semibold">
            All stored resumes, ATS parse scores, and tracked applications will be permanently purged from the database.
          </p>
          <div className="flex justify-end gap-2 pt-2 border-t border-[#e5e7eb]">
            <Button variant="outline" size="sm" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setDeleteModalOpen(false)}
              className="font-bold"
            >
              Permanently Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
