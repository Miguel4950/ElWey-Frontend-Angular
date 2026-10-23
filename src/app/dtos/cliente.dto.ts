/**
 * DTO para la transferencia de información de usuario y autenticación.
 * Admite los roles de 'CLIENTE', 'OPERADOR' y 'ADMIN' devueltos por el backend.
 */
export interface ClienteDTO {
  id?: number;
  nombre: string;
  correo: string;
  usuario?: string;
  contrasena?: string;
  telefono: string;
  direccion: string;
  activo?: boolean;
  fechaRegistro?: string;
  rol?: 'CLIENTE' | 'OPERADOR' | 'ADMIN' | string;
}
