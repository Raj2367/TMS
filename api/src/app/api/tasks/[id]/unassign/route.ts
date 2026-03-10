import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Task from "@/models/Task";
import { authenticate } from "@/middleware/authMiddleware";
import { ApiError } from "@/utils/apiError";
import { asyncHandler } from "@/utils/asyncHandler";

export const POST = asyncHandler(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    authenticate(req);

    await connectDB();

    const body = await req.json();
    const { userId } = body;

    const { id } = await params;
    const task = await Task.findById(id);

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        $pull: { assignees: userId },
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      task: updatedTask,
    });
  }
);
