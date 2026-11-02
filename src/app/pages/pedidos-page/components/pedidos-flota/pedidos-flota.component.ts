import { Component, input } from '@angular/core';
import { DomiciliarioDTO } from '../../../../dtos/domiciliario.dto';

export interface DomiciliarioCargaItem {
  domiciliario: DomiciliarioDTO;
  estaDisponible: boolean;
  pedidosActivos: number;
  pedidosEnRuta: number;
  pedidosEnCola: number;
  estadoCarga: 'DISPONIBLE' | 'OCUPADO';
}

@Component({
  selector: 'app-pedidos-flota',
  imports: [],
  templateUrl: './pedidos-flota.component.html',
  styleUrl: './pedidos-flota.component.css',
})
export class PedidosFlotaComponent {
  flotaConCarga = input.required<DomiciliarioCargaItem[]>();
  totalDomiciliariosDisponibles = input<number>(0);
  totalDomiciliariosOcupados = input<number>(0);
}
