import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { PedidoDTO } from '../../../../dtos/pedido.dto';

@Component({
  selector: 'app-pedidos-table',
  imports: [DecimalPipe],
  templateUrl: './pedidos-table.component.html',
  styleUrl: './pedidos-table.component.css',
})
export class PedidosTableComponent {
  router = inject(Router);

  // Signal Input
  pedidosArray = input<PedidoDTO[]>();

  verDetallePedido(pedido: PedidoDTO): void {
    this.router.navigate(['/pedidos', pedido.id]);
  }
}
