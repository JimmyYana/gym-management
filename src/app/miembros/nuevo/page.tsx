import { Suspense } from "react";
import { MemberFormTemplate } from "@/components/templates/member-form-template";

async function NewMember({ searchParams }: Pick<PageProps<"/miembros/nuevo">, "searchParams">) {
  const { plan } = await searchParams;
  return <MemberFormTemplate selectedPlan={typeof plan === "string" ? plan : undefined} />;
}

export default function Page({ searchParams }: PageProps<"/miembros/nuevo">) {
  return <Suspense fallback={<p className="notice" role="status">Cargando…</p>}><NewMember searchParams={searchParams} /></Suspense>;
}
