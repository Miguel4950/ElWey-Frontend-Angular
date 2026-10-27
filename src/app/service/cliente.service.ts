import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ClienteDTO } from '../dtos/cliente.dto';
import { UsuarioDTO } from '../dtos/usuario.dto';
import { LoginDTO } from '../dtos/login.dto';

/**
 * Servicio para la gestión de Clientes y control de Sesión Multi-Rol.
 * Conecta con ClienteController, OperadorController, DomiciliarioController y AdministradorController en Spring Boot en el puerto 8080 (sin /api).
 * Persiste la sesión en localStorage para mantenerla activa al recargar la página (F5).
 */
@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080';
  private apiUrl = 'http://localhost:8080/cliente';

  private readonly STORAGE_KEY = 'clienteActual';

  // Usuario autenticado activo en memoria (puede ser Cliente, Operador, Domiciliario o Admin)
  private clienteActual: UsuarioDTO | null = null;

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
  getClienteActual(): UsuarioDTO | null {
    if (!this.clienteActual && typeof window !== 'undefined' && window.localStorage) {
      this.cargarSesionDesdeStorage();
    }
    return this.clienteActual;
  }

  /**
   * Almacena el usuario autenticado en memoria y en localStorage.
   */
  setClienteActual(usuario: UsuarioDTO | null): void {
    this.clienteActual = usuario;
    if (typeof window !== 'undefined' && window.localStorage) {
      if (usuario) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usuario));
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
    const correo = (usuario?.correo || usuario?.usuario || '').toLowerCase();
    return correo === 'operador@elwey.com' || correo === 'chef_camilo' || correo === 'paola_despachos';
  }

  /**
   * Valida si el usuario activo tiene rol de Domiciliario.
   */
  esDomiciliario(): boolean {
    const usuario = this.getClienteActual();
    return usuario?.rol === 'DOMICILIARIO';
  }

  /**
   * Valida si el usuario activo tiene rol de Administrador.
   */
  esAdmin(): boolean {
    const usuario = this.getClienteActual();
    if (usuario?.rol === 'ADMIN') return true;
    const correo = (usuario?.correo || usuario?.usuario || '').toLowerCase();
    return correo === 'admin@elwey.com' || correo === 'admin_elwey' || correo === 'gerencia_elwey';
  }

  /**
   * Autenticación de cliente contra /cliente/login.
   */
  autenticar(credenciales: LoginDTO): Observable<UsuarioDTO> {
    return this.http.post<UsuarioDTO>(`${this.apiUrl}/login`, credenciales).pipe(
      map((u) => ({
        ...u,
        rol: 'CLIENTE',
      }))
    );
  }

  /**
   * Autenticación específica por pestaña o rol esperado ('cliente', 'operador', 'domiciliario', 'admin').
   * Llama al controlador correspondiente sin usar /api en las rutas URL.
   */
  autenticarPorRol(
    credenciales: LoginDTO,
    rol: 'cliente' | 'operador' | 'domiciliario' | 'admin'
  ): Observable<UsuarioDTO> {
    const rolLower = rol.toLowerCase();

    if (rolLower === 'operador') {
      return this.http.post<UsuarioDTO>(`${this.baseUrl}/operador/login`, credenciales).pipe(
        map((u) => ({
          ...u,
          nombre: u.nombre || u.usuario || 'Operador',
          correo: u.correo || u.usuario || credenciales.correo,
          rol: 'OPERADOR',
        }))
      );
    }

    if (rolLower === 'domiciliario') {
      return this.http.post<UsuarioDTO>(`${this.baseUrl}/domiciliario/login`, credenciales).pipe(
        map((u) => ({
          ...u,
          nombre: u.nombre || u.cedula || 'Domiciliario',
          correo: u.correo || u.cedula || credenciales.correo,
          rol: 'DOMICILIARIO',
        }))
      );
    }

    if (rolLower === 'admin') {
      return this.http.post<UsuarioDTO>(`${this.baseUrl}/administrador/login`, credenciales).pipe(
        map((u) => ({
          ...u,
          nombre: u.nombre || u.usuario || 'Administrador',
          correo: u.correo || u.usuario || credenciales.correo,
          rol: 'ADMIN',
        }))
      );
    }

    return this.http.post<UsuarioDTO>(`${this.baseUrl}/cliente/login`, credenciales).pipe(
      map((u) => ({
        ...u,
        rol: 'CLIENTE',
      }))
    );
  }

  /**
   * Lista todos los clientes registrados.
   */
  getClientes(): Observable<ClienteDTO[]> {
    return this.http.get<ClienteDTO[]>(`${this.apiUrl}/all`);
  }

  /**
   * Registra un nuevo cliente en el sistema.
   */
  addCliente(cliente: ClienteDTO): Observable<ClienteDTO> {
    return this.http.post<ClienteDTO>(`${this.apiUrl}/add`, cliente);
  }

  /**
   * Consulta los datos de perfil de un cliente por su ID.
   */
  getClienteById(id: number): Observable<ClienteDTO> {
    return this.http.get<ClienteDTO>(`${this.apiUrl}/${id}`);
  }

  /**
   * Actualiza el perfil de un cliente registrado.
   */
  updateCliente(id: number, cliente: ClienteDTO): Observable<ClienteDTO> {
    return this.http.put<ClienteDTO>(`${this.apiUrl}/update/${id}`, cliente);
  }

  /**
   * Desactiva la cuenta de un cliente.
   */
  desactivarCliente(id: number): Observable<ClienteDTO> {
    return this.http.put<ClienteDTO>(`${this.apiUrl}/desactivar/${id}`, {});
  }

  /**
   * Elimina la cuenta de un cliente.
   */
  eliminarCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
