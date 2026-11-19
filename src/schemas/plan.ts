import { z } from "zod";

export const planSchema = z.object({
  nombre: z.string().trim().min(1, "Introduce un nombre."),
  precio: z.number({ error: "Introduce un precio válido." }).min(0, "Introduce un precio no negativo."),
  duracion: z.number({ error: "Introduce una duración válida." }).int().positive("Introduce la duración en días."),
  beneficios: z.array(z.string().trim().min(1)),
  descripcion: z.string().trim(),
  activo: z.boolean(),
});

const identifier = z.union([z.string().trim().min(1), z.number().int()]).transform(String);

function normalizeBenefits(value: unknown): unknown {
  if (typeof value !== "string") return value ?? [];
  const trimmed = value.trim();
  if (trimmed.startsWith("[")) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return value;
    }
  }
  return trimmed.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

export const planResponseSchema = planSchema.omit({ nombre: true, beneficios: true })
  .extend({
    id: identifier,
    nombre: z.string().trim().optional(),
    name: z.string().trim().optional(),
    beneficios: z.preprocess(normalizeBenefits, planSchema.shape.beneficios),
  })
  .transform(({ name, nombre, ...plan }) => ({ ...plan, nombre: nombre || name || "" }))
  .pipe(planSchema.extend({ id: z.string() }));
