/**
 * DTO plano para la transferencia de información de Comidas (platos del restaurante).
 * Incluye únicamente los atributos del plato y su categoría (sin adicionales).
 */
export interface ComidaDTO {
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
