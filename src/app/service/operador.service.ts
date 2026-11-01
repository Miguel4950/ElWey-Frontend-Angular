import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Operador } from '../models/operador.model';
import { Login, Usuario } from '../models/usuario.model';

// Servicio para gestión y login de operadores de cocina
@Injectable({
  providedIn: 'root',
})
export class OperadorService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/operador';

  // Login de operador
  autenticar(credenciales: Login): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, credenciales).pipe(
      map((u) => ({
        ...u,
        nombre: u.nombre || u.usuario || 'Operador',
        correo: u.correo || u.usuario || credenciales.correo,
        rol: 'OPERADOR',
      }))
    );
  }

  // Lista todos los operadores
  getOperadores(): Observable<Operador[]> {
    return this.http.get<Operador[]>(`${this.apiUrl}/all`);
  }

  // Consulta por ID
  getOperadorById(id: number): Observable<Operador> {
    return this.http.get<Operador>(`${this.apiUrl}/${id}`);
  }

  // Agrega un nuevo operador
  createOperador(operador: Operador): Observable<Operador> {
    return this.http.post<Operador>(`${this.apiUrl}/add`, operador);
  }

  // Actualiza datos de un operador
  updateOperador(id: number, operador: Operador): Observable<Operador> {
    return this.http.put<Operador>(`${this.apiUrl}/update/${id}`, operador);
  }

  // Elimina un operador por ID
  deleteOperador(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
