import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Modal de confirmación estilizado temático con la estética de "El Wey".
 * Reemplaza los alerts y confirms nativos del navegador por un diálogo reactivo con Signals.
 */
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css'],
})
export class ConfirmDialogComponent {
  visible = input<boolean>(false);
  titulo = input<string>('¿Estás seguro?');
  mensaje = input<string>('Esta acción no se puede deshacer.');
  icono = input<string>('⚠️');
  textoConfirmar = input<string>('Confirmar');
  textoCancelar = input<string>('Cancelar');

  onConfirmar = output<void>();
  onCancelar = output<void>();

  confirmar(): void {
    this.onConfirmar.emit();
  }

  cancelar(): void {
    this.onCancelar.emit();
  }
}
