import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { PedidoDTO } from '../../../../dtos/pedido.dto';

/**
 * Subcomponente visual para mostrar los pedidos activos en tiempo real en Mi Portal.
 */
@Component({
  selector: 'app-portal-pedidos-activos',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './portal-pedidos-activos.component.html',
  styleUrl: './portal-pedidos-activos.component.css',
})
export class PortalPedidosActivosComponent {
  pedidos = input<PedidoDTO[]>([]);
}
