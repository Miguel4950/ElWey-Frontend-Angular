import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoriaDTO } from '../dtos/categoria.dto';
import { Categoria } from '../models/categoria.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080';
  private apiUrl = 'http://localhost:8080/categorias';

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}`);
  }

  getCategoriasConAdicionales(): Observable<CategoriaDTO[]> {
    return this.http.get<CategoriaDTO[]>(`${this.apiUrl}/adicionales`);
  }

  guardarAdicionalesPorCategoria(categoria: CategoriaDTO): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/adicionales`, {
      categoriaId: categoria.id,
      adicionalesIds: categoria.adicionalesIds,
    });
  }
}
