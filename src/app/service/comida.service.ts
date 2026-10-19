import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ComidaDTO } from '../dtos/comida.dto';
import { CategoriaDTO } from '../dtos/categoria.dto';

@Injectable({
  providedIn: 'root',
})
export class ComidaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api';

  getComidas(): Observable<ComidaDTO[]> {
    return this.http.get<ComidaDTO[]>(`${this.apiUrl}/comidas`);
  }

  getComidasActivas(): Observable<ComidaDTO[]> {
    return this.http.get<ComidaDTO[]>(`${this.apiUrl}/comidas/activas`);
  }

  getComidaById(id: number): Observable<ComidaDTO> {
    return this.http.get<ComidaDTO>(`${this.apiUrl}/comidas/${id}`);
  }

  getCategorias(): Observable<CategoriaDTO[]> {
    return this.http.get<CategoriaDTO[]>(`${this.apiUrl}/categorias`);
  }

  addComida(comida: ComidaDTO): Observable<ComidaDTO> {
    return this.http.post<ComidaDTO>(`${this.apiUrl}/comidas`, comida);
  }

  updateComida(id: number, comida: ComidaDTO): Observable<ComidaDTO> {
    return this.http.put<ComidaDTO>(`${this.apiUrl}/comidas/${id}`, comida);
  }

  eliminarComida(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/comidas/${id}`);
  }
}
