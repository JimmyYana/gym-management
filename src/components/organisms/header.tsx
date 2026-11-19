import Link from "next/link";
import { ChevronLeft, Menu } from "lucide-react";
import { Brand } from "@/components/atoms/brand";

export function Header({ title, back, children }: { title?: string; back?: string; children?: React.ReactNode }) {
  return (
    <header className="green-header">
      <div className="brand-row">
        {!back && <details className="menu">
          <summary aria-label="Abrir menú"><Menu size={21} /></summary>
          <div><Link href="/planes">Planes</Link><Link href="/miembros">Miembros</Link><Link href="/planes/admin">Administrar planes</Link></div>
        </details>}
        <Brand />
      </div>
      {title && <div className="title-row">{back && <Link href={back} aria-label="Regresar"><ChevronLeft size={28} /></Link>}<h1>{title}</h1></div>}
      {children}
    </header>
  );
}
