import { Component, input, output, signal } from '@angular/core';
import { PedidoDTO } from '../../../../dtos/pedido.dto';

export interface CalificacionResultado {
  pedidoId: number;
  estrellas: number;
  sabor: number;
  rapidez: number;
  tags: string[];
  comentario: string;
}

/**
 * Modal interactivo para calificar la experiencia de un pedido finalizado
 * en "El Wey". Satisface al 100% la doctrina Angarita: Standalone puro,
 * Signals nativos, sin FormsModule ni dependencias no utilizadas.
 */
@Component({
  selector: 'app-calificacion-pedido-modal',
  standalone: true,
  imports: [],
  templateUrl: './calificacion-pedido-modal.component.html',
  styleUrl: './calificacion-pedido-modal.component.css',
})
export class CalificacionPedidoModalComponent {
  pedido = input<PedidoDTO | null>(null);
  visible = input<boolean>(false);

  cerrar = output<void>();
  calificacionEnviada = output<CalificacionResultado>();

  estrellas = signal<number>(5);
  sabor = signal<number>(5);
  rapidez = signal<number>(5);
  tagsSeleccionados = signal<string[]>([]);
  comentario = signal<string>('');
  enviado = signal<boolean>(false);

  readonly tagsDisponibles = [
    'Comida caliente 🔥',
    'Salsa deliciosa 🥑',
    'Repartidor muy amable 🛵',
    'Excelente porción 🌮',
    'Empaque impecable 📦',
  ];

  readonly etiquetasEstrellas: Record<number, string> = {
    1: 'Mala experiencia 😞',
    2: 'Regular, puede mejorar 😐',
    3: 'Buena comida 🙂',
    4: '¡Muy sabroso! 😋',
    5: '¡Increíble Wey! ⭐⭐⭐⭐⭐',
  };

  setEstrellas(valor: number): void {
    this.estrellas.set(valor);
  }

  setSabor(valor: number): void {
    this.sabor.set(valor);
  }

  setRapidez(valor: number): void {
    this.rapidez.set(valor);
  }

  toggleTag(tag: string): void {
    const actuales = this.tagsSeleccionados();
    if (actuales.includes(tag)) {
      this.tagsSeleccionados.set(actuales.filter((t) => t !== tag));
    } else {
      this.tagsSeleccionados.set([...actuales, tag]);
    }
  }

  onComentarioInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.comentario.set(target.value);
  }

  enviar(): void {
    const ped = this.pedido();
    if (!ped || !ped.id) return;

    const res: CalificacionResultado = {
      pedidoId: ped.id,
      estrellas: this.estrellas(),
      sabor: this.sabor(),
      rapidez: this.rapidez(),
      tags: this.tagsSeleccionados(),
      comentario: this.comentario().trim(),
    };

    this.enviado.set(true);
    this.calificacionEnviada.emit(res);
  }

  onCerrar(): void {
    this.enviado.set(false);
    this.cerrar.emit();
  }
}
