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

  categoriaSelected = output<string>();
  busquedaChanged = output<string>();

  seleccionar(cat: string): void {
    this.categoriaSelected.emit(cat);
  }

  onBuscarInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    this.busquedaChanged.emit(inputEl.value);
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
