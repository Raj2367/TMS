import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { authenticate } from "@/middleware/authMiddleware";

export async function GET(req: NextRequest) {
  await connectDB();
  const user = authenticate(req);
  return NextResponse.json({
    message: "Database connected successfully",
    userId: user.id,
  });
}
