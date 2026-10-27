/**
 * DTO para la transferencia de información de usuario y autenticación.
 * Admite los roles de 'CLIENTE', 'OPERADOR', 'DOMICILIARIO' y 'ADMIN'.
 */
export interface UsuarioDTO {
  id?: number;
  nombre: string;
  apellido?: string;
  correo: string;
  usuario?: string;
  cedula?: string;
  celular?: string;
  disponible?: boolean;
  contrasena?: string;
  telefono?: string;
  direccion?: string;
  activo?: boolean;
  fechaRegistro?: string;
  rol?: 'CLIENTE' | 'OPERADOR' | 'DOMICILIARIO' | 'ADMIN' | string;
}
