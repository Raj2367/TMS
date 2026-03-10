import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { generateToken } from "@/lib/jwt";
import { registerSchema } from "@/validators/authValidator";
import { validateRequest } from "@/middleware/validationMiddleware";
import { ApiError } from "@/utils/apiError";
import { asyncHandler } from "@/utils/asyncHandler";

export const POST = asyncHandler(async (req: NextRequest) => {
  await connectDB();

  const data = await validateRequest(req, registerSchema);
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const user = await User.create({
    name: data.name,
    email: data.email,
    password: data.password,
  });

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
