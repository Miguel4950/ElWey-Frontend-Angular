import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClienteDTO } from '../dtos/cliente.dto';
import { LoginDTO } from '../dtos/login.dto';

/**
 * Servicio para la gestión de Clientes y control de Sesión Multi-Rol.
 * Conecta con ClienteController en Spring Boot en el puerto 8080.
 * Persiste la sesión en localStorage para mantenerla activa al recargar la página (F5).
 */
@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api';

  private readonly STORAGE_KEY = 'clienteActual';

  // Usuario autenticado activo en memoria
  private clienteActual: ClienteDTO | null = null;

  constructor() {
    this.cargarSesionDesdeStorage();
  }

  /**
   * Carga la sesión guardada en localStorage al inicializar la aplicación.
   */
  private cargarSesionDesdeStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const guardado = localStorage.getItem(this.STORAGE_KEY);
      if (guardado) {
        try {
          this.clienteActual = JSON.parse(guardado);
        } catch (e) {
          console.error('Error al parsear clienteActual desde localStorage:', e);
          this.clienteActual = null;
          localStorage.removeItem(this.STORAGE_KEY);
        }
      }
    }
  }

  /**
   * Retorna el usuario autenticado actualmente en memoria o desde localStorage.
   */
  getClienteActual(): ClienteDTO | null {
    if (!this.clienteActual && typeof window !== 'undefined' && window.localStorage) {
      this.cargarSesionDesdeStorage();
    }
    return this.clienteActual;
  }

  /**
   * Almacena el usuario autenticado en memoria y en localStorage.
   */
  setClienteActual(cliente: ClienteDTO | null): void {
    this.clienteActual = cliente;
    if (typeof window !== 'undefined' && window.localStorage) {
      if (cliente) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cliente));
      } else {
        localStorage.removeItem(this.STORAGE_KEY);
      }
    }
  }

  /**
   * Limpia la sesión en memoria y elimina los datos de localStorage al salir.
   */
  cerrarSesion(): void {
    this.clienteActual = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  /**
   * Alias de cerrarSesion() para compatibilidad.
   */
  logout(): void {
    this.cerrarSesion();
  }

  /**
   * Valida si el usuario activo tiene rol de Operador.
   */
  esOperador(): boolean {
    const usuario = this.getClienteActual();
    if (usuario?.rol === 'OPERADOR') return true;
    const correo = usuario?.correo?.toLowerCase() || '';
    return correo === 'operador@elwey.com' || correo === 'chef_camilo' || correo === 'paola_despachos';
  }

  /**
   * Valida si el usuario activo tiene rol de Administrador.
   */
  esAdmin(): boolean {
    const usuario = this.getClienteActual();
    if (usuario?.rol === 'ADMIN') return true;
    const correo = usuario?.correo?.toLowerCase() || '';
    return correo === 'admin@elwey.com' || correo === 'admin_elwey' || correo === 'gerencia_elwey';
  }

  /**
   * Autenticación unificada contra el backend (soporta Cliente, Operador y Admin).
   */
  autenticar(credenciales: LoginDTO): Observable<ClienteDTO> {
    return this.http.post<ClienteDTO>(`${this.apiUrl}/auth/login`, credenciales);
  }

  /**
   * Autenticación específica por pestaña o rol esperado ('cliente', 'operador', 'admin').
   */
  autenticarPorRol(credenciales: LoginDTO, rol: 'cliente' | 'operador' | 'admin'): Observable<ClienteDTO> {
    return this.http.post<ClienteDTO>(`${this.apiUrl}/auth/login/${rol.toLowerCase()}`, credenciales);
  }

  /**
   * Registra un nuevo cliente en el sistema.
   */
  addCliente(cliente: ClienteDTO): Observable<ClienteDTO> {
    return this.http.post<ClienteDTO>(`${this.apiUrl}/clientes`, cliente);
  }

  /**
   * Consulta los datos de perfil de un cliente por su ID.
   */
  getClienteById(id: number): Observable<ClienteDTO> {
    return this.http.get<ClienteDTO>(`${this.apiUrl}/clientes/${id}`);
  }

  /**
   * Actualiza el perfil de un cliente registrado.
   */
  updateCliente(id: number, cliente: ClienteDTO): Observable<ClienteDTO> {
    return this.http.put<ClienteDTO>(`${this.apiUrl}/clientes/${id}`, cliente);
  }

  /**
   * Elimina la cuenta de un cliente.
   */
  eliminarCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clientes/${id}`);
  }
}
