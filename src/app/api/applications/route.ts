import { NextResponse } from "next/server";
import { applicationService } from "@/lib/services/application-service";
import type { ApplicationStage } from "@/types/database";

export async function GET() {
  try {
    const apps = await applicationService.getApplications();
    return NextResponse.json({ success: true, data: apps });
  } catch (error) {
    console.error("[API applications GET]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve applications" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.jobTitle || !body.company) {
      return NextResponse.json(
        { success: false, error: "Job title and company are required" },
        { status: 400 }
      );
    }

    const created = await applicationService.createApplication({
      jobTitle: body.jobTitle,
      company: body.company,
      location: body.location || "Remote",
      status: (body.status as ApplicationStage) || "saved",
      appliedDate: body.appliedDate,
      salaryOffered: body.salaryOffered,
      notes: body.notes,
      nextAction: body.nextAction,
      nextActionDueDate: body.nextActionDueDate,
      recruiterName: body.recruiterName,
      recruiterEmail: body.recruiterEmail,
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error("[API applications POST]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create application" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, notes, nextAction, nextActionDueDate } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Application id is required" },
        { status: 400 }
      );
    }

    let updated;
    if (status) {
      updated = await applicationService.updateStage(id, status as ApplicationStage);
    } else {
      updated = await applicationService.updateApplication(id, {
        notes,
        nextAction,
        nextActionDueDate,
      });
    }

    if (!updated) {
      return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[API applications PATCH]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update application" },
      { status: 500 }
    );
  }
}
