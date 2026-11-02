import { Component, input } from '@angular/core';

@Component({
  selector: 'app-pedidos-flota',
  imports: [],
  templateUrl: './pedidos-flota.component.html',
  styleUrl: './pedidos-flota.component.css',
})
export class PedidosFlotaComponent {
  flotaConCarga = input.required<any[]>();
  totalDomiciliariosDisponibles = input<number>(0);
  totalDomiciliariosOcupados = input<number>(0);
}
