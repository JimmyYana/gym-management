import { z } from "zod";

const required = z.string().trim().min(1, "Este campo es obligatorio.");
const nonNegative = z.number({ error: "Introduce un número válido." }).min(0, "Introduce un número no negativo.");
const date = z.iso.date({ error: "Introduce una fecha válida." });
const photo = z.union([z.literal(""), z.url({ protocol: /^https?$/ })], { error: "Introduce una URL de foto válida." });

const fields = z.object({
  nombre: required,
  foto: photo,
  celular: required.regex(/^\+?[\d\s().-]{5,25}$/, "Introduce un celular válido.")
    .refine((value) => value.replace(/\D/g, "").length >= 5, "Introduce un celular válido."),
  genero: required,
  numeroMiembro: required,
  altura: nonNegative,
  peso: nonNegative,
  pecho: nonNegative,
  cintura: nonNegative,
  fechaNacimiento: z.union([z.literal(""), date]),
  direccion: z.string().trim(),
  entrenamiento: required,
  planId: required,
  horario: required,
  fechaIngreso: date,
  fechaFinalizacion: date,
  montoPagado: nonNegative,
  metodoPago: required,
  activo: z.boolean(),
});

export const memberSchema = fields.refine((member) => member.fechaFinalizacion >= member.fechaIngreso, {
  path: ["fechaFinalizacion"],
  message: "La fecha final debe ser igual o posterior a la fecha de ingreso.",
});

// Existing records can contain ISO timestamps and incomplete legacy fields.
export const memberResponseSchema = fields.extend({
  id: z.union([z.string(), z.number().int()]).transform(String),
  planId: z.union([z.string(), z.number().int()]).transform(String),
  nombre: z.string(),
  celular: z.string(),
  foto: z.string(),
  genero: z.string(),
  numeroMiembro: z.union([z.string(), z.number().int()]).transform(String),
  entrenamiento: z.string(),
  horario: z.string(),
  metodoPago: z.string(),
  fechaNacimiento: z.string(),
  fechaIngreso: z.string(),
  fechaFinalizacion: z.string(),
  montoPendiente: nonNegative,
});
