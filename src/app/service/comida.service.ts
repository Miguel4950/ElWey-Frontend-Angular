import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, mergeMap, map } from 'rxjs';
import { ComidaDTO } from '../dtos/comida.dto';
import { CategoriaDTO } from '../dtos/categoria.dto';
import { AdicionalService } from './adicional.service';

/**
 * Servicio para la gestión del catálogo de comidas y categorías.
 * Conecta con ComidaController de Spring Boot en el puerto 8080.
 * Demuestra encadenamiento reactivo con mergeMap para consultas secundarias sin anidar subscribe.
 */
@Injectable({
  providedIn: 'root',
})
export class ComidaService {
  private http = inject(HttpClient);
  private adicionalService = inject(AdicionalService);
  private apiUrl = 'http://localhost:8080/api';

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
   * Consulta una comida y encadena la búsqueda secundaria de sus adicionales
   * utilizando RxJS mergeMap sin anidar llamadas a subscribe().
   */
  getComidaConAdicionales(id: number): Observable<ComidaDTO> {
    return this.getComidaById(id).pipe(
      mergeMap((comida: ComidaDTO) => {
        return this.adicionalService.getAdicionalesByComidaId(id).pipe(
          map((adicionales) => {
            comida.adicionales = adicionales;
            return comida;
          })
        );
      })
    );
  }

  /**
   * Consulta las categorías disponibles para selección en el formulario.
   */
  getCategorias(): Observable<CategoriaDTO[]> {
    return this.http.get<CategoriaDTO[]>(`${this.apiUrl}/categorias`);
  }

  /**
   * Registra un nuevo plato enviando su categoría y lista de IDs de adicionales disponibles.
   */
  addComida(comida: ComidaDTO): Observable<ComidaDTO> {
    return this.http.post<ComidaDTO>(`${this.apiUrl}/comidas`, comida);
  }

  /**
   * Actualiza los datos de un plato y su relación de adicionales disponibles.
   */
  updateComida(id: number, comida: ComidaDTO): Observable<ComidaDTO> {
    return this.http.put<ComidaDTO>(`${this.apiUrl}/comidas/${id}`, comida);
  }

  /**
   * Elimina un plato de la base de datos.
   */
  eliminarComida(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/comidas/${id}`);
  }
}
