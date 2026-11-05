import { Component, input, output, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ResultadoPago {
  metodo: 'tarjeta' | 'pse' | 'efectivo';
  detalle: string;
}

@Component({
  selector: 'app-carrito-pasarela-pago',
  standalone: true,
  imports: [CommonModule, DecimalPipe, FormsModule],
  templateUrl: './carrito-pasarela-pago.component.html',
  styleUrl: './carrito-pasarela-pago.component.css',
})
export class CarritoPasarelaPagoComponent {
  mostrar = input<boolean>(false);
  total = input<number>(0);
  clienteNombre = input<string>('');

  cerrar = output<void>();
  pagoAprobado = output<ResultadoPago>();

  metodoSeleccionado = signal<'tarjeta' | 'pse' | 'efectivo'>('tarjeta');
  procesando = signal<boolean>(false);
  mensajeEstado = signal<string>('');

  // Datos Tarjeta
  numeroTarjeta: string = '4532 8921 7840 9123';
  nombreTitular: string = '';
  expiracion: string = '12/28';
  cvv: string = '888';

  // Datos PSE
  banco: string = 'Nequi';
  bancosDisponibles: string[] = [
    'Nequi',
    'Daviplata',
    'Bancolombia',
    'Davivienda',
    'Banco de Bogotá',
    'BBVA Colombia',
  ];
  celularPSE: string = '310 987 6543';

  // Datos Efectivo
  montoEfectivo: number = 0;

  get cambioEfectivo(): number {
    const pagarCon = this.montoEfectivo || this.total();
    return Math.max(0, pagarCon - this.total());
  }

  get franquiciaTarjeta(): string {
    const clean = this.numeroTarjeta.replace(/\s+/g, '');
    if (clean.startsWith('4')) return 'Visa';
    if (clean.startsWith('5')) return 'MasterCard';
    if (clean.startsWith('3')) return 'American Express';
    return 'Tarjeta';
  }

  seleccionarMetodo(metodo: 'tarjeta' | 'pse' | 'efectivo'): void {
    this.metodoSeleccionado.set(metodo);
    if (metodo === 'efectivo' && this.montoEfectivo === 0) {
      // Sugerir redondeo superior al total
      const t = this.total();
      this.montoEfectivo = Math.ceil(t / 10000) * 10000;
      if (this.montoEfectivo === 0) this.montoEfectivo = 50000;
    }
    if (metodo === 'tarjeta' && !this.nombreTitular && this.clienteNombre()) {
      this.nombreTitular = this.clienteNombre();
    }
  }

  cancelar(): void {
    if (this.procesando()) return;
    this.cerrar.emit();
  }

  confirmarTransaccion(): void {
    if (this.procesando()) return;

    this.procesando.set(true);
    this.mensajeEstado.set('Iniciando protocolo seguro SSL/TLS...');

    setTimeout(() => {
      this.mensajeEstado.set('Verificando fondos con la entidad financiera...');
    }, 700);

    setTimeout(() => {
      this.mensajeEstado.set('¡Transacción autorizada con éxito!');
      setTimeout(() => {
        this.procesando.set(false);

        let detalle = '';
        const m = this.metodoSeleccionado();
        if (m === 'tarjeta') {
          detalle = `${this.franquiciaTarjeta} terminada en ${this.numeroTarjeta.slice(-4)}`;
        } else if (m === 'pse') {
          detalle = `Transferencia digital ${this.banco} (${this.celularPSE})`;
        } else {
          detalle = `Efectivo contra entrega (Paga con $${this.montoEfectivo.toLocaleString('es-CO')})`;
        }

        this.pagoAprobado.emit({
          metodo: m,
          detalle,
        });
      }, 500);
    }, 1500);
  }
}
