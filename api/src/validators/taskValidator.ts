import { z } from "zod";

export const createTaskSchema = z.object({
  projectId: z.string(),
  title: z.string().min(3, "Task title must be at least 3 characters"),
  description: z.string().optional(),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(3, "Task title must be at least 3 characters")
    .optional(),
  description: z.string().optional(),
  status: z.enum(["todo", "in-progress", "done"]).optional(),
});

export const commentSchema = z.object({
  message: z.string().min(1, "Comment message cannot be empty"),
});
