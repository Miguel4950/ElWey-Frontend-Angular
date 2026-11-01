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
  modo = input<'EN_RUTA' | 'EN_COLA' | 'ENTREGADOS' | 'TODOS'>('TODOS');
  confirmarEntrega = output<number>();

  onEntregar(): void {
    this.confirmarEntrega.emit(this.pedido().id);
  }
}
