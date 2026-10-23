import { Component, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { AdicionalDTO } from '../../../../dtos/adicional.dto';

/**
 * Componente hijo para visualizar la tabla de adicionales.
 * Utiliza signals input() y output() de Angular 19.
 */
@Component({
  selector: 'app-adicional-table',
  imports: [DecimalPipe],
  templateUrl: './adicional-table.component.html',
  styleUrl: './adicional-table.component.css',
})
export class AdicionalTableComponent {
  adicionalesArray = input<AdicionalDTO[]>();

  onEdit = output<AdicionalDTO>();
  onDelete = output<number>();

  editar(adicional: AdicionalDTO): void {
    this.onEdit.emit(adicional);
  }

  eliminar(id?: number): void {
    if (id !== undefined) {
      this.onDelete.emit(id);
    }
  }
}
