import { Component, computed, inject, input, output, signal } from '@angular/core';
import { ComidaDTO } from '../../../../dtos/comida.dto';
import { Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-comida-table',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './comida-table.component.html',
  styleUrl: './comida-table.component.css',
})
export class ComidaTableComponent {
  router = inject(Router);

  ancho: number = 60;
  alto: number = 60;

  // Signal Inputs
  comidaArray = input<ComidaDTO[]>();
  esAdmin = input<boolean>(false);

  comidaDeleted = output<ComidaDTO>();

  // Filtro reactivo en vivo para la tabla de inventario
  filtroTabla = signal<string>('');

  comidasVisibles = computed(() => {
    const lista = this.comidaArray() || [];
    const q = this.filtroTabla().toLowerCase().trim();
    if (!q) return lista;
    return lista.filter(
      (c) =>
        c.nombre.toLowerCase().includes(q) ||
        (c.categoriaNombre && c.categoriaNombre.toLowerCase().includes(q)) ||
        (c.etiqueta && c.etiqueta.toLowerCase().includes(q)) ||
        (c.id && c.id.toString().includes(q))
    );
  });

  onFiltroInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    this.filtroTabla.set(inputEl.value);
  }

  limpiarFiltro(): void {
    this.filtroTabla.set('');
  }

  verDetalleComida(comida: ComidaDTO): void {
    this.router.navigate(['/comidas', comida.id]);
  }

  eliminarComida(comida: ComidaDTO): void {
    if (confirm(`¿Estás seguro de eliminar "${comida.nombre}"?`)) {
      this.comidaDeleted.emit(comida);
    }
  }
}
