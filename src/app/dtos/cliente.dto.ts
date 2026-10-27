/**
 * DTO para la transferencia y persistencia de información de Clientes.
 * Representa a los comensales y usuarios que realizan pedidos en la plataforma.
 */
export interface ClienteDTO {
  id?: number;
  nombre: string;
  apellido?: string;
  correo: string;
  contrasena?: string;
  telefono: string;
  direccion: string;
  activo?: boolean;
  fechaRegistro?: string;
}
