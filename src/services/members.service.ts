import { ApiError, mockResource } from "@/lib/mockapi";
import { memberResponseSchema } from "@/schemas/member";
import { plansService } from "@/services/plans.service";
import type { MemberInput } from "@/types/member";
import { pendingAmount } from "@/utils/member";

const resource = mockResource("miembros", () => process.env.MOCKAPI_MIEMBROS_URL, memberResponseSchema);

async function validateMember(input: MemberInput, id?: string) {
  const [plans, members] = await Promise.all([plansService.list(), resource.list()]);
  const plan = plans.find((candidate) => candidate.id === input.planId);
  if (!plan) throw new ApiError(422, "El plan seleccionado no existe.");
  const current = members.find((member) => member.id === id);
  if (!plan.activo && current?.planId !== plan.id) throw new ApiError(422, "El plan seleccionado está inactivo.");
  const duplicate = members.some((member) =>
    member.id !== id && member.numeroMiembro.trim().toLowerCase() === input.numeroMiembro.toLowerCase()
  );
  if (duplicate) throw new ApiError(409, "El número de miembro ya está registrado.");
  return { ...input, montoPendiente: pendingAmount(plan.precio, input.montoPagado) };
}

export const membersService = {
  ...resource,
  create: async (member: MemberInput) => resource.create(await validateMember(member)),
  update: async (id: string, member: MemberInput) => resource.update(id, await validateMember(member, id)),
};
