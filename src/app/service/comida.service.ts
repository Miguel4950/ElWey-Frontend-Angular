import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ComidaDTO } from '../dtos/comida.dto';
import { CategoriaDTO } from '../dtos/categoria.dto';

/**
 * Servicio para la gestión del catálogo de comidas y categorías.
 * Conecta con ComidaController y CategoriaController de Spring Boot en el puerto 8080 (sin /api).
 */
@Injectable({
  providedIn: 'root',
})
export class ComidaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080';

  /**
   * Consulta el listado completo de platos en la base de datos.
   */
  getComidas(): Observable<ComidaDTO[]> {
    return this.http.get<ComidaDTO[]>(`${this.apiUrl}/comidas`);
  }

  /**
   * Consulta únicamente las comidas activas para la carta al público.
   */
  getComidasActivas(): Observable<ComidaDTO[]> {
    return this.http.get<ComidaDTO[]>(`${this.apiUrl}/comidas/activas`);
  }

  /**
   * Obtiene una comida por su ID.
   */
  getComidaById(id: number): Observable<ComidaDTO> {
    return this.http.get<ComidaDTO>(`${this.apiUrl}/comidas/${id}`);
  }

  /**
   * Consulta las categorías disponibles para selección en el formulario.
   */
  getCategorias(): Observable<CategoriaDTO[]> {
    return this.http.get<CategoriaDTO[]>(`${this.apiUrl}/categorias`);
  }

  /**
   * Registra un nuevo plato enviando su categoría.
   */
  addComida(comida: ComidaDTO): Observable<ComidaDTO> {
    return this.http.post<ComidaDTO>(`${this.apiUrl}/comidas/add`, comida);
  }

  /**
   * Actualiza los datos de un plato y su categoría.
   */
  updateComida(id: number, comida: ComidaDTO): Observable<ComidaDTO> {
    return this.http.put<ComidaDTO>(`${this.apiUrl}/comidas/update/${id}`, comida);
  }

  /**
   * Elimina un plato de la base de datos.
   */
  eliminarComida(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/comidas/delete/${id}`);
  }
}
