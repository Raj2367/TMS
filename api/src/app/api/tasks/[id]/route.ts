import connectDB from "@/lib/db";
import { authenticate } from "@/middleware/authMiddleware";
import Task from "@/models/Task";
import { ApiError } from "@/utils/apiError";
import { asyncHandler } from "@/utils/asyncHandler";
import { NextRequest, NextResponse } from "next/server";
import { updateTaskSchema } from "@/validators/taskValidator";
import { validateRequest } from "@/middleware/validationMiddleware";
import { emitSocketEvent } from "@/lib/socketEmitter";

export const GET = asyncHandler(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    authenticate(req);

    await connectDB();

    const task = await Task.findById(params.id)
      .populate("assignees", "name email")
      .populate("comments.user", "name email");

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    return NextResponse.json({
      success: true,
      task,
    });
  }
);

export const PATCH = asyncHandler(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    authenticate(req);

    await connectDB();
    const { id } = await params;

    const data = await validateRequest(req, updateTaskSchema);

    const task = await Task.findByIdAndUpdate(id, data, { new: true });

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    await emitSocketEvent(`project:${task?.projectId}`, "taskUpdated", task);

    return NextResponse.json({
      success: true,
      task,
    });
  }
);

export const DELETE = asyncHandler(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    authenticate(req);

    await connectDB();
    const { id } = await params;

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    await emitSocketEvent(`project:${task?.projectId}`, "taskDeleted", { taskId: id });
    
    return NextResponse.json({
      success: true,
      message: "Task deleted",
    });
  }
);
