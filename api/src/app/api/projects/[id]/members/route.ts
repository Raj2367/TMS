import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Project from "@/models/Project";
import { authenticate } from "@/middleware/authMiddleware";
import { ApiError } from "@/utils/apiError";
import { asyncHandler } from "@/utils/asyncHandler";

export const POST = asyncHandler(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const user = authenticate(req);

    await connectDB();

    const body = await req.json();
    const { id } = await params;

    const project = await Project.findById(id);

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    if (project.owner.toString() !== user.id) {
      throw new ApiError(403, "Only owner can add members");
    }

    await Project.findByIdAndUpdate(
      id,
      {
        $addToSet: { members: body.userId },
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Member added",
    });
  }
);
