import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Adicional } from '../models/adicional.model';

// Servicio para ingredientes adicionales, salsas y extras
@Injectable({
  providedIn: 'root',
})
export class AdicionalService {
  private http = inject(HttpClient);
  private apiBaseUrl = 'http://localhost:8080';
  private apiUrl = `${this.apiBaseUrl}/adicionales`;

  // Lista completa de adicionales
  getAdicionales(): Observable<Adicional[]> {
    return this.http.get<Adicional[]>(this.apiUrl);
  }

  // Consulta un adicional por ID
  getAdicionalById(id: number): Observable<Adicional> {
    return this.http.get<Adicional>(`${this.apiUrl}/${id}`);
  }

  // Adicionales disponibles para un plato
  getAdicionalesActivosByComidaId(comidaId: number): Observable<Adicional[]> {
    return this.http.get<Adicional[]>(`${this.apiUrl}/comida/${comidaId}/activos`);
  }

  // Crea un nuevo adicional
  createAdicional(adicional: Adicional, categoriaId?: number): Observable<Adicional> {
    const url = categoriaId ? `${this.apiUrl}?categoriaId=${categoriaId}` : this.apiUrl;
    return this.http.post<Adicional>(url, adicional);
  }

  // Actualiza un adicional existente
  updateAdicional(id: number, adicional: Adicional): Observable<Adicional> {
    return this.http.put<Adicional>(`${this.apiUrl}/${id}`, adicional);
  }

  // Elimina un adicional por ID
  deleteAdicional(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
