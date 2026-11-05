import { Component, input, output, signal, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';

export interface CuponAplicado {
  codigo: string;
  descripcion: string;
  tipo: 'porcentaje' | 'fijo';
  valor: number;
}

interface CuponValido {
  codigo: string;
  tipo: 'porcentaje' | 'fijo';
  valor: number;
  descripcion: string;
}

/**
 * Componente interactivo para aplicar y gestionar cupones de descuento
 * en el carrito de compras de "El Wey".
 * Cumple al 100% con la doctrina Angarita: Standalone puro, Signals reactivos
 * sin FormsModule ni ngModel.
 */
@Component({
  selector: 'app-cupon-descuento',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './cupon-descuento.component.html',
  styleUrl: './cupon-descuento.component.css',
})
export class CuponDescuentoComponent {
  subtotal = input<number>(0);
  cuponCambiado = output<CuponAplicado | null>();

  codigoInput = signal<string>('');
  cuponActual = signal<CuponAplicado | null>(null);
  mensajeError = signal<string>('');
  mensajeExito = signal<string>('');

  // Cupones oficiales configurados para la taquería
  private readonly CUPONES_DISPONIBLES: Record<string, CuponValido> = {
    ELWEY10: {
      codigo: 'ELWEY10',
      tipo: 'porcentaje',
      valor: 10,
      descripcion: '10% de descuento en tu orden',
    },
    TACOLOVER: {
      codigo: 'TACOLOVER',
      tipo: 'porcentaje',
      valor: 15,
      descripcion: '15% de descuento para amantes de los tacos',
    },
    PROMO5K: {
      codigo: 'PROMO5K',
      tipo: 'fijo',
      valor: 5000,
      descripcion: '$5.000 COP de descuento directo',
    },
    BIENVENIDO: {
      codigo: 'BIENVENIDO',
      tipo: 'fijo',
      valor: 3000,
      descripcion: '$3.000 COP de regalo de bienvenida',
    },
  };

  readonly sugerencias = ['ELWEY10', 'TACOLOVER', 'PROMO5K'];

  // Descuento reactivo calculado en vivo con el subtotal actual del carrito
  descuentoCalculado = computed(() => {
    const cup = this.cuponActual();
    const sub = this.subtotal();
    if (!cup || sub <= 0) return 0;
    return cup.tipo === 'porcentaje'
      ? Math.round((sub * cup.valor) / 100)
      : Math.min(sub, cup.valor);
  });

  onCodigoInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.codigoInput.set(target.value);
  }

  aplicarCupon(): void {
    const raw = this.codigoInput().trim().toUpperCase();
    this.mensajeError.set('');
    this.mensajeExito.set('');

    if (!raw) {
      this.mensajeError.set('Ingresa un código de cupón para validar.');
      return;
    }

    const definicion = this.CUPONES_DISPONIBLES[raw];
    if (!definicion) {
      this.mensajeError.set(`¡Órale! El cupón "${raw}" no es válido. Prueba uno de la lista.`);
      return;
    }

    const aplicado: CuponAplicado = {
      codigo: definicion.codigo,
      descripcion: definicion.descripcion,
      tipo: definicion.tipo,
      valor: definicion.valor,
    };

    this.cuponActual.set(aplicado);
    this.mensajeExito.set(`¡Cupón ${definicion.codigo} activado con éxito!`);
    this.cuponCambiado.emit(aplicado);
  }

  seleccionarSugerencia(codigo: string): void {
    this.codigoInput.set(codigo);
    this.aplicarCupon();
  }

  removerCupon(): void {
    this.cuponActual.set(null);
    this.codigoInput.set('');
    this.mensajeError.set('');
    this.mensajeExito.set('');
    this.cuponCambiado.emit(null);
  }
}
