import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Task from "@/models/Task";
import Project from "@/models/Project";
import { authenticate } from "@/middleware/authMiddleware";
import { ApiError } from "@/utils/apiError";
import { asyncHandler } from "@/utils/asyncHandler";

export const GET = asyncHandler(async (req: NextRequest) => {
  const user = authenticate(req);

  await connectDB();

  const { searchParams } = new URL(req.url);

  const query = searchParams.get("q");
  const limit = Number(searchParams.get("limit")) || 20;

  if (!query) {
    throw new ApiError(400, "Search query required");
  }

  // Find projects the user belongs to
  const projects = await Project.find({
    $or: [{ owner: user.id }, { members: user.id }],
  }).select("_id");

  const projectIds = projects.map((p) => p._id);

  // Text search
  const tasks = await Task.find(
    {
      projectId: { $in: projectIds },
      $text: { $search: query },
    },
    {
      score: { $meta: "textScore" },
    }
  )
    .sort({ score: { $meta: "textScore" } })
    .limit(limit)
    .populate("assignees", "name email")
    .lean();

  return NextResponse.json({
    success: true,
    count: tasks.length,
    tasks,
  });
});
