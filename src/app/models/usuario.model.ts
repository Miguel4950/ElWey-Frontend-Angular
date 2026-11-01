// Usuario en sesión (cliente, operador, domiciliario o admin)
export interface Usuario {
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
export type UsuarioDTO = Usuario;

// Datos para iniciar sesión
export interface Login {
  correo: string;
  usuario?: string;
  contrasena: string;
}
export type LoginDTO = Login;
