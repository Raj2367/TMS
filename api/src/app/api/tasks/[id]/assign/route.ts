import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Task from "@/models/Task";
import Project from "@/models/Project";
import { authenticate } from "@/middleware/authMiddleware";
import { ApiError } from "@/utils/apiError";
import { asyncHandler } from "@/utils/asyncHandler";
import { emitSocketEvent } from "@/lib/socketEmitter";

export const POST = asyncHandler(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const user = authenticate(req);

    await connectDB();

    const body = await req.json();
    const { userId } = body;
    const { id } = await params;
    const task = await Task.findById(id);

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    const project = await Project.findById(task.projectId);

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    const isMember =
      project.owner.toString() === userId ||
      project.members.includes(userId as any);

    if (!isMember) {
      throw new ApiError(403, "User not part of this project");
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        $addToSet: { assignees: userId },
      },
      { new: true }
    );

    await emitSocketEvent(`project:${task?.projectId}`, "taskAssigned", updatedTask);

    return NextResponse.json({
      success: true,
      task: updatedTask,
    });
  }
);
