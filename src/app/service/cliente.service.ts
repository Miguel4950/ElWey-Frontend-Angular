import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClienteDTO } from '../dtos/cliente.dto';
import { LoginDTO } from '../dtos/login.dto';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api';

  // Sesión en memoria (Singleton de Angular, cero localStorage)
  private clienteActual: ClienteDTO | null = null;

  getClienteActual(): ClienteDTO | null {
    return this.clienteActual;
  }

  setClienteActual(cliente: ClienteDTO | null): void {
    this.clienteActual = cliente;
  }

  cerrarSesion(): void {
    this.clienteActual = null;
  }

  esOperador(): boolean {
    return this.clienteActual?.correo?.toLowerCase() === 'operador@elwey.com';
  }

  esAdmin(): boolean {
    const correo = this.clienteActual?.correo?.toLowerCase() || '';
    return correo === 'admin@elwey.com' || correo === 'admin_elwey' || correo === 'gerencia_elwey';
  }

  // Peticiones HTTP puras (sin tap, gestionadas en el next del subscribe de los componentes)
  autenticar(credenciales: LoginDTO): Observable<ClienteDTO> {
    return this.http.post<ClienteDTO>(`${this.apiUrl}/auth/login`, credenciales);
  }

  addCliente(cliente: ClienteDTO): Observable<ClienteDTO> {
    return this.http.post<ClienteDTO>(`${this.apiUrl}/clientes`, cliente);
  }

  getClienteById(id: number): Observable<ClienteDTO> {
    return this.http.get<ClienteDTO>(`${this.apiUrl}/clientes/${id}`);
  }

  updateCliente(id: number, cliente: ClienteDTO): Observable<ClienteDTO> {
    return this.http.put<ClienteDTO>(`${this.apiUrl}/clientes/${id}`, cliente);
  }

  eliminarCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clientes/${id}`);
  }
}
