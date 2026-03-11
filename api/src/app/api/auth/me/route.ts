import { NextRequest, NextResponse } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import { authenticate } from "@/middleware/authMiddleware";
import connectDB from "@/lib/db";
import User from "@/models/User";

export const GET = asyncHandler(async (req: NextRequest) => {
  const authUser = authenticate(req);

  await connectDB();

  const user = await User.findById(authUser.id).select("-password");

  if (!user) {
    return NextResponse.json(
      { success: false, error: "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    user,
  });
});
