import Link from "next/link";
import type { Plan } from "@/types/plan";

export function PlanCard({ plan }: { plan: Plan }) {
  const period = plan.duracion === 365 ? "por año" : `/ ${plan.duracion} días`;
  return (
    <article className="plan-card">
      <h2>{plan.nombre}</h2>
      <p className="plan-price">{plan.precio}$ {period}</p>
      {plan.beneficios.length > 0 && <ul>{plan.beneficios.map((benefit, index) => <li key={index}>{benefit}</li>)}</ul>}
      {plan.beneficios.length === 0 && plan.descripcion && <p className="plan-description">{plan.descripcion}</p>}
      {plan.activo
        ? <Link className="plan-hit-area" href={`/miembros/nuevo?plan=${encodeURIComponent(plan.id)}`} aria-label={`Seleccionar ${plan.nombre}`} />
        : <p className="muted">Plan inactivo</p>}
    </article>
  );
}
