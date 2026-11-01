import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, mergeMap, map } from 'rxjs';
import { CrearPedido } from '../models/crear-pedido.model';
import { ActualizarEstadoPedido, ItemPedido, Pedido } from '../models/pedido.model';

// Servicio para consultar y gestionar pedidos con el backend
@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/pedidos';

  // Consulta todos los pedidos
  getPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.apiUrl);
  }

  // Consulta un pedido por ID
  getPedidoById(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.apiUrl}/${id}`);
  }

  // Pedidos de un cliente específico
  getPedidosByCliente(clienteId: number): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  // Pedidos asignados a un repartidor
  getPedidosPorDomiciliario(domiciliarioId: number): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}/domiciliario/${domiciliarioId}`);
  }

  // Items de un pedido específico
  getItemsByPedidoId(id: number): Observable<ItemPedido[]> {
    return this.http.get<ItemPedido[]>(`${this.apiUrl}/${id}/items`);
  }

  // Consulta el pedido e incluye sus items
  getPedidoConItems(id: number): Observable<Pedido> {
    return this.getPedidoById(id).pipe(
      mergeMap((pedido: Pedido) => {
        return this.getItemsByPedidoId(id).pipe(
          map((items) => {
            pedido.items = items;
            return pedido;
          })
        );
      })
    );
  }

  // Envía un nuevo pedido a cocina
  crearPedido(pedido: CrearPedido): Observable<Pedido> {
    return this.http.post<Pedido>(`${this.apiUrl}/ordenar`, pedido);
  }

  // Actualiza el estado ('En preparación', 'En camino', 'Entregado') y domiciliario
  actualizarEstadoPedido(id: number, dto: ActualizarEstadoPedido): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.apiUrl}/${id}/estado`, dto);
  }

  // Elimina un pedido por ID
  eliminarPedido(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
