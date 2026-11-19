import Link from "next/link";
import { CreditCard, MessageCircle, Pencil, Phone, Trash2 } from "lucide-react";
import { Avatar } from "@/components/atoms/avatar";
import type { Member } from "@/types/member";
import { formatDate } from "@/utils/member";

export function MemberCard({ member, plan, onRemove, busy }: {
  member: Member;
  plan?: string;
  onRemove: () => void;
  busy: boolean;
}) {
  const phone = member.celular.replace(/[^+\d]/g, "");
  const edit = `/miembros/${encodeURIComponent(member.id)}/editar`;
  return (
    <article className="member-card">
      <button className="trash" type="button" onClick={onRemove} disabled={busy} aria-label={`Eliminar a ${member.nombre}`}><Trash2 size={14} /></button>
      <Avatar src={member.foto} />
      <p><span>Nombre:</span> {member.nombre}</p>
      <p><CreditCard size={13} aria-hidden /> <span>N.º:</span> {member.numeroMiembro || member.id}</p>
      <p><span>Plan:</span> {plan ?? "Plan no disponible"}</p>
      <p><span>Vencimiento:</span> {formatDate(member.fechaFinalizacion)}</p>
      <p><span>Saldo pendiente:</span> {member.montoPendiente.toFixed(2)}</p>
      <div className="card-actions">
        {phone && <a href={`tel:${phone}`}><Phone size={14} />Llamar</a>}
        {phone && <a href={`sms:${phone}`}><MessageCircle size={14} />Mensaje</a>}
        <Link href={edit} aria-label={`Editar a ${member.nombre}`}><Pencil size={14} />Editar</Link>
      </div>
    </article>
  );
}
