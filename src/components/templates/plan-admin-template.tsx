"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/controls";
import { ResourceState } from "@/components/molecules/resource-state";
import { Header } from "@/components/organisms/header";
import { PlanForm } from "@/components/organisms/plan-form";
import { useResource } from "@/hooks/use-resource";
import { plansApi } from "@/lib/client-api";
import type { Plan } from "@/types/plan";

export function PlanAdminTemplate() {
  const plans = useResource(plansApi.list);
  const [editing, setEditing] = useState<Plan | "new" | null>(null);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function remove(plan: Plan) {
    if (!window.confirm(`¿Eliminar ${plan.nombre}? La operación se bloqueará si tiene miembros asociados.`)) return;
    setWorking(true);
    setMessage("");
    setError("");
    try {
      await plansApi.remove(plan.id);
      setMessage("Plan eliminado.");
      plans.reload();
    } catch (failure) {
      setError((failure as Error).message);
    } finally {
      setWorking(false);
    }
  }

  async function edit(id: string) {
    setWorking(true);
    setError("");
    setMessage("");
    try {
      setEditing(await plansApi.get(id));
    } catch (failure) {
      setError((failure as Error).message);
    } finally {
      setWorking(false);
    }
  }

  return (
    <>
      <Header title="Administrar planes" back="/planes" />
      <main className="admin">
        {message && <p role="status">{message}</p>}
        {error && <p className="field-error" role="alert">{error}</p>}
        {editing ? <PlanForm plan={editing === "new" ? undefined : editing} cancel={() => setEditing(null)} onSaved={() => {
          setEditing(null);
          setMessage("Plan guardado.");
          plans.reload();
        }} /> : <>
          <Button disabled={working} onClick={() => { setMessage(""); setError(""); setEditing("new"); }}>Nuevo plan</Button>
          <ResourceState {...plans} />
          {plans.data?.length === 0 && <p>Todavía no hay planes registrados.</p>}
          {plans.data?.map((plan) => (
            <article key={plan.id} className="admin-plan">
              <h2>{plan.nombre}</h2><p>{plan.precio}$ · {plan.duracion} días · {plan.activo ? "Activo" : "Inactivo"}</p>
              <div className="admin-actions">
                <Button disabled={working} onClick={() => edit(plan.id)}>Editar</Button>
                <Button disabled={working} onClick={() => remove(plan)}>Eliminar</Button>
              </div>
            </article>
          ))}
        </>}
      </main>
    </>
  );
}
