import { Component, input, output } from '@angular/core';
import { Pedido } from '../../../../models/pedido.model';
import { DomiciliarioPedidoCardComponent } from '../domiciliario-pedido-card/domiciliario-pedido-card.component';

@Component({
  selector: 'app-domiciliario-pedidos-seccion',
  imports: [DomiciliarioPedidoCardComponent],
  templateUrl: './domiciliario-pedidos-seccion.component.html',
  styleUrl: './domiciliario-pedidos-seccion.component.css',
})
export class DomiciliarioPedidosSeccionComponent {
  titulo = input.required<string>();
  iconoClase = input.required<string>();
  pedidos = input.required<Pedido[]>();
  mensajeVacio = input.required<string>();
  iconoVacio = input<string>('bi-box2');

  confirmarEntrega = output<number>();

  onEntregar(id: number): void {
    this.confirmarEntrega.emit(id);
  }
}
