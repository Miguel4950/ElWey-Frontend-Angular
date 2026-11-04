import { Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { PedidoDTO } from '../../../../dtos/pedido.dto';

export interface PasoSeguimiento {
  id: string;
  numero: number;
  etiqueta: string;
  descripcion: string;
  icono: string;
}

/**
 * Subcomponente visual para la comanda, seguimiento por pasos (stepper), datos del cliente y desglose de platos.
 */
@Component({
  selector: 'app-pedido-info',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './pedido-info.component.html',
  styleUrl: './pedido-info.component.css',
})
export class PedidoInfoComponent {
  pedido = input.required<PedidoDTO>();

  readonly pasos: PasoSeguimiento[] = [
    { id: 'Cocinando', numero: 1, etiqueta: 'En Cocina', descripcion: 'Preparando platos', icono: '👨‍🍳' },
    { id: 'Listo', numero: 2, etiqueta: 'Listo', descripcion: 'Empacado y listo', icono: '🌮' },
    { id: 'Enviado', numero: 3, etiqueta: 'En Camino', descripcion: 'Con domiciliario', icono: '🛵' },
    { id: 'Entregado', numero: 4, etiqueta: 'Entregado', descripcion: 'Completado con éxito', icono: '🎉' },
  ];

  readonly pasoActualNumero = computed<number>(() => {
    const estado = this.pedido()?.estado?.toLowerCase() || '';
    if (estado.includes('entregado')) return 4;
    if (estado.includes('enviad') || estado.includes('camino')) return 3;
    if (estado.includes('listo')) return 2;
    return 1;
  });

  readonly porcentajeProgreso = computed<number>(() => {
    const num = this.pasoActualNumero();
    return Math.min(100, Math.max(0, ((num - 1) / (this.pasos.length - 1)) * 100));
  });
}
