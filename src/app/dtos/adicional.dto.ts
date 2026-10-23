/**
 * DTO para la transferencia de datos de Adicionales (extras, salsas y guarniciones).
 * Coincide con la entidad Adicional y AdicionalController del backend.
 */
export interface AdicionalDTO {
  id?: number;
  nombre: string;
  precio: number;
  activo?: boolean;
}
