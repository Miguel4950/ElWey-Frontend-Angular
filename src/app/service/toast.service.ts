import { Injectable, signal } from '@angular/core';

export interface ToastMensaje {
  id: number;
  texto: string;
  tipo: 'success' | 'info' | 'warning';
  enlaceTexto?: string;
  enlaceRuta?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private contador = 0;
  readonly toastActivo = signal<ToastMensaje | null>(null);
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  mostrar(
    texto: string,
    tipo: 'success' | 'info' | 'warning' = 'success',
    enlaceTexto?: string,
    enlaceRuta?: string,
    duracionMs: number = 4000
  ): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    const nuevoToast: ToastMensaje = {
      id: ++this.contador,
      texto,
      tipo,
      enlaceTexto,
      enlaceRuta,
    };

    this.toastActivo.set(nuevoToast);

    this.timeoutId = setTimeout(() => {
      this.cerrar();
    }, duracionMs);
  }

  cerrar(): void {
    this.toastActivo.set(null);
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
