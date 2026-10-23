import { Component, input, output } from '@angular/core';
import { DomiciliarioDTO } from '../../../../dtos/domiciliario.dto';

/**
 * Componente hijo para visualizar y gestionar la lista de domiciliarios en una tabla.
 * Utiliza signals input() y output() de Angular 19.
 */
@Component({
  selector: 'app-domiciliario-table',
  imports: [],
  templateUrl: './domiciliario-table.component.html',
  styleUrl: './domiciliario-table.component.css',
})
export class DomiciliarioTableComponent {
  domiciliariosArray = input<DomiciliarioDTO[]>();

  onEdit = output<DomiciliarioDTO>();
  onToggleDisponibilidad = output<DomiciliarioDTO>();
  onDelete = output<number>();

  editar(domiciliario: DomiciliarioDTO): void {
    this.onEdit.emit(domiciliario);
  }

  toggle(domiciliario: DomiciliarioDTO): void {
    this.onToggleDisponibilidad.emit(domiciliario);
  }

  eliminar(id?: number): void {
    if (id !== undefined) {
      this.onDelete.emit(id);
    }
  }
}
