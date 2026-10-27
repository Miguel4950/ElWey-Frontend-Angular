import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { OperadorDTO } from '../dtos/operador.dto';
import { UsuarioDTO } from '../dtos/usuario.dto';
import { LoginDTO } from '../dtos/login.dto';

/**
 * Servicio para la gestión administrativa y autenticación de Operadores de cocina y despacho.
 * Conecta con OperadorController de Spring Boot en el puerto 8080 (sin /api).
 */
@Injectable({
  providedIn: 'root',
})
export class OperadorService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/operador';

  /**
   * Autenticación exclusiva para el rol de Operador.
   */
  autenticar(credenciales: LoginDTO): Observable<UsuarioDTO> {
    return this.http.post<UsuarioDTO>(`${this.apiUrl}/login`, credenciales).pipe(
      map((u) => ({
        ...u,
        nombre: u.nombre || u.usuario || 'Operador',
        correo: u.correo || u.usuario || credenciales.correo,
        rol: 'OPERADOR',
      }))
    );
  }

  /**
   * Consulta el listado completo de operadores registrados.
   */
  getOperadores(): Observable<OperadorDTO[]> {
    return this.http.get<OperadorDTO[]>(`${this.apiUrl}/all`);
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
    return this.http.post<OperadorDTO>(`${this.apiUrl}/add`, operador);
  }

  /**
   * Actualiza los datos de un operador existente.
   */
  updateOperador(id: number, operador: OperadorDTO): Observable<OperadorDTO> {
    return this.http.put<OperadorDTO>(`${this.apiUrl}/update/${id}`, operador);
  }

  /**
   * Elimina un operador del sistema por su identificador ID.
   */
  deleteOperador(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
