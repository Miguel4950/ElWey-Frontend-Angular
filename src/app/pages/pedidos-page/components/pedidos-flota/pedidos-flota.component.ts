import { Component, input } from '@angular/core';

@Component({
  selector: 'app-pedidos-flota',
  imports: [],
  templateUrl: './pedidos-flota.component.html',
  styleUrl: './pedidos-flota.component.css',
})
export class PedidosFlotaComponent {
  flotaConCarga = input.required<any[]>();
  totalDomiciliariosTrabajando = input<number>(0);
  totalDomiciliariosLibres = input<number>(0);
  totalDomiciliariosDescanso = input<number>(0);
}
