import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ItemCarritoDTO } from '../../../../dtos/carrito.dto';

/**
 * Subcomponente visual para la lista de ítems en el carrito de compras.
 * Permite visualizar platos, adicionales seleccionados, controles de cantidad y eliminar.
 */
@Component({
  selector: 'app-carrito-items',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './carrito-items.component.html',
  styleUrl: './carrito-items.component.css',
})
export class CarritoItemsComponent {
  items = input<ItemCarritoDTO[]>([]);
  cantidadTotal = input<number>(0);

  modificarCantidad = output<{ id: string; delta: number }>();
  eliminar = output<string>();
  vaciar = output<void>();

  onDelta(id: string, delta: number): void {
    this.modificarCantidad.emit({ id, delta });
  }

  onEliminar(id: string): void {
    this.eliminar.emit(id);
  }

  onVaciar(): void {
    this.vaciar.emit();
  }
}
