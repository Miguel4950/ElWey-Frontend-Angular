import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-domiciliario-pestanas',
  imports: [],
  templateUrl: './domiciliario-pestanas.component.html',
  styleUrl: './domiciliario-pestanas.component.css',
})
export class DomiciliarioPestanasComponent {
  pestanaActiva = input.required<'EN_RUTA' | 'EN_COLA' | 'ENTREGADOS' | 'TODOS'>();
  enRutaCount = input<number>(0);
  enColaCount = input<number>(0);
  entregadosCount = input<number>(0);
  totalCount = input<number>(0);

  pestanaChanged = output<'EN_RUTA' | 'EN_COLA' | 'ENTREGADOS' | 'TODOS'>();
  recargarClicked = output<void>();

  cambiarPestana(p: 'EN_RUTA' | 'EN_COLA' | 'ENTREGADOS' | 'TODOS'): void {
    this.pestanaChanged.emit(p);
  }

  recargar(): void {
    this.recargarClicked.emit();
  }
}
