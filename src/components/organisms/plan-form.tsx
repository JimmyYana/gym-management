"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, Input } from "@/components/atoms/controls";
import { FormField } from "@/components/molecules/form-field";
import { plansApi } from "@/lib/client-api";
import { planSchema } from "@/schemas/plan";
import type { Plan } from "@/types/plan";

const formSchema = planSchema.extend({
  beneficios: z.string().transform((value) => value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)),
});

export function PlanForm({ plan, onSaved, cancel }: { plan?: Plan; onSaved: () => void; cancel: () => void }) {
  const [error, setError] = useState("");
  const { register, formState: { errors, isSubmitting }, handleSubmit } = useForm<z.input<typeof formSchema>, unknown, z.output<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: plan ? { ...plan, beneficios: plan.beneficios.join("\n") } : {
      nombre: "", precio: 0, duracion: 365, beneficios: "", descripcion: "", activo: true,
    },
  });

  return (
    <form onSubmit={handleSubmit(async (input) => {
      setError("");
      try {
        await plansApi.save(input, plan?.id);
        onSaved();
      } catch (failure) {
        setError((failure as Error).message);
      }
    })} noValidate>
      <fieldset disabled={isSubmitting}>
        <FormField label="Nombre" htmlFor="plan-name" error={errors.nombre?.message}><Input id="plan-name" {...register("nombre")} /></FormField>
        <FormField label="Precio" htmlFor="plan-price" error={errors.precio?.message}><Input id="plan-price" type="number" min="0" step="0.01" {...register("precio", { valueAsNumber: true })} /></FormField>
        <FormField label="Duración (días)" htmlFor="plan-duration" error={errors.duracion?.message}><Input id="plan-duration" type="number" min="1" {...register("duracion", { valueAsNumber: true })} /></FormField>
        <FormField label="Beneficios" htmlFor="plan-benefits"><textarea id="plan-benefits" className="line-input" rows={4} placeholder="Un beneficio por línea" {...register("beneficios")} /></FormField>
        <FormField label="Descripción" htmlFor="plan-description"><textarea id="plan-description" rows={2} className="line-input" {...register("descripcion")} /></FormField>
        <label className="active-check"><input type="checkbox" {...register("activo")} /> Plan activo</label>
        <div className="admin-actions"><Button type="submit">{isSubmitting ? "Guardando…" : "Guardar plan"}</Button><Button onClick={cancel}>Cancelar</Button></div>
      </fieldset>
      {error && <p className="field-error" role="alert">{error}</p>}
    </form>
  );
}
