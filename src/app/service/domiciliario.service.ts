import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Domiciliario } from '../models/domiciliario.model';
import { Login, Usuario } from '../models/usuario.model';

// Servicio para gestión y login de repartidores
@Injectable({
  providedIn: 'root',
})
export class DomiciliarioService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/domiciliario';

  // Login de domiciliario
  autenticar(credenciales: Login): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, credenciales).pipe(
      map((u) => ({
        ...u,
        nombre: u.nombre || u.cedula || 'Domiciliario',
        correo: u.correo || u.cedula || credenciales.correo,
        rol: 'DOMICILIARIO',
      }))
    );
  }

  // Lista todos los domiciliarios
  getDomiciliarios(): Observable<Domiciliario[]> {
    return this.http.get<Domiciliario[]>(`${this.apiUrl}/all`);
  }

  // Solo los disponibles para despachar
  getDomiciliariosDisponibles(): Observable<Domiciliario[]> {
    return this.http.get<Domiciliario[]>(`${this.apiUrl}/disponibles`);
  }

  // Consulta por ID
  getDomiciliarioById(id: number): Observable<Domiciliario> {
    return this.http.get<Domiciliario>(`${this.apiUrl}/${id}`);
  }

  // Cambia el estado de disponibilidad
  cambiarDisponibilidad(id: number, disponible?: boolean): Observable<Domiciliario> {
    const url =
      disponible !== undefined
        ? `${this.apiUrl}/${id}/disponibilidad?disponible=${disponible}`
        : `${this.apiUrl}/${id}/disponibilidad`;
    return this.http.put<Domiciliario>(url, {});
  }

  // Agrega un nuevo domiciliario
  createDomiciliario(domiciliario: Domiciliario): Observable<Domiciliario> {
    return this.http.post<Domiciliario>(`${this.apiUrl}/add`, domiciliario);
  }

  // Actualiza datos de un domiciliario
  updateDomiciliario(id: number, domiciliario: Domiciliario): Observable<Domiciliario> {
    return this.http.put<Domiciliario>(`${this.apiUrl}/update/${id}`, domiciliario);
  }

  // Elimina un domiciliario por ID
  deleteDomiciliario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
