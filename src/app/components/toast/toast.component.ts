import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../service/toast.service';

@Component({
  selector: 'app-toast',
  imports: [RouterLink],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent {
  private toastService = inject(ToastService);

  readonly toast = this.toastService.toastActivo;

  cerrar(): void {
    this.toastService.cerrar();
  }
}
