import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrearPedidoDTO, PedidoDTO } from '../dtos/pedido.dto';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/pedidos';

  getPedidos(): Observable<PedidoDTO[]> {
    return this.http.get<PedidoDTO[]>(this.apiUrl);
  }

  getPedidoById(id: number): Observable<PedidoDTO> {
    return this.http.get<PedidoDTO>(`${this.apiUrl}/${id}`);
  }

  getPedidosByCliente(clienteId: number): Observable<PedidoDTO[]> {
    return this.http.get<PedidoDTO[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  crearPedido(pedido: CrearPedidoDTO): Observable<PedidoDTO> {
    return this.http.post<PedidoDTO>(`${this.apiUrl}/ordenar`, pedido);
  }
}
