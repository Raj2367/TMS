import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Project from "@/models/Project";
import { authenticate } from "@/middleware/authMiddleware";
import { asyncHandler } from "@/utils/asyncHandler";

export const POST = asyncHandler(async (req: NextRequest) => {
  const user = authenticate(req);

  await connectDB();

  const body = await req.json();

  const project = await Project.create({
    name: body.name,
    description: body.description,
    owner: user.id,
    members: [user.id],
  });

  return NextResponse.json({
    success: true,
    project,
  });
});

export const GET = asyncHandler(async (req: NextRequest) => {
  const user = authenticate(req);

  await connectDB();

  const projects = await Project.find({
    $or: [{ owner: user.id }, { members: user.id }],
  }).populate("owner", "name email");

  return NextResponse.json({
    success: true,
    projects,
  });
});
