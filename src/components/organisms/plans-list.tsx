import { PlanCard } from "@/components/molecules/plan-card";
import type { Plan } from "@/types/plan";

export function PlansList({ plans }: { plans: Plan[] }) {
  if (!plans.length) return <p className="notice">Todavía no hay planes registrados.</p>;
  return <div className="plans-list">{plans.map((plan) => <PlanCard key={plan.id} plan={plan} />)}</div>;
}
