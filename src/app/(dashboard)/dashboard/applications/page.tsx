"use client";

import * as React from "react";
import Link from "next/link";
import {
  Layers,
  Plus,
  Calendar,
  Clock,
  User,
  Mail,
  Globe,
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle2,
  Table,
  Kanban,
  Edit2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils/formatters";
import type { ApplicationStage } from "@/types/database";

const STAGES: Array<{ id: ApplicationStage; label: string; color: string }> = [
  { id: "saved", label: "Saved", color: "border-gray-400 text-gray-700 bg-gray-50" },
  { id: "applied", label: "Applied", color: "border-blue-400 text-blue-800 bg-blue-50" },
  { id: "recruiter_contacted", label: "Contacted", color: "border-amber-400 text-amber-800 bg-amber-50" },
  { id: "interview", label: "Interview Loop", color: "border-emerald-500 text-emerald-800 bg-emerald-50" },
  { id: "offer", label: "Offer Received", color: "border-purple-500 text-purple-800 bg-purple-50" },
  { id: "rejected", label: "Archived / Rejected", color: "border-red-400 text-red-800 bg-red-50" },
];

export default function ApplicationsTrackerPage() {
  const [viewMode, setViewMode] = React.useState<"kanban" | "table">("kanban");
  const [addModalOpen, setAddModalOpen] = React.useState(false);

  const [applications, setApplications] = React.useState([
    {
      id: "app_01",
      jobTitle: "Senior Full-Stack Engineer (Core Platform)",
      company: "Stripe",
      location: "Seattle, WA (Remote US)",
      status: "interview" as ApplicationStage,
      appliedDate: "2026-02-28",
      notes: "Completed initial recruiter screen. Architecture round scheduled for next Thursday.",
      recruiter: {
        name: "Sarah Jenkins",
        email: "sjenkins@stripe.com",
        title: "Senior Technical Recruiter",
        linkedIn: "https://linkedin.com/in/sarah-jenkins-recruiter",
      },
      nextAction: "Review distributed transaction isolation levels & Go channels",
      nextActionDueDate: "2026-03-12",
    },
    {
      id: "app_02",
      jobTitle: "Lead Frontend Engineer (Design Systems)",
      company: "Vercel",
      location: "Remote",
      status: "recruiter_contacted" as ApplicationStage,
      appliedDate: "2026-03-02",
      notes: "Sent tailored cold outreach to Design Infrastructure engineering manager.",
      recruiter: {
        name: "Marcus Vance",
        email: "mvance@vercel.com",
        title: "Engineering Manager",
        linkedIn: "https://linkedin.com/in/marcus-vance-dev",
      },
      nextAction: "Follow up via LinkedIn message if no reply by Monday",
      nextActionDueDate: "2026-03-09",
    },
    {
      id: "app_03",
      jobTitle: "Principal Cloud Engineer",
      company: "Amazon Web Services",
      location: "Seattle, WA",
      status: "saved" as ApplicationStage,
      appliedDate: "2026-03-04",
      notes: "Saved from internal referral recommendation.",
      nextAction: "Tailor resume using HireBoost AI Studio",
      nextActionDueDate: "2026-03-10",
    },
    {
      id: "app_04",
      jobTitle: "Senior Software Engineer - Infrastructure",
      company: "Atlassian",
      location: "Remote",
      status: "applied" as ApplicationStage,
      appliedDate: "2026-02-24",
      notes: "Submitted tailored application through company portal.",
      nextAction: "Check portal status",
      nextActionDueDate: "2026-03-10",
    },
    {
      id: "app_05",
      jobTitle: "Staff Software Engineer",
      company: "Meta",
      location: "Bellevue, WA",
      status: "offer" as ApplicationStage,
      appliedDate: "2026-01-18",
      notes: "Verbal offer extended. Reviewing total compensation breakdown.",
      nextAction: "Compare benefits and negotiate signing bonus",
      nextActionDueDate: "2026-03-15",
    },
  ]);

  // New Application Form State
  const [newTitle, setNewTitle] = React.useState("");
  const [newCompany, setNewCompany] = React.useState("");
  const [newLocation, setNewLocation] = React.useState("Remote");
  const [newStage, setNewStage] = React.useState<ApplicationStage>("applied");
  const [newNextAction, setNewNextAction] = React.useState("");
  const [newDueDate, setNewDueDate] = React.useState("2026-03-15");
  const [newRecruiterName, setNewRecruiterName] = React.useState("");
  const [newRecruiterEmail, setNewRecruiterEmail] = React.useState("");
  const [newNotes, setNewNotes] = React.useState("");

  const handleAddApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCompany) return;

    const newApp = {
      id: `app_${Date.now()}`,
      jobTitle: newTitle,
      company: newCompany,
      location: newLocation,
      status: newStage,
      appliedDate: new Date().toISOString().split("T")[0],
      notes: newNotes,
      recruiter: newRecruiterName
        ? {
            name: newRecruiterName,
            email: newRecruiterEmail,
            title: "Technical Recruiter",
            linkedIn: "",
          }
        : undefined,
      nextAction: newNextAction || "Follow up on status",
      nextActionDueDate: newDueDate,
    };

    setApplications([newApp, ...applications]);
    setAddModalOpen(false);
    setNewTitle("");
    setNewCompany("");
    setNewNotes("");
    setNewNextAction("");
  };

  const moveStage = (appId: string, direction: "next" | "prev") => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        const currentIdx = STAGES.findIndex((s) => s.id === app.status);
        const newIdx = direction === "next" ? currentIdx + 1 : currentIdx - 1;
        if (newIdx < 0 || newIdx >= STAGES.length) return app;
        return { ...app, status: STAGES[newIdx].id };
      })
    );
  };

  const deleteApp = (appId: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== appId));
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d5d9d9] pb-4 bg-white p-4 rounded-xs">
        <div>
          <h1 className="text-lg font-bold text-[#0f1111]">Application Pipeline Tracker</h1>
          <p className="text-xs text-[#565959] mt-0.5">
            Stage-gated candidate tracking across discovery, submissions, recruiter contact, and interview loops.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex rounded-xs border border-[#d5d9d9] bg-white p-0.5">
            <button
              onClick={() => setViewMode("kanban")}
              className={`p-1.5 rounded-xs text-xs font-semibold flex items-center gap-1 ${
                viewMode === "kanban" ? "bg-[#131921] text-white" : "text-[#565959] hover:bg-gray-100"
              }`}
              title="Kanban Board View"
            >
              <Kanban className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-xs text-xs font-semibold flex items-center gap-1 ${
                viewMode === "table" ? "bg-[#131921] text-white" : "text-[#565959] hover:bg-gray-100"
              }`}
              title="Table View"
            >
              <Table className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setAddModalOpen(true)}
            className="font-bold text-xs gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Application</span>
          </Button>
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-3 overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const stageApps = applications.filter((a) => a.status === stage.id);
            return (
              <div
                key={stage.id}
                className="flex flex-col rounded-xs border border-[#d5d9d9] bg-[#f8f9fa] min-w-[240px] max-h-[75vh]"
              >
                {/* Column Header */}
                <div className={`p-2.5 border-b border-[#d5d9d9] flex items-center justify-between font-bold text-xs ${stage.color}`}>
                  <span>{stage.label}</span>
                  <span className="rounded-full bg-white px-1.5 py-0.2 text-[11px] font-bold border border-gray-300">
                    {stageApps.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {stageApps.length === 0 ? (
                    <div className="py-8 text-center text-[11px] text-gray-400">
                      No applications in this stage
                    </div>
                  ) : (
                    stageApps.map((app) => (
                      <div
                        key={app.id}
                        className="rounded-xs border border-[#d5d9d9] bg-white p-3 shadow-2xs space-y-2 text-xs hover:border-[#9ca3af] transition-colors"
                      >
                        <div>
                          <span className="text-[10px] uppercase font-bold text-gray-400">
                            {app.company}
                          </span>
                          <h4 className="font-bold text-[#0f1111] leading-tight text-xs">
                            {app.jobTitle}
                          </h4>
                          <p className="text-[10px] text-gray-500 mt-0.5">{app.location}</p>
                        </div>

                        {app.nextAction && (
                          <div className="rounded-xs bg-[#f8f9fa] border border-[#e5e7eb] p-2 text-[11px] space-y-1">
                            <span className="font-bold text-[#b45309] block">Next Action:</span>
                            <p className="text-gray-700 leading-tight">{app.nextAction}</p>
                            {app.nextActionDueDate && (
                              <div className="flex items-center gap-1 text-gray-500 text-[10px] pt-1">
                                <Clock className="h-3 w-3" />
                                <span>Due: {formatDate(app.nextActionDueDate)}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {app.recruiter && (
                          <div className="flex items-center gap-1.5 text-[10px] text-gray-600 border-t border-[#f3f4f6] pt-1.5">
                            <User className="h-3 w-3 text-[#f08804]" />
                            <span className="font-medium truncate">{app.recruiter.name}</span>
                          </div>
                        )}

                        {/* Quick Move Buttons */}
                        <div className="flex items-center justify-between border-t border-[#f3f4f6] pt-2">
                          <button
                            type="button"
                            onClick={() => moveStage(app.id, "prev")}
                            disabled={app.status === "saved"}
                            className="text-[10px] font-bold text-gray-500 hover:text-black disabled:opacity-30"
                          >
                            ← Prev
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteApp(app.id)}
                            className="text-gray-400 hover:text-red-600"
                            title="Remove"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveStage(app.id, "next")}
                            disabled={app.status === "rejected"}
                            className="text-[10px] font-bold text-[#b45309] hover:underline disabled:opacity-30"
                          >
                            Next →
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === "table" && (
        <Card className="border-[#d5d9d9] bg-white shadow-2xs">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#e5e7eb] bg-[#f8f9fa] text-[11px] font-bold uppercase text-[#565959]">
                    <th className="py-2.5 px-4">Opportunity</th>
                    <th className="py-2.5 px-4">Company</th>
                    <th className="py-2.5 px-4">Stage</th>
                    <th className="py-2.5 px-4">Applied Date</th>
                    <th className="py-2.5 px-4">Next Action</th>
                    <th className="py-2.5 px-4">Recruiter</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3f4f6]">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-bold text-[#0f1111]">{app.jobTitle}</td>
                      <td className="py-3 px-4 text-[#565959]">{app.company}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="capitalize">
                          {app.status.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-500">{formatDate(app.appliedDate)}</td>
                      <td className="py-3 px-4 max-w-xs truncate text-gray-700 font-medium">
                        {app.nextAction}
                      </td>
                      <td className="py-3 px-4 text-gray-500">
                        {app.recruiter?.name || "—"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => deleteApp(app.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Application Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Track New Application"
        description="Record details for a role you applied to or discovered."
      >
        <form onSubmit={handleAddApplication} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-[#0f1111]">Job Title</label>
            <Input
              placeholder="e.g. Senior Software Engineer"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-[#0f1111]">Company</label>
              <Input
                placeholder="e.g. Stripe"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="font-bold text-[#0f1111]">Location</label>
              <Input
                placeholder="e.g. Remote"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-[#0f1111]">Current Pipeline Stage</label>
              <select
                value={newStage}
                onChange={(e) => setNewStage(e.target.value as ApplicationStage)}
                className="h-8 w-full rounded-xs border border-[#d5d9d9] bg-white px-2 text-xs text-[#0f1111] focus:border-[#f08804] focus:outline-none"
              >
                {STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-bold text-[#0f1111]">Follow-Up Due Date</label>
              <Input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-[#0f1111]">Next Scheduled Action</label>
            <Input
              placeholder="e.g. Send cold follow-up email to engineering manager"
              value={newNextAction}
              onChange={(e) => setNewNextAction(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-[#0f1111]">Recruiter Name (Optional)</label>
              <Input
                placeholder="e.g. Sarah Jenkins"
                value={newRecruiterName}
                onChange={(e) => setNewRecruiterName(e.target.value)}
              />
            </div>
            <div>
              <label className="font-bold text-[#0f1111]">Recruiter Email (Optional)</label>
              <Input
                placeholder="e.g. recruiter@company.com"
                value={newRecruiterEmail}
                onChange={(e) => setNewRecruiterEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-[#0f1111]">Interview & Strategy Notes</label>
            <Textarea
              rows={3}
              placeholder="Add interview feedback, recruiter phone screen dates, or compensation discussions..."
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#f3f4f6]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" className="font-bold">
              Save to Pipeline
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
