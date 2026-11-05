import { Component, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Pedido } from '../../../../models/pedido.model';
import { DomiciliarioAccionesRutaComponent } from '../domiciliario-acciones-ruta/domiciliario-acciones-ruta.component';

@Component({
  selector: 'app-domiciliario-pedido-card',
  standalone: true,
  imports: [DecimalPipe, DomiciliarioAccionesRutaComponent],
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
