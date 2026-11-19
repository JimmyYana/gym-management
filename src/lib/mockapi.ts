import type { z } from "zod";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function mockResource<T>(name: string, endpoint: () => string | undefined, schema: z.ZodType<T>) {
  async function request<R>(parser: z.ZodType<R>, method = "GET", id?: string, body?: unknown) {
    const base = endpoint()?.replace(/\/+$/, "");
    if (!base) throw new ApiError(503, `Falta configurar la API de ${name}.`);
    if (id !== undefined && (!id || id === "." || id === "..")) throw new ApiError(400, "Identificador inválido.");

    let response: Response;
    try {
      response = await fetch(id === undefined ? base : `${base}/${encodeURIComponent(id)}`, {
        method,
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(10000),
        headers: body === undefined ? undefined : { "Content-Type": "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } catch {
      throw new ApiError(503, `No se pudo conectar con la API de ${name}.`);
    }

    if (!response.ok) {
      if (response.status === 404 && id !== undefined) throw new ApiError(404, "El registro ya no existe.");
      throw new ApiError(502, `MockAPI rechazó la operación de ${name}.`);
    }
    if (method === "DELETE" && response.status === 204) return undefined;

    const data: unknown = await response.json().catch(() => undefined);
    const parsed = parser.safeParse(data);
    if (!parsed.success) throw new ApiError(502, `MockAPI devolvió datos inválidos para ${name}.`);
    return parsed.data;
  }

  async function read<R>(parser: z.ZodType<R>, method?: string, id?: string, body?: unknown): Promise<R> {
    const result = await request(parser, method, id, body);
    if (result === undefined) throw new ApiError(502, `MockAPI devolvió una respuesta vacía para ${name}.`);
    return result;
  }

  return {
    list: () => read(schema.array()),
    get: (id: string) => read(schema, "GET", id),
    create: (body: unknown) => read(schema, "POST", undefined, body),
    update: (id: string, body: unknown) => read(schema, "PUT", id, body),
    remove: async (id: string) => { await request(schema, "DELETE", id); },
  };
}
