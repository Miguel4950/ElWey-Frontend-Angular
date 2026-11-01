// Datos del operador de cocina
export interface Operador {
  id?: number;
  nombre: string;
  usuario: string;
  contrasena?: string;
}

export type OperadorDTO = Operador;
