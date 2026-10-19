import { AdicionalDTO } from './adicional.dto';

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
}
