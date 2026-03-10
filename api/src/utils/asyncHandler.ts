import { NextResponse } from "next/server";
import { handleError } from "@/middleware/errorMiddleware";

export function asyncHandler(fn: Function) {
  return async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      return handleError(error);
    }
  };
}
