import { mockResource } from "@/lib/mockapi";
import { planResponseSchema } from "@/schemas/plan";
import type { PlanInput } from "@/types/plan";

const resource = mockResource("planes", () => process.env.MOCKAPI_PLANES_URL, planResponseSchema);

export const plansService = {
  ...resource,
  create: (plan: PlanInput) => resource.create(plan),
  update: (id: string, plan: PlanInput) => resource.update(id, plan),
};
