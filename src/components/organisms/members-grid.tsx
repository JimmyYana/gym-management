import { MemberCard } from "@/components/molecules/member-card";
import type { Member } from "@/types/member";
import type { Plan } from "@/types/plan";

export function MembersGrid({ members, plans, pending, remove }: {
  members: Member[];
  plans: Plan[];
  pending: boolean;
  remove: (member: Member) => void;
}) {
  const names = new Map(plans.map((plan) => [plan.id, plan.nombre]));
  return (
    <div className="members-grid">
      {members.map((member) => <MemberCard key={member.id} member={member} plan={names.get(member.planId)} busy={pending} onRemove={() => remove(member)} />)}
    </div>
  );
}
