import type { Plan } from "@/types/plan";

export interface Member {
  id: string;
  nombre: string;
  foto: string;
  celular: string;
  genero: string;
  numeroMiembro: string;
  altura: number;
  peso: number;
  pecho: number;
  cintura: number;
  fechaNacimiento: string;
  direccion: string;
  entrenamiento: string;
  planId: Plan["id"];
  horario: string;
  fechaIngreso: string;
  fechaFinalizacion: string;
  montoPagado: number;
  montoPendiente: number;
  metodoPago: string;
  activo: boolean;
}

export type MemberInput = Omit<Member, "id" | "montoPendiente">;
