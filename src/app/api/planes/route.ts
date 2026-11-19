import { connection } from "next/server";
import { jsonInput, respond, serializeWrite } from "@/lib/route";
import { planSchema } from "@/schemas/plan";
import { plansService } from "@/services/plans.service";

export async function GET() {
  await connection();
  return respond(plansService.list);
}

export function POST(request: Request) {
  return respond(async () => {
    const plan = await jsonInput(request, planSchema);
    return serializeWrite(() => plansService.create(plan));
  }, 201);
}
