import { Component, computed, input } from '@angular/core';
import { PedidoDTO } from '../../../../dtos/pedido.dto';

/**
 * Subcomponente visual Lego para el seguimiento logístico en vivo
 * y radar interactivo de despacho para pedidos de "El Wey".
 */
@Component({
  selector: 'app-pedido-tracking',
  standalone: true,
  templateUrl: './pedido-tracking.component.html',
  styleUrl: './pedido-tracking.component.css'
})
export class PedidoTrackingComponent {
  pedido = input.required<PedidoDTO>();

  porcentajeProgreso = computed(() => {
    const estado = this.pedido().estado?.toLowerCase();
    switch (estado) {
      case 'cocinando':
        return 35;
      case 'enviado':
        return 75;
      case 'entregado':
        return 100;
      case 'cancelado':
        return 0;
      default:
        return 20;
    }
  });

  tiempoEstimadoMinutos = computed(() => {
    const estado = this.pedido().estado?.toLowerCase();
    if (estado === 'cocinando') return '25 - 35 min';
    if (estado === 'enviado') return '10 - 15 min';
    if (estado === 'entregado') return 'Entregado a tiempo';
    if (estado === 'cancelado') return 'Cancelado';
    return 'Estimando...';
  });

  pasoActual = computed(() => {
    const estado = this.pedido().estado?.toLowerCase();
    if (estado === 'cocinando') return 1;
    if (estado === 'enviado') return 2;
    if (estado === 'entregado') return 3;
    return 0;
  });
}
