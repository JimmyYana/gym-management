"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Avatar } from "@/components/atoms/avatar";
import { Button, Input, Select } from "@/components/atoms/controls";
import { FormField } from "@/components/molecules/form-field";
import { PaymentField } from "@/components/molecules/payment-field";
import { memberOptionLabel, memberOptions, schedules } from "@/constants/member-options";
import { membersApi } from "@/lib/client-api";
import { memberSchema } from "@/schemas/member";
import type { Member, MemberInput } from "@/types/member";
import type { Plan } from "@/types/plan";
import { dateInput, pendingAmount } from "@/utils/member";

const initial: MemberInput = {
  nombre: "", foto: "", celular: "", genero: "Male", numeroMiembro: "", altura: 0, peso: 0,
  pecho: 0, cintura: 0, fechaNacimiento: "", direccion: "", entrenamiento: "Trainer",
  planId: "", horario: "", fechaIngreso: "", fechaFinalizacion: "", montoPagado: 0,
  metodoPago: "Cash", activo: true,
};
const measurements = [
  ["altura", "Altura"], ["peso", "Peso"], ["pecho", "Pecho"], ["cintura", "Cintura"],
] as const;

export function MemberForm({ plans, member, selectedPlan, knownSchedules, nextNumber }: {
  plans: Plan[];
  member?: Member;
  selectedPlan?: string;
  knownSchedules: string[];
  nextNumber: string;
}) {
  const router = useRouter();
  const prefix = useId();
  const fieldId = (name: string) => `${prefix}-${name}`;
  const [showPhoto, setShowPhoto] = useState(Boolean(member?.foto));
  const [error, setError] = useState("");
  const allowedPlans = plans.filter((plan) => plan.activo || plan.id === member?.planId);
  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<MemberInput>({
    resolver: zodResolver(memberSchema),
    defaultValues: member ? {
      ...member,
      fechaNacimiento: dateInput(member.fechaNacimiento),
      fechaIngreso: dateInput(member.fechaIngreso),
      fechaFinalizacion: dateInput(member.fechaFinalizacion),
    } : { ...initial, numeroMiembro: nextNumber, planId: allowedPlans.find((plan) => plan.id === selectedPlan)?.id ?? "" },
  });
  const [planId, paid, photo, method] = useWatch({ control, name: ["planId", "montoPagado", "foto", "metodoPago"] });
  const plan = allowedPlans.find(({ id }) => id === planId);
  const due = plan && Number.isFinite(paid) ? pendingAmount(plan.precio, paid) : 0;
  const allSchedules = [...new Set([...schedules, ...knownSchedules, member?.horario ?? ""].filter(Boolean))];

  async function save(input: MemberInput) {
    setError("");
    try {
      await membersApi.save(input, member?.id);
      router.push(`/miembros?saved=${member ? "edit" : "create"}`);
    } catch (failure) {
      setError((failure as Error).message);
    }
  }

  function textField(name: "nombre" | "celular" | "numeroMiembro" | "fechaNacimiento" | "direccion", label: string, type = "text") {
    return <FormField label={label} htmlFor={fieldId(name)} error={errors[name]?.message}>
      <Input type={type} id={fieldId(name)} {...register(name)} />
    </FormField>;
  }

  function radios(name: "genero" | "entrenamiento", label: string, choices: string[]) {
    const values = memberOptions(choices, member?.[name]);
    return (
      <FormField label={label} error={errors[name]?.message}>
        <div className="radio-row" role="group" aria-label={label}>{values.map((choice) => (
          <label key={choice}><input type="radio" value={choice} {...register(name)} />{memberOptionLabel(choice)}</label>
        ))}</div>
      </FormField>
    );
  }

  return (
    <form className="member-form" onSubmit={handleSubmit(save)} noValidate>
      <fieldset disabled={isSubmitting} className="member-fields">
        {textField("nombre", "Nombre")}
        <FormField label="Foto" error={errors.foto?.message}>
          <Button className="upload" aria-expanded={showPhoto} onClick={() => setShowPhoto(!showPhoto)}><Upload size={15} /> Agregar foto</Button>
          <div className="photo-preview" hidden={!showPhoto}>
            <Input id={fieldId("foto")} type="url" aria-label="URL de la foto" placeholder="https://…" {...register("foto")} />
            {photo && <Avatar src={photo} />}
          </div>
        </FormField>
        {textField("celular", "Celular", "tel")}
        {radios("genero", "Género", ["Male", "Female"])}
        {textField("numeroMiembro", "N.º de miembro")}
        <FormField label="Medidas">
          <div className="measurements">{measurements.map(([name, label]) => (
            <label key={name}>{label}<Input type="number" min="0" step="any" {...register(name, { valueAsNumber: true })} /></label>
          ))}</div>
          {measurements.map(([name]) => errors[name] && <p className="field-error" key={name} role="alert">{errors[name]?.message}</p>)}
        </FormField>
        {textField("fechaNacimiento", "Nacimiento", "date")}
        {textField("direccion", "Dirección")}
        {radios("entrenamiento", "Entrenamiento", ["Trainer", "Personal"])}
        <FormField label="Plan" htmlFor={fieldId("planId")} error={errors.planId?.message}>
          <Select id={fieldId("planId")} {...register("planId")}>
            <option value="">Selecciona un plan</option>
            {member?.planId && !plans.some((option) => option.id === member.planId) && <option value={member.planId} disabled>Plan no disponible</option>}
            {allowedPlans.map((option) => <option key={option.id} value={option.id}>{option.nombre} [ {option.precio} ]</option>)}
          </Select>
        </FormField>
        <FormField label="Horario" htmlFor={fieldId("horario")} error={errors.horario?.message}>
          <Select id={fieldId("horario")} {...register("horario")}>
            <option value="">Selecciona un horario</option>
            {allSchedules.map((option) => <option key={option}>{option}</option>)}
          </Select>
        </FormField>
        <FormField label="Ingreso" htmlFor={fieldId("fechaIngreso")} error={errors.fechaIngreso?.message ?? errors.fechaFinalizacion?.message}>
          <div className="date-range">
            <Input id={fieldId("fechaIngreso")} type="date" {...register("fechaIngreso")} />
            <label htmlFor={fieldId("fechaFinalizacion")}>Hasta</label>
            <Input id={fieldId("fechaFinalizacion")} aria-label="Fecha de finalización" type="date" {...register("fechaFinalizacion")} />
          </div>
        </FormField>
        <FormField label="Monto pagado" htmlFor={fieldId("montoPagado")} error={errors.montoPagado?.message}>
          <Input id={fieldId("montoPagado")} type="number" min="0" step="0.01" {...register("montoPagado", { valueAsNumber: true })} />
        </FormField>
        <FormField label="Saldo pendiente" htmlFor={fieldId("due")}><output id={fieldId("due")} className="line-input" aria-live="polite">{plan ? due.toFixed(2) : "—"}</output></FormField>
        <PaymentField id={fieldId("metodoPago")} current={method} error={errors.metodoPago?.message} {...register("metodoPago")} />
        {member && <label className="active-check"><Users size={15} /><input type="checkbox" {...register("activo")} /> Miembro activo</label>}
      </fieldset>
      {error && <p className="notice field-error" role="alert">{error}</p>}
      {!allowedPlans.length && <p className="notice">Registra o activa un plan para guardar miembros.</p>}
      <div className="save-row"><Button className="save" type="submit" disabled={isSubmitting || !allowedPlans.length}>{isSubmitting ? "Guardando…" : "Guardar"}</Button></div>
    </form>
  );
}
