export interface ClienteDTO {
  id?: number;
  nombre: string;
  correo: string;
  contrasena?: string;
  telefono: string;
  direccion: string;
  activo?: boolean;
  fechaRegistro?: string;
}
