/**
 * DTO para la transferencia de información de Operadores de cocina y despacho.
 * Coincide con la entidad Operador y OperadorController del backend.
 */
export interface OperadorDTO {
  id?: number;
  nombre: string;
  usuario: string;
  contrasena?: string;
}
