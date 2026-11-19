import { Suspense } from "react";
import { MembersTemplate } from "@/components/templates/members-template";

async function Members({ searchParams }: Pick<PageProps<"/miembros">, "searchParams">) {
  const { saved } = await searchParams;
  return <MembersTemplate key={typeof saved === "string" ? saved : ""} saved={typeof saved === "string" ? saved : undefined} />;
}

export default function Page({ searchParams }: PageProps<"/miembros">) {
  return <Suspense fallback={<p className="notice" role="status">Cargando…</p>}><Members searchParams={searchParams} /></Suspense>;
}
