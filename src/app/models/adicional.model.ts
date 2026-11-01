// Ingrediente extra o salsa
export interface Adicional {
  id?: number;
  nombre: string;
  precio: number;
  activo?: boolean;
  categoriaId?: number | null;
  categoriaNombre?: string;
}

export type AdicionalDTO = Adicional;
