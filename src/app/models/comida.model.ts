// Plato del menú
export interface Comida {
  id?: number;
  nombre: string;
  precio: number;
  descripcion: string;
  imagen_url: string;
  etiqueta: string;
  activo?: boolean;
  categoriaId?: number;
  categoriaNombre?: string;
}

export type ComidaDTO = Comida;
