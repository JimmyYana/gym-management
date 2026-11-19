import Link from "next/link";
import { Banknote, Building2, ChartNoAxesCombined, Files, Users } from "lucide-react";

export function BottomNavigation() {
  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      <Link href="/miembros" aria-current="page"><Users />Miembros</Link>
      <span><ChartNoAxesCombined />Panel</span>
      <span><Banknote />Cobros</span>
      <Link href="/planes"><Building2 />Gimnasio</Link>
      <span><Files />Informe de hoy</span>
    </nav>
  );
}
