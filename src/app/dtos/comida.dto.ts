import { AdicionalDTO } from './adicional.dto';

/**
 * DTO para la transferencia de información de Comidas (platos del restaurante).
 * Incluye atributos aplanados de categoría y lista de adicionales e IDs seleccionados.
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
  adicionales?: AdicionalDTO[];
  adicionalesIds?: number[];
}
