import { Suspense } from "react";
import { MemberFormTemplate } from "@/components/templates/member-form-template";

async function EditMember({ params }: Pick<PageProps<"/miembros/[id]/editar">, "params">) {
  const { id } = await params;
  return <MemberFormTemplate id={id} />;
}

export default function Page({ params }: PageProps<"/miembros/[id]/editar">) {
  return <Suspense fallback={<p className="notice" role="status">Cargando…</p>}><EditMember params={params} /></Suspense>;
}
