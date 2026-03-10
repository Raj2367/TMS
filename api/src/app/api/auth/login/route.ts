import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { generateToken } from "@/lib/jwt";
import { loginSchema } from "@/validators/authValidator";
import { validateRequest } from "@/middleware/validationMiddleware";
import { ApiError } from "@/utils/apiError";
import { asyncHandler } from "@/utils/asyncHandler";

export const POST = asyncHandler(async (req: NextRequest) => {
  await connectDB();

  const data = await validateRequest(req, loginSchema);

  const user = await User.findOne({ email: data.email });

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const passwordMatch = await user.comparePassword(data.password);

  if (!passwordMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = generateToken({
    userId: user._id.toString(),
  });

  return NextResponse.json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});
