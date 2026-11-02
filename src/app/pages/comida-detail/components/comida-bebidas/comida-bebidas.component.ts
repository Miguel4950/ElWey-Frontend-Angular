import { Component, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ComidaDTO } from '../../../../dtos/comida.dto';
import { BebidaSeleccionadaItem } from '../../../../dtos/bebida-seleccion.dto';

/**
 * Subcomponente Lego para la selección de múltiples bebidas frías y cantidades
 * en el detalle de platos de comida ("El Wey").
 * Diseñado bajo la doctrina de Angular 19 con Signals (input, output).
 */
@Component({
  selector: 'app-comida-bebidas',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './comida-bebidas.component.html',
  styleUrl: './comida-bebidas.component.css',
})
export class ComidaBebidasComponent {
  // Lista de bebidas disponibles recibida del padre
  bebidas = input<ComidaDTO[]>([]);

  // Emite la lista de bebidas seleccionadas con sus cantidades actualizadas
  bebidasChange = output<BebidaSeleccionadaItem[]>();

  // Estado interno reactivo de selección
  seleccionadas: BebidaSeleccionadaItem[] = [];

  getCantidad(bebidaId: number | undefined): number {
    if (!bebidaId) return 0;
    const item = this.seleccionadas.find((s) => s.bebida.id === bebidaId);
    return item ? item.cantidad : 0;
  }

  isSeleccionada(bebidaId: number | undefined): boolean {
    return this.getCantidad(bebidaId) > 0;
  }

  seleccionarOIncrementar(bebida: ComidaDTO, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (!bebida.id) return;

    const index = this.seleccionadas.findIndex((s) => s.bebida.id === bebida.id);
    if (index !== -1) {
      this.seleccionadas[index].cantidad++;
    } else {
      this.seleccionadas.push({
        bebida,
        cantidad: 1,
      });
    }
    this.emitirCambio();
  }

  decrementar(bebidaId: number | undefined, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (!bebidaId) return;

    const index = this.seleccionadas.findIndex((s) => s.bebida.id === bebidaId);
    if (index !== -1) {
      this.seleccionadas[index].cantidad--;
      if (this.seleccionadas[index].cantidad <= 0) {
        this.seleccionadas.splice(index, 1);
      }
      this.emitirCambio();
    }
  }

  quitar(bebidaId: number | undefined, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (!bebidaId) return;

    const index = this.seleccionadas.findIndex((s) => s.bebida.id === bebidaId);
    if (index !== -1) {
      this.seleccionadas.splice(index, 1);
      this.emitirCambio();
    }
  }

  limpiar(): void {
    this.seleccionadas = [];
    this.emitirCambio();
  }

  get totalBebidas(): number {
    return this.seleccionadas.reduce(
      (sum, item) => sum + (item.bebida.precio || 0) * item.cantidad,
      0
    );
  }

  get cantidadTotal(): number {
    return this.seleccionadas.reduce((sum, item) => sum + item.cantidad, 0);
  }

  private emitirCambio(): void {
    this.bebidasChange.emit([...this.seleccionadas]);
  }
}
