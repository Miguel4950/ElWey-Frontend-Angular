import { Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { PedidoDTO } from '../../../../dtos/pedido.dto';

/**
 * Subcomponente visual para la comanda, datos del cliente, resumen y desglose de platos con adicionales.
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
}
