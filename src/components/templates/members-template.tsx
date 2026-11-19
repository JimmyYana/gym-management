"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useState } from "react";
import { MemberFilters, SearchBar } from "@/components/molecules/member-filters";
import { ResourceState } from "@/components/molecules/resource-state";
import { BottomNavigation } from "@/components/organisms/bottom-navigation";
import { Header } from "@/components/organisms/header";
import { MembersGrid } from "@/components/organisms/members-grid";
import { useResource } from "@/hooks/use-resource";
import { membersApi, plansApi } from "@/lib/client-api";
import type { Member } from "@/types/member";
import { filterMembers } from "@/utils/member";

export function MembersTemplate({ saved }: { saved?: string }) {
  const members = useResource(membersApi.list);
  const plans = useResource(plansApi.list);
  const [search, setSearch] = useState("");
  const [plan, setPlan] = useState("");
  const [schedule, setSchedule] = useState("");
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState(saved === "create" ? "Miembro registrado." : saved === "edit" ? "Cambios guardados." : "");
  const [error, setError] = useState("");
  const records = members.data ?? [];
  const schedules = [...new Set(records.map((member) => member.horario).filter(Boolean))].sort();
  const visible = filterMembers(records, search, plan, schedule, status);

  async function remove(member: Member) {
    if (!window.confirm(`¿Eliminar a ${member.nombre}?`)) return;
    setPending(true);
    setError("");
    setMessage("");
    try {
      await membersApi.remove(member.id);
      setMessage("Miembro eliminado.");
      members.reload();
    } catch (failure) {
      setError((failure as Error).message);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="members-screen">
      <Header><SearchBar value={search} onChange={setSearch} /></Header>
      <main className="members-main">
        <h1 className="sr-only">Miembros</h1>
        <MemberFilters {...{ status, setStatus, plan, setPlan, schedule, setSchedule, schedules }} plans={plans.data ?? []} />
        {message && <p className="notice" role="status">{message}</p>}
        {error && <p className="notice field-error" role="alert">{error}</p>}
        <ResourceState {...members} />
        <ResourceState {...plans} />
        {members.data && (visible.length
          ? <MembersGrid members={visible} plans={plans.data ?? []} pending={pending} remove={remove} />
          : <p className="notice">{records.length ? "No hay coincidencias." : <>Aún no hay miembros. <Link href="/miembros/nuevo">Agregar miembro</Link></>}</p>)}
      </main>
      <div className="members-dock">
        <Link href="/miembros/nuevo" className="add-member" aria-label="Agregar miembro"><Plus size={35} /></Link>
        <BottomNavigation />
      </div>
    </div>
  );
}
