// Datos del domiciliario
export interface Domiciliario {
  id?: number;
  cedula: string;
  nombre: string;
  celular: string;
  contrasena?: string;
  disponible: boolean;
}

export type DomiciliarioDTO = Domiciliario;
