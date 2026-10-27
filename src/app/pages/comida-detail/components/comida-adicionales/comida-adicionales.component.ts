import { Component, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { AdicionalDTO } from '../../../../dtos/adicional.dto';
import { AdicionalCantidadDTO } from '../../../../dtos/crear-pedido.dto';

@Component({
  selector: 'app-comida-adicionales',
  imports: [DecimalPipe],
  templateUrl: './comida-adicionales.component.html',
  styleUrl: './comida-adicionales.component.css',
})
export class ComidaAdicionalesComponent {
  adicionales = input<AdicionalDTO[]>();
  categoriaNombre = input<string>();

  adicionalesChange = output<AdicionalCantidadDTO[]>();

  seleccionados: AdicionalCantidadDTO[] = [];

  actualizarCantidad(adicionalId: number | undefined, event: Event): void {
    if (!adicionalId) return;
    const input = event.target as HTMLInputElement;
    const cantidad = Number(input.value);

    const index = this.seleccionados.findIndex((a) => a.adicionalId === adicionalId);
    if (cantidad > 0) {
      if (index !== -1) {
        this.seleccionados[index].cantidad = cantidad;
      } else {
        this.seleccionados.push({
          adicionalId: adicionalId,
          cantidad: cantidad,
        });
      }
    } else if (index !== -1) {
      this.seleccionados.splice(index, 1);
    }

    this.adicionalesChange.emit(this.seleccionados);
  }
}
