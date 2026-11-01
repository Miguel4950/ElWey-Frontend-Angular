import { Component, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Pedido } from '../../../../models/pedido.model';

@Component({
  selector: 'app-domiciliario-pedido-card',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './domiciliario-pedido-card.component.html',
  styleUrl: './domiciliario-pedido-card.component.css',
})
export class DomiciliarioPedidoCardComponent {
  pedido = input.required<Pedido>();
  confirmarEntrega = output<number>();

  get esEnRuta(): boolean {
    const estado = this.pedido().estado;
    return estado === 'Enviado' || estado === 'En camino' || estado === 'Enviando';
  }

  get esListo(): boolean {
    return this.pedido().estado === 'Listo';
  }

  get esCocinando(): boolean {
    return this.pedido().estado === 'Cocinando';
  }

  get esEntregado(): boolean {
    return this.pedido().estado === 'Entregado';
  }

  onEntregar(): void {
    this.confirmarEntrega.emit(this.pedido().id);
  }
}
