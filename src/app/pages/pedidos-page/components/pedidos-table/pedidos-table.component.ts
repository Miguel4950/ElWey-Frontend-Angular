import { Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidoDTO } from '../../../../dtos/pedido.dto';
import { DomiciliarioDTO } from '../../../../dtos/domiciliario.dto';
import { ClienteService } from '../../../../service/cliente.service';

/**
 * Componente hijo para la visualización y gestión del ciclo de vida de pedidos en comanda.
 * Maneja los 3 estados del pedido: 'Cocinando', 'Enviado' y 'Entregado'.
 */
@Component({
  selector: 'app-pedidos-table',
  imports: [DecimalPipe, FormsModule],
  templateUrl: './pedidos-table.component.html',
  styleUrl: './pedidos-table.component.css',
})
export class PedidosTableComponent {
  private router = inject(Router);
  private clienteService = inject(ClienteService);

  // Inputs con signals de Angular 19
  pedidosArray = input<PedidoDTO[]>();
  domiciliariosDisponibles = input<DomiciliarioDTO[]>([]);

  // Output para notificar al componente padre el cambio de estado de un pedido
  onActualizarEstado = output<{
    pedidoId: number;
    nuevoEstado: string;
    domiciliarioId?: number;
  }>();

  // Diccionario para almacenar el domiciliario seleccionado por cada pedido cocinando
  domiciliarioSeleccionadoPorPedido: { [pedidoId: number]: number } = {};

  get puedeGestionar(): boolean {
    return (
      this.clienteService.esOperador() ||
      this.clienteService.esAdmin() ||
      this.clienteService.esDomiciliario()
    );
  }

  verDetallePedido(pedido: PedidoDTO): void {
    this.router.navigate(['/pedidos', pedido.id]);
  }

  onSelectDomiciliario(pedidoId: number, domiciliarioId: number): void {
    this.domiciliarioSeleccionadoPorPedido[pedidoId] = domiciliarioId;
  }

  /**
   * Asigna un domiciliario y despacha el pedido marcándolo como 'Enviado'.
   */
  enviarPedido(pedidoId: number): void {
    const domId = this.domiciliarioSeleccionadoPorPedido[pedidoId];
    if (!domId) {
      alert('Por favor selecciona un domiciliario disponible para despachar el pedido.');
      return;
    }

    this.onActualizarEstado.emit({
      pedidoId,
      nuevoEstado: 'Enviado',
      domiciliarioId: domId,
    });
  }

  /**
   * Marca el pedido como 'Entregado' al cliente y libera al domiciliario.
   */
  marcarEntregado(pedidoId: number): void {
    this.onActualizarEstado.emit({
      pedidoId,
      nuevoEstado: 'Entregado',
    });
  }
}
