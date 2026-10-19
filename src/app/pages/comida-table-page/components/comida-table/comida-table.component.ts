import { Component, inject, input, output } from '@angular/core';
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
  // Inyección de dependencias funcional como en el código del profesor
  router = inject(Router);

  ancho: number = 60;
  alto: number = 60;

  // Signal Inputs
  comidaArray = input<ComidaDTO[]>();

  comidaDeleted = output<ComidaDTO>();

  verDetalleComida(comida: ComidaDTO): void {
    this.router.navigate(['/comidas', comida.id]);
  }

  eliminarComida(comida: ComidaDTO): void {
    if (confirm(`¿Estás seguro de eliminar "${comida.nombre}"?`)) {
      this.comidaDeleted.emit(comida);
    }
  }
}
