import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comida } from '../models/comida.model';

// Servicio para el catálogo de comidas y categorías
@Injectable({
  providedIn: 'root',
})
export class ComidaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080';

  // Consulta todos los platos registrados
  getComidas(): Observable<Comida[]> {
    return this.http.get<Comida[]>(`${this.apiUrl}/comidas`);
  }

  // Consulta solo los platos activos para la carta
  getComidasActivas(): Observable<Comida[]> {
    return this.http.get<Comida[]>(`${this.apiUrl}/comidas/activas`);
  }

  // Obtiene un plato por su ID
  getComidaById(id: number): Observable<Comida> {
    return this.http.get<Comida>(`${this.apiUrl}/comidas/${id}`);
  }

  // Agrega un nuevo plato
  addComida(comida: Comida): Observable<Comida> {
    return this.http.post<Comida>(`${this.apiUrl}/comidas/add`, comida);
  }

  // Actualiza los datos de un plato existente
  updateComida(id: number, comida: Comida): Observable<Comida> {
    return this.http.put<Comida>(`${this.apiUrl}/comidas/update/${id}`, comida);
  }

  // Elimina un plato por su ID
  eliminarComida(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/comidas/delete/${id}`);
  }
}
