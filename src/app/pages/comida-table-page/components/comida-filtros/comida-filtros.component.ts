import { Component, input, output } from '@angular/core';
import { ComidaDTO } from '../../../../dtos/comida.dto';

@Component({
  selector: 'app-comida-filtros',
  imports: [],
  templateUrl: './comida-filtros.component.html',
  styleUrl: './comida-filtros.component.css',
})
export class ComidaFiltrosComponent {
  filtroCategoria = input<string>('');
  busqueda = input<string>('');
  comidaArray = input.required<ComidaDTO[]>();
  totalFiltradas = input<number>(0);

  categoriaSelected = output<string>();
  busquedaChanged = output<string>();

  seleccionar(cat: string): void {
    this.categoriaSelected.emit(cat);
  }

  onBuscarInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    this.busquedaChanged.emit(inputEl.value);
  }

  limpiarBusqueda(): void {
    this.busquedaChanged.emit('');
  }

  limpiarTodosLosFiltros(): void {
    this.categoriaSelected.emit('');
    this.busquedaChanged.emit('');
  }

  contarPorCategoria(categoria: string): number {
    const catNorm = categoria.toLowerCase().trim();
    return this.comidaArray().filter(
      (c) => (c.categoriaNombre || '').toLowerCase().trim() === catNorm
    ).length;
  }

  contarPorEtiqueta(etiqueta: string): number {
    const tagNorm = etiqueta.toLowerCase().trim();
    return this.comidaArray().filter((c) =>
      (c.etiqueta || '').toLowerCase().includes(tagNorm)
    ).length;
  }
}
