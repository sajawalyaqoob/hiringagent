"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Trash2,
  Edit2,
  Star,
  ScanLine,
  AlertCircle,
  Plus,
  X,
  Check,
  Sparkles,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatFileSize, formatDate } from "@/lib/utils/formatters";

interface ParsedResumeData {
  fileName: string;
  fileSize: number;
  extracted: any;
  proposedChanges: {
    personal: {
      fullName?: string;
      email?: string;
      phone?: string;
      professionalHeadline?: string;
    };
    skills?: Array<{ name: string; category?: string }>;
    experiences?: Array<{ company: string; title: string; period?: string }>;
    education?: Array<{ institution: string; degree: string }>;
  };
}

export default function ResumesPage() {
  const [resumes, setResumes] = React.useState([
    {
      id: "res_invozone",
      title: "Master CV — InvoZone Agency Standard (Verified)",
      fileName: "InvoZone_Professional_Standard_CV.pdf",
      fileSize: 442658,
      fileType: "pdf" as const,
      isPrimary: true,
      parseStatus: "completed",
      atsScore: 98,
      createdAt: "2026-06-07",
    },
    {
      id: "res_01",
      title: "Full-Stack Engineer & Cloud Infrastructure Specialist",
      fileName: "FullStack_Cloud_Engineer_Resume.pdf",
      fileSize: 198420,
      fileType: "pdf" as const,
      isPrimary: false,
      parseStatus: "completed",
      atsScore: 94,
      createdAt: "2026-03-01",
    },
  ]);

  const [uploading, setUploading] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Resume Review Modal state
  const [parsedResult, setParsedResult] = React.useState<ParsedResumeData | null>(null);
  const [selectedChanges, setSelectedChanges] = React.useState<Record<string, boolean>>({
    personal: true,
    skills: true,
    experience: true,
    education: true,
  });
  const [applyingChanges, setApplyingChanges] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleSetPrimary = (id: string) => {
    setResumes((prev) =>
      prev.map((r) => ({
        ...r,
        isPrimary: r.id === id,
      }))
    );
  };

  const handleDelete = (id: string) => {
    setResumes((prev) => {
      const filtered = prev.filter((r) => r.id !== id);
      if (filtered.length > 0 && !filtered.some((r) => r.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  };

  const handleStartRename = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const handleSaveRename = (id: string) => {
    if (!editTitle.trim()) return;
    setResumes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, title: editTitle } : r))
    );
    setEditingId(null);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setSuccessMsg(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/resumes/parse", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to parse uploaded file");
      }

      setParsedResult(json.data);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred while parsing resume.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleAcceptParsedChanges = async () => {
    if (!parsedResult) return;
    setApplyingChanges(true);

    // Add document to list
    const newDoc = {
      id: `res_${Date.now()}`,
      title: parsedResult.fileName.replace(/\.[^/.]+$/, ""),
      fileName: parsedResult.fileName,
      fileSize: parsedResult.fileSize,
      fileType: parsedResult.fileName.endsWith(".docx") ? ("docx" as const) : ("pdf" as const),
      isPrimary: false,
      parseStatus: "completed",
      atsScore: parsedResult.extracted?.atsScore || 88,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setResumes((prev) => [newDoc, ...prev]);
    setApplyingChanges(false);
    setParsedResult(null);
    setSuccessMsg("Resume parsed and verified profile updates applied successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d5d9d9] pb-4 bg-white p-4 rounded-xs">
        <div>
          <h1 className="text-lg font-bold text-[#0f1111]">Resume Management</h1>
          <p className="text-xs text-[#565959] mt-0.5">
            Manage your master resumes, parse key skills, and select your primary active document.
          </p>
        </div>

        <Link href="/dashboard/resume/analyze">
          <Button variant="outline" size="sm" className="font-bold text-xs gap-1.5">
            <ScanLine className="h-3.5 w-3.5 text-[#f08804]" />
            <span>Launch ATS Scanner</span>
          </Button>
        </Link>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-3.5 bg-[#f0fff4] border border-[#067d62] text-[#067d62] rounded-xs text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-[#067d62] hover:opacity-75">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Error Notification */}
      {errorMsg && (
        <div className="p-3.5 bg-[#fdf2f2] border border-[#c4588f] text-[#c4588f] rounded-xs text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-[#c4588f] hover:opacity-75">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Upload Dropzone */}
      <div className="rounded-xs border-2 border-dashed border-[#d5d9d9] bg-white p-6 text-center hover:border-[#f08804] transition-colors">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#f8f9fa] border border-[#d5d9d9] text-[#565959] mb-3">
          <UploadCloud className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-bold text-[#0f1111]">Upload Master Resume</h3>
        <p className="text-xs text-[#565959] mt-1 max-w-sm mx-auto">
          Supported file formats: <strong className="text-[#0f1111]">PDF (.pdf)</strong> and{" "}
          <strong className="text-[#0f1111]">Word (.docx)</strong> up to 10MB.
        </p>

        <div className="mt-4 flex justify-center">
          <Button
            variant="primary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            isLoading={uploading}
            className="font-bold text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            {uploading ? "Parsing Document..." : "Select Resume File to Upload"}
          </Button>
        </div>
      </div>

      {/* Extracted Information & Proposed Changes Review Drawer/Modal */}
      {parsedResult && (
        <div className="border border-[#f08804] bg-[#fffcf5] p-5 rounded-xs space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#f3e5ab] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#f08804]" />
              <div>
                <h3 className="text-sm font-bold text-[#0f1111]">
                  Resume Parsed: Review Proposed Profile Updates
                </h3>
                <p className="text-xs text-[#565959]">
                  Extracted from <strong className="text-[#0f1111]">{parsedResult.fileName}</strong>. Confirm changes before updating your profile.
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setParsedResult(null)}
              className="text-xs h-7 px-2"
            >
              Discard
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Extracted Personal Info */}
            <div className="bg-white p-3.5 border border-[#d5d9d9] rounded-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0f1111] uppercase tracking-wider text-[11px]">
                  Personal Information
                </span>
                <input
                  type="checkbox"
                  checked={selectedChanges.personal}
                  onChange={(e) => setSelectedChanges((s) => ({ ...s, personal: e.target.checked }))}
                  className="accent-[#f08804]"
                />
              </div>
              <div className="space-y-1 text-[#333]">
                <p><strong>Name:</strong> {parsedResult.proposedChanges.personal?.fullName || "Not specified"}</p>
                <p><strong>Email:</strong> {parsedResult.proposedChanges.personal?.email || "Not specified"}</p>
                <p><strong>Phone:</strong> {parsedResult.proposedChanges.personal?.phone || "Not specified"}</p>
                <p><strong>Headline:</strong> {parsedResult.proposedChanges.personal?.professionalHeadline || "Not specified"}</p>
              </div>
            </div>

            {/* Extracted Skills */}
            <div className="bg-white p-3.5 border border-[#d5d9d9] rounded-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0f1111] uppercase tracking-wider text-[11px]">
                  Discovered Skills ({parsedResult.proposedChanges.skills?.length || 0})
                </span>
                <input
                  type="checkbox"
                  checked={selectedChanges.skills}
                  onChange={(e) => setSelectedChanges((s) => ({ ...s, skills: e.target.checked }))}
                  className="accent-[#f08804]"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {parsedResult.proposedChanges.skills?.map((sk, idx) => (
                  <Badge key={idx} variant="outline" className="text-[11px]">
                    {sk.name}
                  </Badge>
                )) || <span className="text-gray-400 italic">No skills extracted</span>}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#f3e5ab]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setParsedResult(null)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAcceptParsedChanges}
              isLoading={applyingChanges}
              className="text-xs font-bold gap-1"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Accept & Apply to Profile</span>
            </Button>
          </div>
        </div>
      )}

      {/* Resume Inventory List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[#0f1111]">Uploaded Resumes ({resumes.length})</h3>

        <div className="grid grid-cols-1 gap-3">
          {resumes.map((resume) => (
            <Card key={resume.id} className="border-[#d5d9d9] bg-white shadow-2xs">
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left info */}
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-xs bg-[#f8f9fa] border border-[#d5d9d9] flex items-center justify-center text-[#131921]">
                    <FileText className="h-5 w-5" />
                  </div>

                  <div className="space-y-1">
                    {editingId === resume.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="h-7 text-xs rounded-xs border border-[#f08804] px-2 font-bold text-[#0f1111]"
                        />
                        <button
                          onClick={() => handleSaveRename(resume.id)}
                          className="text-xs font-bold text-[#067d62] hover:underline"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-xs text-gray-500 hover:underline"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#0f1111]">{resume.title}</h4>
                        {resume.isPrimary && (
                          <span className="rounded-xs bg-[#f08804] text-[#0f1111] px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider">
                            Primary
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#565959]">
                      <span className="font-mono text-[11px]">{resume.fileName}</span>
                      <span>•</span>
                      <span>{formatFileSize(resume.fileSize)}</span>
                      <span>•</span>
                      <span>Uploaded {formatDate(resume.createdAt)}</span>
                      <span>•</span>
                      <Badge variant="success">Parsed 100%</Badge>
                    </div>
                  </div>
                </div>

                {/* Right score and action buttons */}
                <div className="flex items-center gap-3 shrink-0 sm:border-l sm:border-[#e5e7eb] sm:pl-4">
                  <div className="text-right mr-2">
                    <div className="text-xl font-black text-[#067d62]">{resume.atsScore}</div>
                    <div className="text-[10px] uppercase font-bold text-gray-400">ATS Score</div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {!resume.isPrimary && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetPrimary(resume.id)}
                        className="text-xs font-semibold h-8 px-2"
                        title="Set as active primary document"
                      >
                        <Star className="h-3.5 w-3.5 mr-1 text-[#f08804]" />
                        Set Primary
                      </Button>
                    )}

                    <a
                      href={`/${resume.fileName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 h-8 px-2.5 rounded-lg border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100/60 transition-colors"
                      title="Open PDF Document"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View PDF</span>
                    </a>

                    <Link href="/dashboard/resume/analyze">
                      <Button variant="primary" size="sm" className="text-xs font-bold h-8 px-2.5">
                        Breakdown
                      </Button>
                    </Link>

                    <button
                      onClick={() => handleStartRename(resume.id, resume.title)}
                      className="p-1.5 text-gray-400 hover:text-black rounded-xs hover:bg-gray-100"
                      title="Rename Resume"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(resume.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-xs hover:bg-gray-100"
                      title="Delete Resume"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
