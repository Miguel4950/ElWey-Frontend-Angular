import { Component, computed, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ClienteDTO } from '../../../../dtos/cliente.dto';
import { UsuarioDTO } from '../../../../dtos/usuario.dto';

/**
 * Subcomponente visual para la columna de resumen de orden y confirmación del carrito.
 * Incluye selector reactivo de propinas para el domiciliario mediante Signals.
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
  clienteActual = input<UsuarioDTO | ClienteDTO | null>(null);
  cargando = input<boolean>(false);

  confirmar = output<void>();

  // Estado reactivo para selector de propina voluntaria
  porcentajePropina = signal<number>(10);
  modoPersonalizado = signal<boolean>(false);
  propinaPersonalizadaInput = signal<number>(0);

  valorPropina = computed(() => {
    if (this.modoPersonalizado()) {
      return Math.max(0, this.propinaPersonalizadaInput());
    }
    const base = this.total();
    const pct = this.porcentajePropina();
    if (pct <= 0 || base <= 0) {
      return 0;
    }
    return Math.round((base * pct) / 100);
  });

  totalConPropina = computed(() => {
    return this.total() + this.valorPropina();
  });

  seleccionarPorcentaje(pct: number): void {
    this.modoPersonalizado.set(false);
    this.porcentajePropina.set(pct);
  }

  activarPersonalizado(): void {
    this.modoPersonalizado.set(true);
    if (this.propinaPersonalizadaInput() === 0) {
      this.propinaPersonalizadaInput.set(3000);
    }
  }

  onInputPropina(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const valor = Number(inputElement.value);
    this.propinaPersonalizadaInput.set(isNaN(valor) || valor < 0 ? 0 : valor);
  }

  onConfirmar(): void {
    this.confirmar.emit();
  }
}
