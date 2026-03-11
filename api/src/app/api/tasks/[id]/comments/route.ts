import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Task from "@/models/Task";
import { authenticate } from "@/middleware/authMiddleware";
import { validateRequest } from "@/middleware/validationMiddleware";
import { commentSchema } from "@/validators/taskValidator";
import { ApiError } from "@/utils/apiError";
import { asyncHandler } from "@/utils/asyncHandler";
import { Types } from "mongoose";
import { emitSocketEvent } from "@/lib/socketEmitter";

export const POST = asyncHandler(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const user = authenticate(req);

    await connectDB();

    const data = await validateRequest(req, commentSchema);

    const { id } = await params;
    const task = await Task.findById(id);

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    task.comments.push({
      user: Types.ObjectId.createFromHexString(user.id),
      message: data.message,
      createdAt: new Date(),
    });

    await task.save();

    await emitSocketEvent(`project:${task?.projectId}`, "commentAdded", {
      taskId: task._id,
      comment: task.comments[task.comments.length - 1],
    });

    const populatedTask = await Task.findById(id).populate(
      "comments.user",
      "name email"
    );

    return NextResponse.json({
      success: true,
      task: populatedTask,
    });
  }
);
