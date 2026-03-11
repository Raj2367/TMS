import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Project from "@/models/Project";
import { authenticate } from "@/middleware/authMiddleware";
import { ApiError } from "@/utils/apiError";
import { asyncHandler } from "@/utils/asyncHandler";

export const GET = asyncHandler(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const user = authenticate(req);

    await connectDB();

    const { id } = await params;
    const project = await Project.findById(id)
      .populate("members", "name email")
      .populate("owner", "name email");

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    const isMember =
      project.owner.toString() === user.id ||
      project.members.some((m: any) => m._id.toString() === user.id);

    if (!isMember) {
      throw new ApiError(403, "Access denied");
    }

    return NextResponse.json({
      success: true,
      project,
    });
  }
);
