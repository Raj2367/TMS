import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { Schema } from "mongoose";

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
  };
}

export function authenticate(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.split(" ")[1];

  const decoded = verifyToken(token);

  return {
    id: decoded.userId,
  };
}
