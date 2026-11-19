"use client";

import Link from "next/link";
import { Brand } from "@/components/atoms/brand";
import { ResourceState } from "@/components/molecules/resource-state";
import { PlansList } from "@/components/organisms/plans-list";
import { useResource } from "@/hooks/use-resource";
import { plansApi } from "@/lib/client-api";

export function PlansTemplate() {
  const plans = useResource(plansApi.list);
  return (
    <main className="plans-screen">
      <div className="plans-heading">
        <Brand large />
        <h1>Elige tu plan</h1>
        <p>7 días de prueba gratis</p>
      </div>
      <ResourceState {...plans} />
      {plans.data && <PlansList plans={plans.data} />}
      <nav className="plan-links" aria-label="Gestión del gimnasio"><Link href="/miembros">Miembros</Link><Link href="/planes/admin">Administrar planes</Link></nav>
    </main>
  );
}
