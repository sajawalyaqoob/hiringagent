"use client";

import * as React from "react";
import Link from "next/link";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  Check,
  Upload,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  PhoneCall,
  FileText,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BillingPage() {
  const [selectedPlan, setSelectedPlan] = React.useState<"weekly" | "monthly">("weekly");
  const [senderNumber, setSenderNumber] = React.useState("");
  const [transactionId, setTransactionId] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  const [copied, setCopied] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const [loadingHistory, setLoadingHistory] = React.useState(true);
  const [payments, setPayments] = React.useState<any[]>([]);
  const [userStatus, setUserStatus] = React.useState<string>("pending_payment");
  const [userTier, setUserTier] = React.useState<string>("free");
  const [expiresAt, setExpiresAt] = React.useState<string | null>(null);

  const jazzCashNumber = "03016532878";
  const jazzCashTitle = "HireAgent / JazzCash";

  const fetchPaymentData = React.useCallback(async () => {
    try {
      setLoadingHistory(true);
      const res = await fetch("/api/payments");
      const json = await res.json();
      if (json.success) {
        setPayments(json.data || []);
        setUserStatus(json.userStatus || "pending_payment");
        setUserTier(json.userTier || "free");
        setExpiresAt(json.expiresAt || null);
      }
    } catch {
      // Keep defaults on failure
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  React.useEffect(() => {
    fetchPaymentData();
  }, [fetchPaymentData]);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(jazzCashNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!senderNumber.trim()) {
      setErrorMessage("Please enter your JazzCash sender phone number.");
      return;
    }

    if (!transactionId.trim()) {
      setErrorMessage("Please enter the JazzCash Transaction ID (TID).");
      return;
    }

    if (!file) {
      setErrorMessage("Please select and upload your JazzCash payment screenshot proof.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("planId", selectedPlan);
      formData.append("senderNumber", senderNumber.trim());
      formData.append("transactionId", transactionId.trim());
      formData.append("screenshot", file);

      const res = await fetch("/api/payments", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to submit payment proof. Please try again.");
        setSubmitting(false);
        return;
      }

      setSubmitSuccess(true);
      setFile(null);
      setPreviewUrl(null);
      setSenderNumber("");
      setTransactionId("");
      fetchPaymentData();
    } catch {
      setErrorMessage("An unexpected network error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Pakistan Direct Activation & Billing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Subscription & JazzCash Manual Payment
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Activate unlimited ATS resume tailoring, AI interview coaching, and deterministic career matching via instant JazzCash transfer.
          </p>

          {/* Current Status Pill */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-xl px-3.5 py-2 text-xs border border-white/10">
              <span className="text-slate-400">Account Status:</span>
              {userStatus === "active" ? (
                <span className="inline-flex items-center gap-1.5 font-bold text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" /> Active Pro ({userTier})
                </span>
              ) : userStatus === "pending_approval" ? (
                <span className="inline-flex items-center gap-1.5 font-bold text-amber-400">
                  <Clock className="h-4 w-4" /> Payment Under Admin Review
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 font-bold text-rose-400">
                  <AlertCircle className="h-4 w-4" /> Activation Required
                </span>
              )}
            </div>

            {expiresAt && userStatus === "active" && (
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-xl px-3.5 py-2 text-xs border border-white/10 text-slate-300">
                <Calendar className="h-3.5 w-3.5 text-indigo-300" />
                <span>Renewal Date: {new Date(expiresAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Under Review Notice Banner */}
      {userStatus === "pending_approval" && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900 shadow-sm flex items-start gap-3">
          <Clock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-sm text-amber-950">
              Your Payment Verification is Under Review
            </p>
            <p className="text-amber-800 leading-relaxed">
              Our administrator is verifying your JazzCash transaction screenshot. Your account features will automatically unlock as soon as verification is confirmed (usually within 15–30 minutes).
            </p>
          </div>
        </div>
      )}

      {/* Plan Selection Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">1. Select Your Subscription Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Weekly Plan */}
          <div
            onClick={() => setSelectedPlan("weekly")}
            className={`cursor-pointer rounded-2xl p-6 transition-all relative border-2 ${
              selectedPlan === "weekly"
                ? "border-indigo-600 bg-indigo-50/40 shadow-md ring-2 ring-indigo-600/20"
                : "border-slate-200 bg-white hover:border-slate-300 shadow-xs"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-100 px-2.5 py-0.5 rounded-full">
                  Weekly Plan
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">Weekly Pro</h3>
                <p className="text-xs text-slate-500 mt-1">Ideal for candidates actively interviewing this week.</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-slate-900">Rs. 1,499</span>
                <span className="text-xs text-slate-500 block">/ 7 days</span>
              </div>
            </div>

            <ul className="mt-5 space-y-2 border-t border-slate-200/80 pt-4 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Unlimited ATS Resume Tailoring</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Deterministic Job Matching Engine</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>AI Interview Calibration & Questions</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Full Access for 7 Days</span>
              </li>
            </ul>
          </div>

          {/* Monthly Plan */}
          <div
            onClick={() => setSelectedPlan("monthly")}
            className={`cursor-pointer rounded-2xl p-6 transition-all relative border-2 ${
              selectedPlan === "monthly"
                ? "border-indigo-600 bg-indigo-50/40 shadow-md ring-2 ring-indigo-600/20"
                : "border-slate-200 bg-white hover:border-slate-300 shadow-xs"
            }`}
          >
            <span className="absolute -top-3 right-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-0.5 text-[10px] font-black text-white shadow-sm uppercase">
              Best Value (Save 42%)
            </span>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-100 px-2.5 py-0.5 rounded-full">
                  Monthly Plan
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">Monthly Career Pro</h3>
                <p className="text-xs text-slate-500 mt-1">For long-term job search, multiple offers & executive roles.</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-slate-900">Rs. 3,499</span>
                <span className="text-xs text-slate-500 block">/ 30 days</span>
              </div>
            </div>

            <ul className="mt-5 space-y-2 border-t border-slate-200/80 pt-4 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Everything in Weekly Pro</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Unlimited Tailored Generations</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Priority Recruiter Outreach Matcher</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Full 30 Days Continuous Protection</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* JazzCash Transfer Details Box */}
      <Card className="border-slate-200 bg-white shadow-xs rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/20 p-2 backdrop-blur-xs">
                <PhoneCall className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-white">
                  2. Send Payment to JazzCash
                </CardTitle>
                <CardDescription className="text-rose-100 text-xs">
                  Transfer exact amount via JazzCash App, Retailer, or Online Bank Transfer
                </CardDescription>
              </div>
            </div>
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white">
              JazzCash
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* JazzCash Number Field */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                JazzCash Account Mobile Number
              </span>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xl font-mono font-black text-slate-900 tracking-wider">
                  {jazzCashNumber}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyNumber}
                  className="gap-1.5 font-bold"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Account Title Field */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Account Title / Receiver Name
              </span>
              <div className="pt-2">
                <span className="text-lg font-bold text-slate-900">
                  {jazzCashTitle}
                </span>
              </div>
            </div>
          </div>

          {/* Step-by-step instructions */}
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 text-xs space-y-2 text-slate-700">
            <span className="font-bold text-indigo-950 block">Quick 3-Step Payment Guide:</span>
            <ol className="list-decimal pl-4 space-y-1 text-[12px] leading-relaxed">
              <li>Open your <strong>JazzCash App</strong> (or EasyPaisa / Bank App) and select <strong>Send Money → JazzCash</strong>.</li>
              <li>Enter receiver number <strong>{jazzCashNumber}</strong> and transfer <strong>{selectedPlan === "weekly" ? "Rs. 1,499" : "Rs. 3,499"}</strong>.</li>
              <li>Take a <strong>screenshot of the successful transaction</strong> and note down the <strong>TID (Transaction ID)</strong>.</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Payment Proof Submission Form */}
      <Card className="border-slate-200 bg-white shadow-xs rounded-2xl">
        <CardHeader className="p-6 border-b border-slate-100">
          <CardTitle className="text-base font-bold text-slate-900">
            3. Upload Screenshot & Submit Proof
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Once submitted, your screenshot will be securely stored on Cloudinary and reviewed by the admin for immediate account activation.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          {submitSuccess && (
            <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-900 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">Payment proof submitted successfully!</p>
                <p className="mt-0.5 text-emerald-700">
                  Our team has been notified. Your account will be activated within 15–30 minutes.
                </p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-900 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
              <p className="font-semibold">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmitProof} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700" htmlFor="senderNumber">
                  Sender Mobile / JazzCash Account Number
                </label>
                <Input
                  id="senderNumber"
                  type="text"
                  placeholder="03001234567"
                  value={senderNumber}
                  onChange={(e) => setSenderNumber(e.target.value)}
                  required
                />
                <span className="text-[11px] text-slate-400 block">The number from which you sent the funds.</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700" htmlFor="transactionId">
                  JazzCash Transaction ID (TID)
                </label>
                <Input
                  id="transactionId"
                  type="text"
                  placeholder="e.g. 1234567890"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  required
                />
                <span className="text-[11px] text-slate-400 block">The 10–12 digit TID from the SMS or app receipt.</span>
              </div>
            </div>

            {/* Screenshot Upload Dropzone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Payment Proof Screenshot
              </label>
              <div className="mt-1 flex justify-center rounded-2xl border-2 border-dashed border-slate-300 px-6 pt-5 pb-6 hover:border-indigo-500 transition-colors bg-slate-50/50">
                <div className="space-y-2 text-center">
                  {previewUrl ? (
                    <div className="space-y-3">
                      <img
                        src={previewUrl}
                        alt="Screenshot Preview"
                        className="mx-auto max-h-56 rounded-xl border border-slate-200 shadow-md object-contain"
                      />
                      <p className="text-xs text-slate-600 font-semibold">{file?.name}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          setPreviewUrl(null);
                        }}
                        className="text-xs text-rose-600 hover:underline font-bold"
                      >
                        Choose another image
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-10 w-10 text-slate-400" />
                      <div className="flex text-xs text-slate-600 justify-center">
                        <label
                          htmlFor="screenshot-upload"
                          className="relative cursor-pointer rounded-md font-bold text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                        >
                          <span>Upload screenshot</span>
                          <input
                            id="screenshot-upload"
                            name="screenshot"
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            className="sr-only"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1 text-slate-500">or drag and drop</p>
                      </div>
                      <p className="text-[11px] text-slate-400">PNG, JPG, or WEBP up to 10MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full font-bold shadow-md gap-2"
              isLoading={submitting}
            >
              <span>Submit Payment Proof for Verification</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Payment History Section */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900">Payment Submission History</h3>
        {loadingHistory ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading payment history...</div>
        ) : payments.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 border border-slate-200 rounded-2xl bg-white">
            No payment records submitted yet. Choose a plan above and submit your proof to activate your account.
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Plan</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Sender</th>
                    <th className="px-4 py-3">TID</th>
                    <th className="px-4 py-3">Screenshot</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{p.planName}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">Rs. {p.amountPkr}</td>
                      <td className="px-4 py-3 text-slate-600 font-mono">{p.senderNumber}</td>
                      <td className="px-4 py-3 text-slate-600 font-mono">{p.transactionId}</td>
                      <td className="px-4 py-3">
                        <a
                          href={p.screenshotUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-indigo-600 hover:underline font-semibold"
                        >
                          <span>View Proof</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        {p.status === "approved" ? (
                          <Badge variant="success">Approved</Badge>
                        ) : p.status === "rejected" ? (
                          <Badge variant="danger">Rejected</Badge>
                        ) : (
                          <Badge variant="warning">Under Review</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
