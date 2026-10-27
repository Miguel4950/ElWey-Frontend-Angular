/**
 * DTO plano para la transferencia de datos de Adicionales (extras, salsas y guarniciones).
 * Coincide con AdicionalDto y AdicionalController del backend.
 */
export interface AdicionalDTO {
  id?: number;
  nombre: string;
  precio: number;
  activo?: boolean;
  categoriaId?: number;
  categoriaNombre?: string;
}
