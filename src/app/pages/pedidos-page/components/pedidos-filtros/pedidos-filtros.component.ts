import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pedidos-filtros',
  imports: [FormsModule],
  templateUrl: './pedidos-filtros.component.html',
  styleUrl: './pedidos-filtros.component.css',
})
export class PedidosFiltrosComponent {
  pestanaEstado = input<'TODOS' | 'ACTIVOS' | 'ENTREGADOS'>('TODOS');
  filtroComida = input<string>('');
  fechaDesde = input<string>('');
  fechaHasta = input<string>('');
  conteoTodos = input<number>(0);
  conteoActivos = input<number>(0);
  conteoEntregados = input<number>(0);
  hayFiltrosActivos = input<boolean>(false);

  pestanaChanged = output<'TODOS' | 'ACTIVOS' | 'ENTREGADOS'>();
  filtroComidaChanged = output<string>();
  fechaDesdeChanged = output<string>();
  fechaHastaChanged = output<string>();
  limpiarFiltrosClicked = output<void>();

  cambiarPestana(p: 'TODOS' | 'ACTIVOS' | 'ENTREGADOS'): void {
    this.pestanaChanged.emit(p);
  }

  onComidaInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.filtroComidaChanged.emit(target.value);
  }

  onFechaDesdeInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.fechaDesdeChanged.emit(target.value);
  }

  onFechaHastaInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.fechaHastaChanged.emit(target.value);
  }

  limpiar(): void {
    this.limpiarFiltrosClicked.emit();
  }
}
