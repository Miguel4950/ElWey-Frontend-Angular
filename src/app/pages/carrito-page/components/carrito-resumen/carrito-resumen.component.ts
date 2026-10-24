import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ClienteDTO } from '../../../../dtos/cliente.dto';

/**
 * Subcomponente visual para la columna de resumen de orden y confirmación del carrito.
 */
@Component({
  selector: 'app-carrito-resumen',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './carrito-resumen.component.html',
  styleUrl: './carrito-resumen.component.css',
})
export class CarritoResumenComponent {
  cantidadTotal = input<number>(0);
  subtotalComidas = input<number>(0);
  cantidadAdicionales = input<number>(0);
  subtotalAdicionales = input<number>(0);
  total = input<number>(0);
  clienteActual = input<ClienteDTO | null>(null);
  cargando = input<boolean>(false);

  confirmar = output<void>();

  onConfirmar(): void {
    this.confirmar.emit();
  }
}
