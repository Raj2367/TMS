import { NextRequest } from "next/server";
import { z, ZodType } from "zod";

export async function validateRequest<T extends ZodType<any>>(
  req: NextRequest,
  schema: T
): Promise<z.infer<T>> {
  const body = await req.json();

  const result = schema.safeParse(body);

  if (!result.success) {
    const errors = result.error.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));

    throw new Error(JSON.stringify(errors));
  }

  return result.data;
}
