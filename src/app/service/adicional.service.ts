import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdicionalAsignacionDTO } from '../dtos/adicional-asignacion.dto';
import { AdicionalDTO } from '../dtos/adicional.dto';

/**
 * Servicio para la gestión integral de Adicionales (extras, salsas y guarniciones).
 * Conecta con el controlador REST AdicionalController de Spring Boot en el puerto 8080 (sin /api).
 */
@Injectable({
  providedIn: 'root',
})
export class AdicionalService {
  private http = inject(HttpClient);
  private apiBaseUrl = 'http://localhost:8080';
  private apiUrl = `${this.apiBaseUrl}/adicionales`;

  /**
   * Obtiene la lista completa de todos los adicionales registrados.
   */
  getAdicionales(): Observable<AdicionalDTO[]> {
    return this.http.get<AdicionalDTO[]>(this.apiUrl);
  }

  getAdicionalesParaAsignacion(): Observable<AdicionalAsignacionDTO[]> {
    return this.http.get<AdicionalAsignacionDTO[]>(this.apiUrl);
  }

  /**
   * Consulta un adicional específico a través de su identificador ID.
   */
  getAdicionalById(id: number): Observable<AdicionalDTO> {
    return this.http.get<AdicionalDTO>(`${this.apiUrl}/${id}`);
  }

  /**
   * Consulta los adicionales disponibles para una comida específica.
   */
  getAdicionalesByComidaId(comidaId: number): Observable<AdicionalDTO[]> {
    return this.http.get<AdicionalDTO[]>(`${this.apiUrl}/comida/${comidaId}`);
  }

  /**
   * Registra un nuevo adicional en el sistema, con categoría opcional.
   */
  createAdicional(adicional: AdicionalDTO, categoriaId?: number): Observable<AdicionalDTO> {
    const url = categoriaId ? `${this.apiUrl}?categoriaId=${categoriaId}` : this.apiUrl;
    return this.http.post<AdicionalDTO>(url, adicional);
  }

  /**
   * Actualiza el nombre, precio o estado de un adicional existente.
   */
  updateAdicional(id: number, adicional: AdicionalDTO): Observable<AdicionalDTO> {
    return this.http.put<AdicionalDTO>(`${this.apiUrl}/${id}`, adicional);
  }

  /**
   * Guarda en una sola operación los adicionales seleccionados para una categoría.
   */
  guardarAdicionalesPorCategoria(
    categoriaId: number,
    adicionalesIds: number[]
  ): Observable<void> {
    return this.http.post<void>(`${this.apiBaseUrl}/categoria/adicionales`, {
      categoriaId,
      adicionalesIds,
    });
  }

  /**
   * Elimina un adicional del sistema de manera segura.
   */
  deleteAdicional(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
