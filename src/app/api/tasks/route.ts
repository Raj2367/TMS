import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Task from "@/models/Task";
import Project from "@/models/Project";
import { authenticate } from "@/middleware/authMiddleware";
import { createTaskSchema } from "@/validators/taskValidator";
import { validateRequest } from "@/middleware/validationMiddleware";
import { ApiError } from "@/utils/apiError";
import { asyncHandler } from "@/utils/asyncHandler";

export const POST = asyncHandler(async (req: NextRequest) => {
  const user = authenticate(req);

  await connectDB();

  const data = await validateRequest(req, createTaskSchema);

  const project = await Project.findById(data.projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const isMember =
    project.owner.toString() === user.id ||
    project.members.includes(user.id as any);

  if (!isMember) {
    throw new ApiError(403, "Not authorized for this project");
  }

  const task = await Task.create({
    projectId: data.projectId,
    title: data.title,
    description: data.description,
  });

  return NextResponse.json({
    success: true,
    task,
  });
});
