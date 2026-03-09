import { NextRequest, NextResponse } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiError } from "@/utils/apiError";

export const GET = asyncHandler(async (req: NextRequest) => {
  const authorized = false;

  if (!authorized) {
    throw new ApiError(401, "Unauthorized access");
  }

  return NextResponse.json({
    success: true,
  });
});
