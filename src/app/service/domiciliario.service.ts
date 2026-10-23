import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DomiciliarioDTO } from '../dtos/domiciliario.dto';

/**
 * Servicio para la gestión del personal de reparto (domiciliarios) y su disponibilidad.
 * Conecta con el controlador REST DomiciliarioController de Spring Boot en el puerto 8080.
 */
@Injectable({
  providedIn: 'root',
})
export class DomiciliarioService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/domiciliarios';

  /**
   * Obtiene la lista completa de todos los domiciliarios registrados.
   */
  getDomiciliarios(): Observable<DomiciliarioDTO[]> {
    return this.http.get<DomiciliarioDTO[]>(this.apiUrl);
  }

  /**
   * Obtiene únicamente los domiciliarios que tienen el estado de disponible activo.
   */
  getDomiciliariosDisponibles(): Observable<DomiciliarioDTO[]> {
    return this.http.get<DomiciliarioDTO[]>(`${this.apiUrl}/disponibles`);
  }

  /**
   * Consulta un domiciliario por su identificador ID.
   */
  getDomiciliarioById(id: number): Observable<DomiciliarioDTO> {
    return this.http.get<DomiciliarioDTO>(`${this.apiUrl}/${id}`);
  }

  /**
   * Alterna o asigna explícitamente el estado de disponibilidad del domiciliario.
   */
  cambiarDisponibilidad(id: number, disponible?: boolean): Observable<DomiciliarioDTO> {
    const url = disponible !== undefined 
      ? `${this.apiUrl}/${id}/disponibilidad?disponible=${disponible}` 
      : `${this.apiUrl}/${id}/disponibilidad`;
    return this.http.put<DomiciliarioDTO>(url, {});
  }

  /**
   * Registra un nuevo domiciliario en el sistema.
   */
  createDomiciliario(domiciliario: DomiciliarioDTO): Observable<DomiciliarioDTO> {
    return this.http.post<DomiciliarioDTO>(this.apiUrl, domiciliario);
  }

  /**
   * Actualiza los datos personales o de contacto de un domiciliario.
   */
  updateDomiciliario(id: number, domiciliario: DomiciliarioDTO): Observable<DomiciliarioDTO> {
    return this.http.put<DomiciliarioDTO>(`${this.apiUrl}/${id}`, domiciliario);
  }

  /**
   * Elimina un domiciliario del sistema.
   */
  deleteDomiciliario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
