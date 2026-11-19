import type { Member } from "@/types/member";

export function pendingAmount(price: number, paid: number) {
  return Math.max(0, Math.round((price - paid) * 100) / 100);
}

export function filterMembers(members: Member[], search: string, plan: string, schedule: string, status: string) {
  const query = search.trim().toLocaleLowerCase();
  return members.filter((member) =>
    (member.nombre.toLocaleLowerCase().includes(query) || member.celular.includes(query)) &&
    (!plan || member.planId === plan) &&
    (!schedule || member.horario === schedule) &&
    (!status || member.activo === (status === "active"))
  );
}

export function dateInput(value: string) {
  return /^\d{4}-\d{2}-\d{2}(?:$|T)/.test(value) ? value.slice(0, 10) : "";
}

export function formatDate(value: string) {
  const date = new Date(value);
  return value && Number.isFinite(date.getTime())
    ? new Intl.DateTimeFormat("es-BO", { dateStyle: "medium", timeZone: "UTC" }).format(date)
    : "—";
}
