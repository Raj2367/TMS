import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Task from "@/models/Task";
import Project from "@/models/Project";
import { authenticate } from "@/middleware/authMiddleware";
import { ApiError } from "@/utils/apiError";
import { asyncHandler } from "@/utils/asyncHandler";

export const GET = asyncHandler(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const user = authenticate(req);

    await connectDB();

    const { searchParams } = new URL(req.url);

    const status = searchParams.get("status");
    const assignee = searchParams.get("assignee");

    const cursor = searchParams.get("cursor");
    const limit = Number(searchParams.get("limit")) || 20;

    const { id } = await params;
    const project = await Project.findById(id);

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    const isMember =
      project.owner.toString() === user.id ||
      project.members.includes(user.id as any);

    if (!isMember) {
      throw new ApiError(403, "Not authorized for this project");
    }

    const query: any = {
      projectId: id,
    };

    if (status) {
      query.status = status;
    }

    if (assignee) {
      query.assignees = assignee;
    }

    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }

    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("assignees", "name email")
      .lean();

    const nextCursor =
      tasks.length > 0 ? tasks[tasks.length - 1].createdAt : null;

    return NextResponse.json({
      success: true,
      count: tasks.length,
      tasks,
      nextCursor,
    });
  }
);
