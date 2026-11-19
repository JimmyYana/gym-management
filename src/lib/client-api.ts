import type { Member, MemberInput } from "@/types/member";
import type { Plan, PlanInput } from "@/types/plan";

function resource<T, Input>(path: string) {
  async function request<R>(method: string, id?: string, input?: Input): Promise<R> {
    const response = await fetch(id === undefined ? path : `${path}/${encodeURIComponent(id)}`, {
      method,
      cache: "no-store",
      headers: input ? { "Content-Type": "application/json" } : undefined,
      body: input ? JSON.stringify(input) : undefined,
    }).catch(() => { throw new Error("No se pudo conectar. Comprueba tu conexión e inténtalo de nuevo."); });
    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(typeof error?.error === "string" ? error.error : "No se pudo completar la operación.");
    }
    return response.status === 204 ? undefined as R : response.json();
  }
  return {
    list: () => request<T[]>("GET"),
    get: (id: string) => request<T>("GET", id),
    save: (input: Input, id?: string) => request<T>(id === undefined ? "POST" : "PUT", id, input),
    remove: (id: string) => request<void>("DELETE", id),
  };
}

export const plansApi = resource<Plan, PlanInput>("/api/planes");
export const membersApi = resource<Member, MemberInput>("/api/miembros");
