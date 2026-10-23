import { Component, input, output } from '@angular/core';
import { OperadorDTO } from '../../../../dtos/operador.dto';

/**
 * Componente hijo para visualizar la tabla de operadores de cocina y despacho.
 * Utiliza signals input() y output() de Angular 19.
 */
@Component({
  selector: 'app-operador-table',
  imports: [],
  templateUrl: './operador-table.component.html',
  styleUrl: './operador-table.component.css',
})
export class OperadorTableComponent {
  operadoresArray = input<OperadorDTO[]>();

  onEdit = output<OperadorDTO>();
  onDelete = output<number>();

  editar(operador: OperadorDTO): void {
    this.onEdit.emit(operador);
  }

  eliminar(id?: number): void {
    if (id !== undefined) {
      this.onDelete.emit(id);
    }
  }
}
