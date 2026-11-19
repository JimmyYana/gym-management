import { connection } from "next/server";
import { jsonInput, respond, serializeWrite } from "@/lib/route";
import { memberSchema } from "@/schemas/member";
import { membersService } from "@/services/members.service";

export async function GET() {
  await connection();
  return respond(membersService.list);
}

export function POST(request: Request) {
  return respond(async () => {
    const member = await jsonInput(request, memberSchema);
    return serializeWrite(() => membersService.create(member));
  }, 201);
}
