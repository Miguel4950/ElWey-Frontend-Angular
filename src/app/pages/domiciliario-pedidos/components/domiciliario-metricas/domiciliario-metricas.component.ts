import { Component, input } from '@angular/core';

@Component({
  selector: 'app-domiciliario-metricas',
  standalone: true,
  templateUrl: './domiciliario-metricas.component.html',
  styleUrl: './domiciliario-metricas.component.css',
})
export class DomiciliarioMetricasComponent {
  enRutaCount = input<number>(0);
  enColaCount = input<number>(0);
  entregadosCount = input<number>(0);
}
