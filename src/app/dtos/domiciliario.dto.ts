/**
 * DTO para la transferencia de información de Domiciliarios y personal de reparto.
 * Coincide con DomiciliarioDto y DomiciliarioController del backend.
 */
export interface DomiciliarioDTO {
  id?: number;
  cedula: string;
  nombre: string;
  celular: string;
  contrasena?: string;
  disponible: boolean;
}
