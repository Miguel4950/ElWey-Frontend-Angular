import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, mergeMap, map } from 'rxjs';
import { ActualizarEstadoPedidoDTO, CrearPedidoDTO, ItemPedidoDTO, PedidoDTO } from '../dtos/pedido.dto';

/**
 * Servicio para la gestión integral de pedidos, comanda y ciclo de estados.
 * Conecta con el controlador REST PedidoController de Spring Boot en el puerto 8080 (sin /api).
 * Demuestra encadenamiento reactivo con mergeMap para consultas secundarias sin anidar subscribe.
 */
@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/pedidos';

  /**
   * Consulta la lista completa de pedidos en el restaurante.
   */
  getPedidos(): Observable<PedidoDTO[]> {
    return this.http.get<PedidoDTO[]>(this.apiUrl);
  }

  /**
   * Consulta el detalle consolidado de un pedido por su ID.
   */
  getPedidoById(id: number): Observable<PedidoDTO> {
    return this.http.get<PedidoDTO>(`${this.apiUrl}/${id}`);
  }

  /**
   * Consulta los pedidos asociados a un cliente específico.
   */
  getPedidosByCliente(clienteId: number): Observable<PedidoDTO[]> {
    return this.http.get<PedidoDTO[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  /**
   * Consulta la lista de ítems detallados de un pedido específico.
   */
  getItemsByPedidoId(id: number): Observable<ItemPedidoDTO[]> {
    return this.http.get<ItemPedidoDTO[]>(`${this.apiUrl}/${id}/items`);
  }

  /**
   * Consulta un pedido y encadena la consulta secundaria de sus ítems mediante mergeMap
   * para evitar suscribirse dentro de otro subscribe.
   */
  getPedidoConItems(id: number): Observable<PedidoDTO> {
    return this.getPedidoById(id).pipe(
      mergeMap((pedido: PedidoDTO) => {
        return this.getItemsByPedidoId(id).pipe(
          map((items) => {
            pedido.items = items;
            return pedido;
          })
        );
      })
    );
  }

  /**
   * Crea un nuevo pedido con uno o múltiples platos y sus respectivos adicionales.
   */
  crearPedido(pedido: CrearPedidoDTO): Observable<PedidoDTO> {
    return this.http.post<PedidoDTO>(`${this.apiUrl}/ordenar`, pedido);
  }

  /**
   * Actualiza el estado operativo del pedido ('En preparación', 'En camino', 'Entregado')
   * y asigna o libera al domiciliario correspondiente.
   */
  actualizarEstadoPedido(id: number, dto: ActualizarEstadoPedidoDTO): Observable<PedidoDTO> {
    return this.http.put<PedidoDTO>(`${this.apiUrl}/${id}/estado`, dto);
  }

  /**
   * Elimina un pedido por su identificador ID.
   */
  eliminarPedido(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
