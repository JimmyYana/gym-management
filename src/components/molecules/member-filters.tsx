import { Search } from "lucide-react";
import type { Plan } from "@/types/plan";

export function SearchBar({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="search-row">
      <label className="search"><Search size={18} aria-hidden /><input aria-label="Buscar por nombre o celular" placeholder="Nombre o celular" value={value} onChange={(event) => onChange(event.target.value)} /></label>
      <a className="sms" href="sms:">SMS</a>
    </div>
  );
}

function FilterSelect({ label, value, set, placeholder, options }: {
  label: string;
  value: string;
  set: (value: string) => void;
  placeholder: string;
  options: { value: string; name: string }[];
}) {
  return (
    <select aria-label={label} value={value} onChange={(event) => set(event.target.value)}>
      <option value="">{placeholder}</option>
      {options.map((option) => <option key={option.value} value={option.value}>{option.name}</option>)}
    </select>
  );
}

export function MemberFilters({ status, setStatus, plan, setPlan, schedule, setSchedule, plans, schedules }: {
  status: string; setStatus: (value: string) => void;
  plan: string; setPlan: (value: string) => void;
  schedule: string; setSchedule: (value: string) => void;
  plans: Plan[]; schedules: string[];
}) {
  return (
    <div className="filters">
      <FilterSelect label="Estado del miembro" value={status} set={setStatus} placeholder="Todos" options={[{ value: "active", name: "Activos" }, { value: "inactive", name: "Inactivos" }]} />
      <FilterSelect label="Filtrar por plan" value={plan} set={setPlan} placeholder="Planes" options={plans.map(({ id, nombre }) => ({ value: id, name: nombre }))} />
      <FilterSelect label="Filtrar por horario" value={schedule} set={setSchedule} placeholder="Horarios" options={schedules.map((value) => ({ value, name: value }))} />
    </div>
  );
}
