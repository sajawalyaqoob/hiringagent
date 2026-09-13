import { NextResponse } from "next/server";
import { resumeService } from "@/lib/services/resume-service";

export async function GET() {
  try {
    const resumes = await resumeService.getResumes();
    return NextResponse.json({ success: true, data: resumes });
  } catch (error) {
    console.error("[API resumes GET]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve resumes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.fileName || !body.fileType) {
      return NextResponse.json(
        { success: false, error: "Missing required resume metadata" },
        { status: 400 }
      );
    }

    const newResume = await resumeService.uploadMockResume({
      title: body.title,
      fileName: body.fileName,
      fileSize: body.fileSize || 150000,
      fileType: body.fileType,
    });

    return NextResponse.json({ success: true, data: newResume }, { status: 201 });
  } catch (error) {
    console.error("[API resumes POST]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process resume upload" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, action, title } = body;

    if (!id || !action) {
      return NextResponse.json(
        { success: false, error: "id and action are required" },
        { status: 400 }
      );
    }

    if (action === "set_primary") {
      await resumeService.setPrimary(id);
      return NextResponse.json({ success: true, message: "Primary resume updated" });
    }

    if (action === "rename" && title) {
      const updated = await resumeService.renameResume(id, title);
      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json({ success: false, error: "Unsupported action" }, { status: 400 });
  } catch (error) {
    console.error("[API resumes PATCH]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update resume" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Resume id is required" },
        { status: 400 }
      );
    }

    const deleted = await resumeService.deleteResume(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Resume not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Resume deleted" });
  } catch (error) {
    console.error("[API resumes DELETE]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete resume" },
      { status: 500 }
    );
  }
}
