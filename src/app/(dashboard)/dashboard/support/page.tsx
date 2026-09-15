"use client";

import * as React from "react";
import {
  HelpCircle,
  MessageSquare,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Search,
  ChevronDown,
  ChevronUp,
  LifeBuoy,
  FileText,
  Sparkles,
  RefreshCw,
  User,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TicketReply {
  id: string;
  senderName: string;
  senderRole: string;
  message: string;
  createdAt: string;
}

interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  message: string;
  createdAt: string;
  replies: TicketReply[];
}

export default function SupportPage() {
  const [tickets, setTickets] = React.useState<SupportTicket[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [activeTab, setActiveTab] = React.useState<"submit" | "my-tickets" | "faq">("my-tickets");

  // New ticket form state
  const [subject, setSubject] = React.useState("");
  const [category, setCategory] = React.useState("General Inquiry");
  const [priority, setPriority] = React.useState<"low" | "medium" | "high" | "urgent">("medium");
  const [message, setMessage] = React.useState("");
  const [feedbackMsg, setFeedbackMsg] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  // Ticket reply form state per ticket
  const [expandedTicketId, setExpandedTicketId] = React.useState<string | null>(null);
  const [replyMessage, setReplyMessage] = React.useState("");
  const [sendingReply, setSendingReply] = React.useState(false);

  // FAQ search query state
  const [faqSearch, setFaqSearch] = React.useState("");
  const [expandedFaqIndex, setExpandedFaqIndex] = React.useState<number | null>(null);

  const fetchTickets = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/support");
      const data = await res.json();
      if (data.success) {
        setTickets(data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch support tickets:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setFeedbackMsg({ type: "error", text: "Please enter both a subject and a description for your issue." });
      return;
    }

    setSubmitting(true);
    setFeedbackMsg(null);

    try {
      const stored = localStorage.getItem("user_profile");
      let userName = "Candidate User";
      let userEmail = "candidate@example.com";
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.fullName) userName = parsed.fullName;
          if (parsed.email) userEmail = parsed.email;
        } catch {
          // ignore
        }
      }

      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName,
          userEmail,
          subject,
          category,
          priority,
          message,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setFeedbackMsg({
          type: "success",
          text: `Ticket #${data.data.id} submitted successfully! Our support specialists will review and respond shortly.`,
        });
        setSubject("");
        setMessage("");
        setCategory("General Inquiry");
        setPriority("medium");
        fetchTickets();
        setActiveTab("my-tickets");
      } else {
        setFeedbackMsg({ type: "error", text: data.error || "Failed to submit support ticket." });
      }
    } catch (err: any) {
      setFeedbackMsg({ type: "error", text: "Network error occurred while submitting ticket." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendReply = async (ticketId: string) => {
    if (!replyMessage.trim()) return;
    setSendingReply(true);

    const stored = localStorage.getItem("user_profile");
    let senderName = "Candidate User";
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.fullName) senderName = parsed.fullName;
      } catch {
        // ignore
      }
    }

    try {
      const res = await fetch("/api/support", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId,
          reply: {
            senderName,
            senderRole: "Candidate",
            message: replyMessage,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReplyMessage("");
        fetchTickets();
      }
    } catch (err) {
      console.error("Failed to post reply:", err);
    } finally {
      setSendingReply(false);
    }
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case "urgent":
        return <Badge className="bg-red-500/20 text-red-400 border border-red-500/30">Urgent</Badge>;
      case "high":
        return <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30">High</Badge>;
      case "medium":
        return <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">Medium</Badge>;
      default:
        return <Badge className="bg-slate-500/20 text-slate-400 border border-slate-500/30">Low</Badge>;
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case "open":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Open</Badge>;
      case "in_progress":
        return <Badge className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">In Progress</Badge>;
      case "resolved":
        return <Badge className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">Resolved</Badge>;
      case "closed":
        return <Badge className="bg-slate-700 text-slate-400 border border-slate-600">Closed</Badge>;
      default:
        return <Badge className="bg-slate-500/20 text-slate-400">Submitted</Badge>;
    }
  };

  const faqs = [
    {
      q: "How does domain-specific tailoring work for non-IT fields?",
      a: "HireBoost AI adapts keywords, technical skill taxonomies, ATS scoring metrics, and executive bullet points to match your selected domain—whether in Medical & Healthcare, Law & Legal Compliance, Civil/Mechanical Engineering, Financial Accounting, Design, or Human Resources.",
    },
    {
      q: "Can I generate different resumes for different job postings?",
      a: "Yes! Use the Executive CV Studio to enter the target company name and job description. Groq AI synthesizes your profile history into a tailored resume emphasizing relevant experience.",
    },
    {
      q: "How do I upgrade or manage my subscription?",
      a: "Navigate to Dashboard > Settings or click Upgrade Plan in the sidebar. We support instant activation with full access to ATS resume exports and candidate matching.",
    },
    {
      q: "Where can I view responses to my support requests?",
      a: "All active tickets and responses from the HireBoost operations team appear right here in the 'My Tickets' tab. You will also receive an in-app notification when an admin updates your ticket status.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (item) =>
      item.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
      item.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-950/60 to-slate-900/90 border border-blue-500/20 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <LifeBuoy className="w-3.5 h-3.5" /> 24/7 Candidate Support Center
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Support Online
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Help & Technical Support</h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Get prompt assistance with candidate profile setup, dynamic resume generation, ATS domain optimization, or billing inquiries.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => setActiveTab("submit")}
              className={`gap-2 text-sm font-semibold transition-all ${
                activeTab === "submit"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                  : "bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700"
              }`}
            >
              <Send className="w-4 h-4" /> Create Ticket
            </Button>
            <Button
              onClick={() => setActiveTab("my-tickets")}
              className={`gap-2 text-sm font-semibold transition-all ${
                activeTab === "my-tickets"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                  : "bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700"
              }`}
            >
              <MessageSquare className="w-4 h-4" /> My Tickets ({tickets.length})
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs Control */}
      <div className="flex items-center border-b border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab("my-tickets")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "my-tickets"
              ? "border-blue-500 text-blue-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <MessageSquare className="w-4 h-4" /> My Tickets
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
            {tickets.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("submit")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "submit"
              ? "border-blue-500 text-blue-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Send className="w-4 h-4" /> Submit Request
        </button>
        <button
          onClick={() => setActiveTab("faq")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "faq"
              ? "border-blue-500 text-blue-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <HelpCircle className="w-4 h-4" /> Knowledge Base & FAQ
        </button>
      </div>

      {/* TAB CONTENT: Submit New Ticket */}
      {activeTab === "submit" && (
        <Card className="bg-slate-900/60 border-slate-800 p-6 md:p-8 backdrop-blur-xl shadow-xl">
          <div className="max-w-3xl">
            <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" /> Submit a Technical or Account Support Request
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              Our support team and Groq AI support assistant review submitted tickets promptly.
            </p>

            {feedbackMsg && (
              <div
                className={`p-4 rounded-xl border mb-6 flex items-start gap-3 ${
                  feedbackMsg.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : "bg-red-500/10 border-red-500/30 text-red-300"
                }`}
              >
                {feedbackMsg.type === "success" ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
                )}
                <div className="text-sm">{feedbackMsg.text}</div>
              </div>
            )}

            <form onSubmit={handleSubmitTicket} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Resume & CV Studio">Resume & CV Studio</option>
                    <option value="Domain Personalization">Domain & Field Customization</option>
                    <option value="Subscription & Billing">Subscription & Billing</option>
                    <option value="Technical Bug">Technical Bug Report</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="low">Low - General question</option>
                    <option value="medium">Medium - Normal assistance</option>
                    <option value="high">High - Resume/generation blocker</option>
                    <option value="urgent">Urgent - Account access critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Subject Header
                </label>
                <input
                  type="text"
                  placeholder="e.g., Assistance with Medical domain resume tailoring..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Detailed Description & Context
                </label>
                <textarea
                  rows={6}
                  placeholder="Please describe what you need help with, any error messages, or target goals..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-6 py-2.5 rounded-lg shadow-lg shadow-blue-500/20 gap-2 text-sm"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Submitting Ticket...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Submit Support Request
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      )}

      {/* TAB CONTENT: My Support Tickets */}
      {activeTab === "my-tickets" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" /> Your Support History
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchTickets}
              className="border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800 text-xs gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh List
            </Button>
          </div>

          {loading ? (
            <Card className="bg-slate-900/50 border-slate-800 p-12 text-center">
              <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-3" />
              <p className="text-slate-400 text-sm">Loading support history from database...</p>
            </Card>
          ) : tickets.length === 0 ? (
            <Card className="bg-slate-900/50 border-slate-800 p-12 text-center">
              <LifeBuoy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">No Support Tickets Found</h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
                You haven't submitted any support requests yet. If you have questions regarding your resume, ATS matching, or subscription, feel free to open a ticket.
              </p>
              <Button
                onClick={() => setActiveTab("submit")}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm gap-2"
              >
                <Send className="w-4 h-4" /> Create First Ticket
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => {
                const isExpanded = expandedTicketId === ticket.id;
                return (
                  <Card
                    key={ticket.id}
                    className="bg-slate-900/60 border-slate-800 overflow-hidden backdrop-blur-xl transition-all"
                  >
                    <div
                      onClick={() => setExpandedTicketId(isExpanded ? null : ticket.id)}
                      className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs text-blue-400 font-semibold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                            #{ticket.id}
                          </span>
                          <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full">
                            {ticket.category}
                          </span>
                          {getPriorityBadge(ticket.priority)}
                          {getStatusBadge(ticket.status)}
                        </div>
                        <h3 className="text-base font-bold text-white mt-1">{ticket.subject}</h3>
                        <p className="text-slate-400 text-xs line-clamp-1">{ticket.message}</p>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-400 shrink-0">
                        <div className="text-right">
                          <div>Submitted {new Date(ticket.createdAt).toLocaleDateString()}</div>
                          <div className="text-blue-400 font-medium">
                            {ticket.replies.length} {ticket.replies.length === 1 ? "response" : "responses"}
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* Expanded Detail & Reply Section */}
                    {isExpanded && (
                      <div className="border-t border-slate-800/80 bg-slate-950/60 p-5 space-y-6">
                        {/* Original Ticket Description */}
                        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-blue-400" /> {ticket.userName} (You)
                            </span>
                            <span className="text-xs text-slate-500">
                              {new Date(ticket.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-slate-300 text-sm whitespace-pre-line">{ticket.message}</p>
                        </div>

                        {/* Thread Replies */}
                        {ticket.replies && ticket.replies.length > 0 && (
                          <div className="space-y-4">
                            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                              Ticket Activity & Conversation ({ticket.replies.length})
                            </h4>
                            {ticket.replies.map((reply) => {
                              const isAdmin = reply.senderRole === "Admin" || reply.senderRole === "Support Specialist";
                              return (
                                <div
                                  key={reply.id}
                                  className={`rounded-xl p-4 border ${
                                    isAdmin
                                      ? "bg-blue-950/40 border-blue-500/30 ml-4 md:ml-8"
                                      : "bg-slate-900/80 border-slate-800 mr-4 md:mr-8"
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-white flex items-center gap-2">
                                      {isAdmin ? (
                                        <Badge className="bg-blue-500 text-white text-[10px] px-1.5 py-0">
                                          Support Agent
                                        </Badge>
                                      ) : (
                                        <Badge className="bg-slate-800 text-slate-300 text-[10px] px-1.5 py-0">
                                          Candidate
                                        </Badge>
                                      )}
                                      <span className={isAdmin ? "text-blue-300 font-bold" : "text-slate-200"}>
                                        {reply.senderName}
                                      </span>
                                    </span>
                                    <span className="text-xs text-slate-500">
                                      {new Date(reply.createdAt).toLocaleString()}
                                    </span>
                                  </div>
                                  <p className="text-slate-300 text-sm whitespace-pre-line">{reply.message}</p>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Send Additional Reply Form */}
                        {ticket.status !== "closed" && (
                          <div className="pt-2">
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                              Add Follow-up Message
                            </label>
                            <div className="flex flex-col sm:flex-row gap-3">
                              <input
                                type="text"
                                placeholder="Type your response or additional information..."
                                value={replyMessage}
                                onChange={(e) => setReplyMessage(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSendReply(ticket.id);
                                }}
                                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                              />
                              <Button
                                onClick={() => handleSendReply(ticket.id)}
                                disabled={sendingReply || !replyMessage.trim()}
                                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg text-sm gap-2"
                              >
                                {sendingReply ? (
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Send className="w-4 h-4" />
                                )}
                                Send Reply
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: Knowledge Base & FAQ */}
      {activeTab === "faq" && (
        <Card className="bg-slate-900/60 border-slate-800 p-6 md:p-8 backdrop-blur-xl">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-400" /> Frequently Asked Questions
              </h2>
              <p className="text-slate-400 text-sm">
                Find quick answers to common questions about your dynamic profile, domain customization, and ATS scoring.
              </p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search knowledge base articles..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-3">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = expandedFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-800 rounded-xl bg-slate-950/40 overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFaqIndex(isOpen ? null : idx)}
                      className="w-full text-left p-4 flex items-center justify-between font-semibold text-slate-200 text-sm hover:bg-slate-800/40 transition-colors"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="p-4 pt-0 text-slate-400 text-sm border-t border-slate-800/50 bg-slate-900/20 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
