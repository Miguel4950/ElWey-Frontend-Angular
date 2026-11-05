import { Component, input, output, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { PedidoDTO } from '../../../../dtos/pedido.dto';

/**
 * Modal interactivo que renderiza una comanda y factura fiscal electrónica
 * estilizada de "El Wey", con desglose de Impoconsumo (8%), datos tributarios,
 * código QR en SVG nativo y disparador de impresión directa o guardado en PDF.
 */
@Component({
  selector: 'app-factura-modal',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './factura-modal.component.html',
  styleUrl: './factura-modal.component.css',
})
export class FacturaModalComponent {
  pedido = input.required<PedidoDTO>();
  visible = input<boolean>(false);

  cerrar = output<void>();

  // Base gravable sin el 8% de impoconsumo
  subtotalBase = computed(() => {
    const tot = this.pedido().total || 0;
    return Math.round(tot / 1.08);
  });

  // 8% Impuesto Nacional al Consumo de restaurantes
  impoconsumo = computed(() => {
    return (this.pedido().total || 0) - this.subtotalBase();
  });

  // Consecutivo oficial fiscal
  numeroFactura = computed(() => {
    const id = this.pedido().id;
    return `EW-2026-${String(id).padStart(5, '0')}`;
  });

  imprimir(): void {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }

  onCerrar(): void {
    this.cerrar.emit();
  }
}
