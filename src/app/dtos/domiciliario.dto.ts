/**
 * DTO para la transferencia de información de Domiciliarios y personal de reparto.
 * Coincide con la entidad Domiciliario y DomiciliarioController del backend.
 */
export interface DomiciliarioDTO {
  id?: number;
  cedula: string;
  nombre: string;
  celular: string;
  disponible: boolean;
}
