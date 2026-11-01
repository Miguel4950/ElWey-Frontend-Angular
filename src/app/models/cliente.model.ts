// Datos del cliente
export interface Cliente {
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

export type ClienteDTO = Cliente;
