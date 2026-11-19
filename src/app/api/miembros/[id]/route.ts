import { jsonInput, respond, serializeWrite } from "@/lib/route";
import { memberSchema } from "@/schemas/member";
import { membersService } from "@/services/members.service";

type Context = RouteContext<"/api/miembros/[id]">;

export function GET(_: Request, { params }: Context) {
  return respond(async () => membersService.get((await params).id));
}

export function PUT(request: Request, { params }: Context) {
  return respond(async () => {
    const [{ id }, input] = await Promise.all([params, jsonInput(request, memberSchema)]);
    return serializeWrite(() => membersService.update(id, input));
  });
}

export function DELETE(_: Request, { params }: Context) {
  return respond(async () => {
    const { id } = await params;
    return serializeWrite(() => membersService.remove(id));
  }, 204);
}
