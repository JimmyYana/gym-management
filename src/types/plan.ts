export interface Plan {
  id: string;
  nombre: string;
  precio: number;
  duracion: number;
  beneficios: string[];
  descripcion: string;
  activo: boolean;
}

export type PlanInput = Omit<Plan, "id">;
