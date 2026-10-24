import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { PedidoDTO } from '../../../../dtos/pedido.dto';

/**
 * Subcomponente visual para la tabla de historial de pedidos entregados en Mi Portal.
 */
@Component({
  selector: 'app-portal-historial-pedidos',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './portal-historial-pedidos.component.html',
  styleUrl: './portal-historial-pedidos.component.css',
})
export class PortalHistorialPedidosComponent {
  pedidos = input<PedidoDTO[]>([]);
}
