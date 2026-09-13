import { NextResponse } from "next/server";
import { jobService } from "@/lib/services/job-service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || undefined;
    const minScore = searchParams.get("minScore") ? parseInt(searchParams.get("minScore")!, 10) : undefined;
    const workplaceType = searchParams.get("workplace") || undefined;
    const seniority = searchParams.get("seniority") || undefined;
    const jobId = searchParams.get("id");

    if (jobId) {
      const single = await jobService.getJobById(jobId);
      if (!single) {
        return NextResponse.json({ success: false, error: "Job not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: single });
    }

    const jobs = await jobService.getRecommendedJobs({
      query,
      minScore,
      workplaceType,
      seniority,
    });

    return NextResponse.json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    console.error("[API jobs GET]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve jobs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, company, location, description, sourceUrl } = body;

    if (!title || !company || !description) {
      return NextResponse.json(
        { success: false, error: "Title, company, and description are required" },
        { status: 400 }
      );
    }

    const result = await jobService.analyzePastedJob({
      title,
      company,
      location: location || "Remote / Not Specified",
      description,
      sourceUrl,
    });

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    console.error("[API jobs POST]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to analyze job description" },
      { status: 500 }
    );
  }
}
