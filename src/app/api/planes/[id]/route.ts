import { ApiError } from "@/lib/mockapi";
import { jsonInput, respond, serializeWrite } from "@/lib/route";
import { planSchema } from "@/schemas/plan";
import { membersService } from "@/services/members.service";
import { plansService } from "@/services/plans.service";

type Context = RouteContext<"/api/planes/[id]">;

export function GET(_: Request, { params }: Context) {
  return respond(async () => plansService.get((await params).id));
}

export function PUT(request: Request, { params }: Context) {
  return respond(async () => {
    const [{ id }, input] = await Promise.all([params, jsonInput(request, planSchema)]);
    return serializeWrite(() => plansService.update(id, input));
  });
}

export function DELETE(_: Request, { params }: Context) {
  return respond(async () => {
    const { id } = await params;
    return serializeWrite(async () => {
      const members = await membersService.list();
      if (members.some((member) => member.planId === id)) {
        throw new ApiError(409, "Este plan tiene miembros asociados. Reasígnalos antes de eliminarlo.");
      }
      await plansService.remove(id);
    });
  }, 204);
}
