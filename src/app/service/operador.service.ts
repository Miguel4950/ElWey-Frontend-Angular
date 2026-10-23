import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OperadorDTO } from '../dtos/operador.dto';

/**
 * Servicio para la gestión administrativa de Operadores de cocina y despacho.
 * Conecta con el controlador REST OperadorController de Spring Boot en el puerto 8080.
 */
@Injectable({
  providedIn: 'root',
})
export class OperadorService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/operadores';

  /**
   * Consulta el listado completo de operadores registrados.
   */
  getOperadores(): Observable<OperadorDTO[]> {
    return this.http.get<OperadorDTO[]>(this.apiUrl);
  }

  /**
   * Consulta los datos de un operador a partir de su ID.
   */
  getOperadorById(id: number): Observable<OperadorDTO> {
    return this.http.get<OperadorDTO>(`${this.apiUrl}/${id}`);
  }

  /**
   * Registra un nuevo operador en el sistema con su nombre, usuario y clave.
   */
  createOperador(operador: OperadorDTO): Observable<OperadorDTO> {
    return this.http.post<OperadorDTO>(this.apiUrl, operador);
  }

  /**
   * Actualiza los datos de un operador existente.
   */
  updateOperador(id: number, operador: OperadorDTO): Observable<OperadorDTO> {
    return this.http.put<OperadorDTO>(`${this.apiUrl}/${id}`, operador);
  }

  /**
   * Elimina un operador del sistema por su identificador ID.
   */
  deleteOperador(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
