"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  AlertTriangle,
  UserCheck,
  Users,
  CreditCard,
  DollarSign,
  Search,
  ExternalLink,
  RefreshCw,
  X,
  Check,
  LifeBuoy,
  MessageSquare,
  Send,
  BellRing,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";

export default function AdminPortalPage() {
  const [loading, setLoading] = React.useState(true);
  const [isAdmin, setIsAdmin] = React.useState(true);
  const [payments, setPayments] = React.useState<any[]>([]);
  const [users, setUsers] = React.useState<any[]>([]);
  const [stats, setStats] = React.useState<any>({
    totalRevenuePkr: 0,
    pendingApprovals: 0,
    activeSubscribers: 0,
    totalUsers: 0,
  });

  const [activeTab, setActiveTab] = React.useState<"payments" | "users" | "support">("payments");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [userSearch, setUserSearch] = React.useState<string>("");

  // Support Tickets State
  const [tickets, setTickets] = React.useState<any[]>([]);
  const [ticketsLoading, setTicketsLoading] = React.useState(false);
  const [ticketStatusFilter, setTicketStatusFilter] = React.useState<string>("all");
  const [expandedTicketId, setExpandedTicketId] = React.useState<string | null>(null);

  // Support Reply State
  const [replyMessage, setReplyMessage] = React.useState("");
  const [replyStatus, setReplyStatus] = React.useState("resolved");
  const [sendingReply, setSendingReply] = React.useState(false);

  // Broadcast Notification State
  const [broadcastTitle, setBroadcastTitle] = React.useState("");
  const [broadcastMsg, setBroadcastMsg] = React.useState("");
  const [broadcastType, setBroadcastType] = React.useState<"info" | "success" | "warning">("info");
  const [sendingBroadcast, setSendingBroadcast] = React.useState(false);

  // Modal for previewing full screenshot
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);

  // Reject modal
  const [rejectingPaymentId, setRejectingPaymentId] = React.useState<string | null>(null);
  const [rejectReason, setRejectReason] = React.useState("");

  // Feedback notifications
  const [actionSuccess, setActionSuccess] = React.useState<string | null>(null);
  const [actionError, setActionError] = React.useState<string | null>(null);
  const [processingId, setProcessingId] = React.useState<string | null>(null);

  const fetchAdminData = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/payments/admin");
      if (res.status === 403) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const json = await res.json();
      if (json.success) {
        setPayments(json.payments || []);
        setUsers(json.users || []);
        setStats(
          json.stats || {
            totalRevenuePkr: 0,
            pendingApprovals: 0,
            activeSubscribers: 0,
            totalUsers: 0,
          }
        );
        setIsAdmin(true);
      } else {
        setActionError(json.error || "Failed to load admin data");
      }
    } catch {
      setActionError("Network error while communicating with admin API.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSupportTickets = React.useCallback(async () => {
    setTicketsLoading(true);
    try {
      const res = await fetch("/api/admin/support");
      const data = await res.json();
      if (data.success) {
        setTickets(data.data || []);
      }
    } catch (err) {
      console.error("Failed to load support tickets:", err);
    } finally {
      setTicketsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAdminData();
    fetchSupportTickets();
  }, [fetchAdminData, fetchSupportTickets]);

  const handleApprove = async (paymentId: string) => {
    setProcessingId(paymentId);
    setActionSuccess(null);
    setActionError(null);

    try {
      const res = await fetch("/api/payments/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve", paymentId }),
      });

      const data = await res.json();
      if (data.success) {
        setActionSuccess(data.message || "Payment approved and account activated!");
        fetchAdminData();
      } else {
        setActionError(data.error || "Failed to approve payment");
      }
    } catch {
      setActionError("Failed to communicate with admin endpoint.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectingPaymentId) return;
    setProcessingId(rejectingPaymentId);

    try {
      const res = await fetch("/api/payments/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reject",
          paymentId: rejectingPaymentId,
          notes: rejectReason || "TID not found or payment screenshot invalid",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setActionSuccess("Payment marked as rejected.");
        setRejectingPaymentId(null);
        setRejectReason("");
        fetchAdminData();
      } else {
        setActionError(data.error || "Failed to reject payment");
      }
    } catch {
      setActionError("Failed to reject payment.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleToggleUserStatus = async (userId: string, newStatus: string) => {
    setProcessingId(userId);
    try {
      const res = await fetch("/api/payments/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle_user_status",
          userId,
          status: newStatus,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setActionSuccess(`User status updated to ${newStatus}`);
        fetchAdminData();
      }
    } catch {
      setActionError("Failed to update user status");
    } finally {
      setProcessingId(null);
    }
  };

  const handleAdminReplyTicket = async (ticketId: string) => {
    if (!replyMessage.trim()) return;
    setSendingReply(true);

    try {
      const res = await fetch("/api/admin/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reply_ticket",
          ticketId,
          message: replyMessage,
          status: replyStatus,
          senderName: "HireAgent Operations Team",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setActionSuccess(`Support ticket #${ticketId} updated and response dispatched to candidate!`);
        setReplyMessage("");
        fetchSupportTickets();
      } else {
        setActionError(data.error || "Failed to submit admin reply.");
      }
    } catch (err) {
      setActionError("Failed to reply to ticket.");
    } finally {
      setSendingReply(false);
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMsg.trim()) return;
    setSendingBroadcast(true);

    try {
      const res = await fetch("/api/admin/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "broadcast_notification",
          title: broadcastTitle,
          message: broadcastMsg,
          type: broadcastType,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setActionSuccess(data.message || "System broadcast notification dispatched successfully!");
        setBroadcastTitle("");
        setBroadcastMsg("");
      } else {
        setActionError(data.error || "Failed to dispatch broadcast notification.");
      }
    } catch {
      setActionError("Network error while sending broadcast notification.");
    } finally {
      setSendingBroadcast(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <div className="rounded-full bg-rose-100 p-4 w-16 h-16 mx-auto flex items-center justify-center text-rose-600">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Administrator Access Required</h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          This portal is reserved strictly for administrative verification. Please log in with the administrator account (<code>admin@hireagent.com</code>).
        </p>
        <Link href="/login">
          <Button variant="primary" size="sm" className="font-bold mt-2">
            Go to Login
          </Button>
        </Link>
      </div>
    );
  }

  const filteredPayments = payments.filter((p) => {
    if (statusFilter === "all") return true;
    return p.status === statusFilter;
  });

  const filteredUsers = users.filter((u) => {
    if (!userSearch.trim()) return true;
    const q = userSearch.toLowerCase();
    return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

  const filteredTickets = tickets.filter((t) => {
    if (ticketStatusFilter === "all") return true;
    return t.status === ticketStatusFilter;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-600 p-2.5 text-white shadow-xs">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900">HireAgent Administration Command</h1>
              <span className="rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-black px-2 py-0.5 uppercase">
                Admin Mode
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Review JazzCash payments, manage candidate subscriptions, respond to support tickets & send notifications.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            fetchAdminData();
            fetchSupportTickets();
          }}
          disabled={loading || ticketsLoading}
          className="font-bold gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading || ticketsLoading ? "animate-spin" : ""}`} />
          <span>Refresh Queue</span>
        </Button>
      </div>

      {/* Notifications */}
      {actionSuccess && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-900 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {actionError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-900 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 font-bold">
            <AlertTriangle className="h-4 w-4 text-rose-600" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-rose-700 hover:text-rose-900">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Revenue Approved</span>
          <div className="text-2xl font-black text-slate-900">
            Rs. {Number(stats.totalRevenuePkr || 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold">Via JazzCash Direct Subscriptions</p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Pending Verification</span>
          <div className="text-2xl font-black text-amber-900">
            {stats.pendingApprovals}
          </div>
          <p className="text-[11px] text-amber-700 font-semibold">Waiting for manual admin activation</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Open Support Tickets</span>
          <div className="text-2xl font-black text-indigo-600">
            {tickets.filter((t) => t.status === "open" || t.status === "in_progress").length}
          </div>
          <p className="text-[11px] text-indigo-600 font-semibold">Candidate inquiries requiring action</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Registered Accounts</span>
          <div className="text-2xl font-black text-slate-900">
            {stats.totalUsers}
          </div>
          <p className="text-[11px] text-slate-500 font-semibold">Stored in Neon PostgreSQL cluster</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("payments")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
            activeTab === "payments"
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <CreditCard className="h-3.5 w-3.5" />
          <span>Payment Approvals ({payments.filter((p) => p.status === "pending").length})</span>
        </button>

        <button
          onClick={() => setActiveTab("support")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
            activeTab === "support"
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <LifeBuoy className="h-3.5 w-3.5" />
          <span>Support Tickets & Broadcast ({tickets.filter((t) => t.status === "open").length} open)</span>
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
            activeTab === "users"
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          <span>User Accounts & Roles ({users.length})</span>
        </button>
      </div>

      {/* TAB 1: PAYMENTS QUEUE */}
      {activeTab === "payments" && (
        <div className="space-y-4">
          {/* Status Filter Pill Row */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-semibold">Filter:</span>
            {["all", "pending", "approved", "rejected"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition-colors ${
                  statusFilter === st
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {filteredPayments.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-400">
              No payment proof submissions found matching &quot;{statusFilter}&quot;.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPayments.map((p) => {
                const isPending = p.status === "pending";
                const isApproved = p.status === "approved";
                const isRejected = p.status === "rejected";

                return (
                  <div
                    key={p.id}
                    className={`rounded-2xl border bg-white p-5 transition-all shadow-xs space-y-4 ${
                      isPending ? "border-amber-300 ring-2 ring-amber-100" : "border-slate-200"
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{p.user_name || "Candidate User"}</span>
                          <span className="text-xs text-slate-400">({p.user_email})</span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                              isApproved
                                ? "bg-emerald-100 text-emerald-800"
                                : isPending
                                ? "bg-amber-100 text-amber-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {p.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Plan Selected: <span className="font-bold text-slate-800 uppercase">{p.plan_type}</span> | Submitted: {new Date(p.submitted_at).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {isPending && (
                          <>
                            <Button
                              size="sm"
                              variant="primary"
                              disabled={processingId === p.id}
                              onClick={() => handleApprove(p.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 font-bold text-xs gap-1.5"
                            >
                              <Check className="h-3.5 w-3.5" /> Approve & Activate
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              disabled={processingId === p.id}
                              onClick={() => setRejectingPaymentId(p.id)}
                              className="text-rose-600 hover:bg-rose-50 border-rose-200 font-bold text-xs gap-1.5"
                            >
                              <X className="h-3.5 w-3.5" /> Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Transaction ID (TID)</span>
                        <span className="font-mono font-bold text-slate-900 text-sm">{p.transaction_id || "N/A"}</span>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">JazzCash Account Holder</span>
                        <span className="font-bold text-slate-900 text-sm">{p.account_holder_name || "N/A"}</span>
                        <span className="block text-[11px] text-slate-500">{p.sender_phone}</span>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Amount Claimed</span>
                          <span className="font-black text-indigo-600 text-base">Rs. {p.amount_pkr || 500}</span>
                        </div>
                        {p.screenshot_url && (
                          <button
                            type="button"
                            onClick={() => setPreviewImage(p.screenshot_url)}
                            className="inline-flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5" /> Receipt
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SUPPORT TICKETS & BROADCAST */}
      {activeTab === "support" && (
        <div className="space-y-8">
          {/* Section 1: System Broadcast Notifications */}
          <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50/70 via-white to-slate-50 p-6 shadow-xs">
            <div className="max-w-3xl">
              <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                <BellRing className="w-4 h-4 text-indigo-600" /> Send System Broadcast Notification
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Instantly push an in-app alert or platform message to all candidate users.
              </p>

              <form onSubmit={handleSendBroadcast} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Notification Header / Title
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. New Executive CV Templates Released!"
                      value={broadcastTitle}
                      onChange={(e) => setBroadcastTitle(e.target.value)}
                      className="bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Alert Type
                    </label>
                    <select
                      value={broadcastType}
                      onChange={(e) => setBroadcastType(e.target.value as any)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-indigo-600"
                    >
                      <option value="info">Info (Blue)</option>
                      <option value="success">Success (Green)</option>
                      <option value="warning">Warning (Amber)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Message Body
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Enter the notification message to broadcast to all candidate dashboards..."
                    value={broadcastMsg}
                    onChange={(e) => setBroadcastMsg(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs focus:outline-none focus:border-indigo-600 resize-none"
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={sendingBroadcast || !broadcastTitle.trim() || !broadcastMsg.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-1.5"
                  >
                    {sendingBroadcast ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    Dispatch System Broadcast
                  </Button>
                </div>
              </form>
            </div>
          </Card>

          {/* Section 2: Candidate Support Tickets */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <LifeBuoy className="w-4 h-4 text-indigo-600" /> Candidate Support Requests Queue
              </h2>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-semibold">Status:</span>
                {["all", "open", "in_progress", "resolved", "closed"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setTicketStatusFilter(st)}
                    className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition-colors ${
                      ticketStatusFilter === st
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {ticketsLoading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin text-indigo-600 mx-auto mb-2" />
                Loading support tickets queue...
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-400">
                No support tickets found matching filter &quot;{ticketStatusFilter}&quot;.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTickets.map((ticket) => {
                  const isExpanded = expandedTicketId === ticket.id;
                  return (
                    <div
                      key={ticket.id}
                      className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs transition-all"
                    >
                      <div
                        onClick={() => setExpandedTicketId(isExpanded ? null : ticket.id)}
                        className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                              #{ticket.id}
                            </span>
                            <span className="text-xs font-bold text-slate-800">{ticket.userName}</span>
                            <span className="text-xs text-slate-400">({ticket.userEmail})</span>
                            <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100">{ticket.category}</Badge>
                            <Badge
                              className={`uppercase text-[10px] ${
                                ticket.priority === "urgent"
                                  ? "bg-red-100 text-red-800"
                                  : ticket.priority === "high"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {ticket.priority}
                            </Badge>
                            <Badge
                              className={`uppercase text-[10px] ${
                                ticket.status === "open"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : ticket.status === "in_progress"
                                  ? "bg-indigo-100 text-indigo-800"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {ticket.status}
                            </Badge>
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 mt-1">{ticket.subject}</h3>
                          <p className="text-xs text-slate-500 line-clamp-1">{ticket.message}</p>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-400 shrink-0">
                          <div className="text-right">
                            <div>{new Date(ticket.createdAt).toLocaleDateString()}</div>
                            <div className="text-indigo-600 font-bold">{ticket.replies?.length || 0} replies</div>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </div>

                      {/* Detail & Reply Panel */}
                      {isExpanded && (
                        <div className="border-t border-slate-100 bg-slate-50 p-5 space-y-6">
                          {/* Original Candidate Description */}
                          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-bold text-slate-800">
                                Original Request from {ticket.userName} ({ticket.userEmail})
                              </span>
                              <span className="text-[11px] text-slate-400">
                                {new Date(ticket.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">{ticket.message}</p>
                          </div>

                          {/* Reply History Thread */}
                          {ticket.replies && ticket.replies.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Response History ({ticket.replies.length})
                              </h4>
                              {ticket.replies.map((r: any) => (
                                <div
                                  key={r.id}
                                  className={`rounded-xl p-3.5 border text-xs shadow-xs ${
                                    r.senderRole === "Admin" || r.senderRole === "Support Specialist"
                                      ? "bg-indigo-50/80 border-indigo-200 ml-4"
                                      : "bg-white border-slate-200 mr-4"
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-1.5">
                                    <span className="font-bold text-slate-900">
                                      {r.senderName} ({r.senderRole})
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                      {new Date(r.createdAt).toLocaleString()}
                                    </span>
                                  </div>
                                  <p className="text-slate-700 whitespace-pre-line">{r.message}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Admin Reply & Status Updater Form */}
                          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
                            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              <MessageSquare className="w-3.5 h-3.5 text-indigo-600" /> Post Admin Official Response
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                              <div className="md:col-span-3">
                                <textarea
                                  rows={3}
                                  placeholder="Type official response to candidate (this will also dispatch an in-app notification)..."
                                  value={replyMessage}
                                  onChange={(e) => setReplyMessage(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs focus:outline-none focus:border-indigo-600 resize-none"
                                />
                              </div>
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                                    Update Status
                                  </label>
                                  <select
                                    value={replyStatus}
                                    onChange={(e) => setReplyStatus(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                                  >
                                    <option value="in_progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="closed">Closed</option>
                                  </select>
                                </div>
                                <Button
                                  onClick={() => handleAdminReplyTicket(ticket.id)}
                                  disabled={sendingReply || !replyMessage.trim()}
                                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 gap-1.5"
                                >
                                  {sendingReply ? (
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Send className="w-3.5 h-3.5" />
                                  )}
                                  Send Response
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: USER ACCOUNTS & MANUAL OVERRIDES */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
              <Input
                type="text"
                placeholder="Search registered accounts by name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>
            <span className="text-xs text-slate-500 font-bold">
              Showing {filteredUsers.length} registered candidate profiles
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Candidate User</th>
                    <th className="p-3.5">Account Role</th>
                    <th className="p-3.5">Subscription Status</th>
                    <th className="p-3.5">Joined Date</th>
                    <th className="p-3.5 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => {
                    const isActive = u.subscription_status === "active";
                    const isPending = u.subscription_status === "pending_approval";
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-bold text-slate-900">
                          <div>{u.name || "Candidate"}</div>
                          <div className="text-[11px] text-slate-400 font-normal">{u.email}</div>
                        </td>
                        <td className="p-3.5">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                            u.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-slate-100 text-slate-700"
                          }`}>
                            {u.role || "user"}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                              isActive
                                ? "bg-emerald-100 text-emerald-800"
                                : isPending
                                ? "bg-amber-100 text-amber-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {u.subscription_status || "pending_payment"}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-400">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString() : "Recent"}
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          {isActive ? (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={processingId === u.id}
                              onClick={() => handleToggleUserStatus(u.id, "pending_payment")}
                              className="text-xs font-bold border-rose-200 text-rose-600 hover:bg-rose-50"
                            >
                              Revoke Access
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={processingId === u.id}
                              onClick={() => handleToggleUserStatus(u.id, "active")}
                              className="text-xs font-bold border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                            >
                              Grant Pro Access
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Screenshot Preview Modal */}
      <Modal
        isOpen={Boolean(previewImage)}
        onClose={() => setPreviewImage(null)}
        title="JazzCash Payment Proof Receipt"
        description="Verify transaction ID and account holder against live JazzCash statement."
      >
        <div className="space-y-4">
          {previewImage && (
            <div className="flex justify-center bg-slate-900 rounded-xl p-2 border border-slate-800">
              <img
                src={previewImage}
                alt="Full Payment Proof Screenshot"
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
          )}
          <div className="flex justify-between items-center pt-2">
            <a
              href={previewImage || "#"}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline font-bold"
            >
              <span>Open in New Tab</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <Button variant="outline" size="sm" onClick={() => setPreviewImage(null)}>
              Close Preview
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reject Reason Confirmation Modal */}
      <Modal
        isOpen={Boolean(rejectingPaymentId)}
        onClose={() => setRejectingPaymentId(null)}
        title="Reject Payment Submission"
        description="Please provide a brief reason for rejecting this transaction (this will be logged for the candidate)."
      >
        <div className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Rejection Reason / Admin Note</label>
            <Input
              type="text"
              placeholder="e.g. TID not found on JazzCash statement or unreadable screenshot"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setRejectingPaymentId(null);
                setRejectReason("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleRejectConfirm}
              className="font-bold"
            >
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
