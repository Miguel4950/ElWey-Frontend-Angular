import { Component, input, output, signal, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';

/**
 * Modal interactivo para el programa de referidos "Invita a un Compadre y Ganan Ambos".
 * Permite copiar enlace personalizado o compartir por WhatsApp para ganar saldo promocional.
 * Standalone puro, Signals reactivos de Angular 19.
 */
@Component({
  selector: 'app-referir-modal',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './referir-modal.component.html',
  styleUrl: './referir-modal.component.css',
})
export class ReferirModalComponent {
  visible = input<boolean>(false);
  clienteNombre = input<string>('Compadre');
  clienteId = input<number>(1);

  cerrar = output<void>();

  copiado = signal<boolean>(false);
  referidosExitosos = signal<number>(2);

  // Código único de embajador
  codigoReferido = computed(() => {
    const primerNombre = (this.clienteNombre() || 'WEY').trim().split(' ')[0].toUpperCase();
    const id = this.clienteId() || 1;
    return `AMIGO-${primerNombre}-${String(id).padStart(3, '0')}`;
  });

  // Saldo total ganado en pesos COP
  saldoGanado = computed(() => {
    return this.referidosExitosos() * 5000;
  });

  // Mensaje promocional formateado para redes / WhatsApp
  mensajeCompartir = computed(() => {
    return `¡Órale! Te invito a probar la mejor comida mexicana en Taquería El Wey 🌮. Usa mi código ${this.codigoReferido()} y recibe $5.000 COP de descuento en tu primer pedido. Pide aquí: http://localhost:4200/comidas/tarjetas`;
  });

  copiarCodigo(): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(this.mensajeCompartir()).then(() => {
        this.copiado.set(true);
        setTimeout(() => this.copiado.set(false), 3000);
      });
    } else {
      this.copiado.set(true);
      setTimeout(() => this.copiado.set(false), 3000);
    }
  }

  compartirWhatsApp(): void {
    if (typeof window !== 'undefined') {
      const textoEncoded = encodeURIComponent(this.mensajeCompartir());
      window.open(`https://api.whatsapp.com/send?text=${textoEncoded}`, '_blank');
    }
  }

  onCerrar(): void {
    this.copiado.set(false);
    this.cerrar.emit();
  }
}
