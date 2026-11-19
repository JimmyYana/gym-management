"use client";

import { useCallback } from "react";
import { ResourceState } from "@/components/molecules/resource-state";
import { Header } from "@/components/organisms/header";
import { MemberForm } from "@/components/organisms/member-form";
import { useResource } from "@/hooks/use-resource";
import { membersApi, plansApi } from "@/lib/client-api";

export function MemberFormTemplate({ id, selectedPlan }: { id?: string; selectedPlan?: string }) {
  const load = useCallback(async () => {
    const [plans, members, member] = await Promise.all([
      plansApi.list(),
      membersApi.list(),
      id ? membersApi.get(id) : Promise.resolve(undefined),
    ]);
    const highest = members.reduce((number, item) => {
      const candidate = /^\d+$/.test(item.numeroMiembro) ? Number(item.numeroMiembro) : NaN;
      return Number.isSafeInteger(candidate) && candidate < Number.MAX_SAFE_INTEGER ? Math.max(number, candidate) : number;
    }, 0);
    return { plans, member, schedules: members.map(({ horario }) => horario), nextNumber: String(highest + 1) };
  }, [id]);
  const resource = useResource(load);
  return (
    <>
      <Header title={id ? "Editar miembro" : "Agregar miembro"} back="/miembros" />
      <main>
        <ResourceState {...resource} />
        {resource.data && <MemberForm plans={resource.data.plans} member={resource.data.member}
          selectedPlan={selectedPlan} knownSchedules={resource.data.schedules} nextNumber={resource.data.nextNumber} />}
      </main>
    </>
  );
}
