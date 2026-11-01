// Categoría de comida (Tacos, Bebidas, etc.)
export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
}

export type CategoriaDTO = Categoria;
