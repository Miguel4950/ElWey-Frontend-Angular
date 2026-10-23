/**
 * DTO para el envío de credenciales de inicio de sesión al backend.
 * Admite autenticación mediante correo electrónico o nombre de usuario.
 */
export interface LoginDTO {
  correo: string;
  usuario?: string;
  contrasena: string;
}
