import { Component, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { PedidoDTO } from '../../../../dtos/pedido.dto';
import { CalificacionPedidoModalComponent, CalificacionResultado } from '../calificacion-pedido-modal/calificacion-pedido-modal.component';

/**
 * Subcomponente visual para la tabla de historial de pedidos entregados en Mi Portal.
 * Permite calificar y dejar opiniones interactivas sobre pedidos completados.
 */
@Component({
  selector: 'app-portal-historial-pedidos',
  standalone: true,
  imports: [RouterLink, DecimalPipe, CalificacionPedidoModalComponent],
  templateUrl: './portal-historial-pedidos.component.html',
  styleUrl: './portal-historial-pedidos.component.css',
})
export class PortalHistorialPedidosComponent {
  pedidos = input<PedidoDTO[]>([]);

  pedidoAEditar = signal<PedidoDTO | null>(null);
  modalVisible = signal<boolean>(false);
  calificaciones = signal<Record<number, CalificacionResultado>>({});

  abrirModalCalificacion(ped: PedidoDTO): void {
    this.pedidoAEditar.set(ped);
    this.modalVisible.set(true);
  }

  cerrarModal(): void {
    this.modalVisible.set(false);
  }

  onCalificacionGuardada(res: CalificacionResultado): void {
    this.calificaciones.update((map) => ({ ...map, [res.pedidoId]: res }));
  }
}
