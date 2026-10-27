import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PedidoDTO } from '../../../../dtos/pedido.dto';
import { DomiciliarioDTO } from '../../../../dtos/domiciliario.dto';

/**
 * Subcomponente para el panel de control y despacho operativo del pedido.
 * Maneja la transición de 'Cocinando' -> 'Enviado' -> 'Entregado'.
 */
@Component({
  selector: 'app-pedido-gestion',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pedido-gestion.component.html',
  styleUrl: './pedido-gestion.component.css',
})
export class PedidoGestionComponent {
  pedido = input.required<PedidoDTO>();
  puedeGestionar = input<boolean>(false);
  domiciliariosDisponibles = input<DomiciliarioDTO[]>([]);

  despachar = output<number>();
  confirmarEntrega = output<void>();

  domiciliarioSeleccionadoId?: number;

  onDespachar(): void {
    if (!this.domiciliarioSeleccionadoId) {
      alert('Debes seleccionar un domiciliario disponible para despachar el pedido.');
      return;
    }
    this.despachar.emit(this.domiciliarioSeleccionadoId);
  }

  onEntregar(): void {
    this.confirmarEntrega.emit();
  }
}
