import { Component, input, output, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ClienteDTO } from '../../../../dtos/cliente.dto';
import { UsuarioDTO } from '../../../../dtos/usuario.dto';
import { CuponDescuentoComponent, CuponAplicado } from '../cupon-descuento/cupon-descuento.component';

/**
 * Subcomponente visual para la columna de resumen de orden y confirmación del carrito.
 */
@Component({
  selector: 'app-carrito-resumen',
  standalone: true,
  imports: [RouterLink, DecimalPipe, CuponDescuentoComponent],
  templateUrl: './carrito-resumen.component.html',
  styleUrl: './carrito-resumen.component.css',
})
export class CarritoResumenComponent {
  cantidadTotal = input<number>(0);
  subtotalComidas = input<number>(0);
  cantidadAdicionales = input<number>(0);
  subtotalAdicionales = input<number>(0);
  total = input<number>(0);
  clienteActual = input<UsuarioDTO | ClienteDTO | null>(null);
  cargando = input<boolean>(false);

  cuponActual = signal<CuponAplicado | null>(null);

  descuentoCupon = computed(() => {
    const c = this.cuponActual();
    const t = this.total();
    if (!c || t <= 0) return 0;
    return c.tipo === 'porcentaje'
      ? Math.round((t * c.valor) / 100)
      : Math.min(t, c.valor);
  });

  totalFinal = computed(() => {
    return Math.max(0, this.total() - this.descuentoCupon());
  });

  confirmar = output<void>();

  onCuponCambiado(cupon: CuponAplicado | null): void {
    this.cuponActual.set(cupon);
  }

  onConfirmar(): void {
    this.confirmar.emit();
  }
}
