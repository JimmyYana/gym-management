import type { z } from "zod";
import { ApiError } from "@/lib/mockapi";

const headers = { "Cache-Control": "private, no-store" };
let writes: Promise<unknown> = Promise.resolve();

export function serializeWrite<T>(operation: () => Promise<T>) {
  const result = writes.then(operation);
  writes = result.catch(() => undefined);
  return result;
}

export async function jsonInput<T>(request: Request, schema: z.ZodType<T>) {
  const body: unknown = await request.json().catch(() => undefined);
  const parsed = schema.safeParse(body);
  if (!parsed.success) throw new ApiError(400, parsed.error.issues[0]?.message ?? "Datos inválidos.");
  return parsed.data;
}

export async function respond(operation: () => Promise<unknown>, status = 200) {
  try {
    const data = await operation();
    return status === 204 ? new Response(null, { status, headers }) : Response.json(data, { status, headers });
  } catch (error) {
    return Response.json(
      { error: error instanceof ApiError ? error.message : "No se pudo completar la operación." },
      { status: error instanceof ApiError ? error.status : 500, headers },
    );
  }
}
