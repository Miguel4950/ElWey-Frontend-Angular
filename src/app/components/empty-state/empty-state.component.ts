import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.css']
})
export class EmptyStateComponent {
  titulo = input<string>('Sin elementos');
  mensaje = input<string>('No hay datos disponibles para mostrar en este momento.');
  icono = input<string>('🌮');
  botonTexto = input<string | null>(null);
  botonRuta = input<string | null>(null);

  accion = output<void>();

  onAccion(): void {
    this.accion.emit();
  }
}
