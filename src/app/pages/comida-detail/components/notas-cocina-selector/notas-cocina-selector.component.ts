import { Component, output, signal } from '@angular/core';

export interface PreferenciaCocina {
  nivel: number;
  etiqueta: string;
  icono: string;
  notas: string;
}

interface NivelPicante {
  id: number;
  etiqueta: string;
  icono: string;
  desc: string;
  claseColor: string;
}

/**
 * Componente interactivo para personalizar el nivel de picante ("Termómetro Taquero")
 * e instrucciones especiales de preparación para la cocina en "El Wey".
 * Cumple con la doctrina Angarita: Standalone puro, Signals nativos sin FormsModule.
 */
@Component({
  selector: 'app-notas-cocina-selector',
  standalone: true,
  imports: [],
  templateUrl: './notas-cocina-selector.component.html',
  styleUrl: './notas-cocina-selector.component.css',
})
export class NotasCocinaSelectorComponent {
  preferenciasCambiadas = output<PreferenciaCocina>();

  nivelSeleccionado = signal<number>(2); // Default: Medio Taquero
  notasEspeciales = signal<string>('');

  readonly nivelesPicante: NivelPicante[] = [
    { id: 0, etiqueta: 'Sin Picante', icono: '🍃', desc: 'Cero chile, ideal para niños', claseColor: 'nivel-0' },
    { id: 1, etiqueta: 'Suave', icono: '🌶️', desc: 'Toque ligero de jalapeño fresco', claseColor: 'nivel-1' },
    { id: 2, etiqueta: 'Medio Taquero', icono: '🌶️🌶️', desc: 'Salsa tradicional (Recomendado)', claseColor: 'nivel-2' },
    { id: 3, etiqueta: 'Bravo Habanero', icono: '🌶️🌶️🌶️', desc: 'Picante intenso y tatemado', claseColor: 'nivel-3' },
    { id: 4, etiqueta: '¡Fuego Wey!', icono: '🔥💀', desc: 'Solo para valientes de verdad', claseColor: 'nivel-4' },
  ];

  readonly sugerenciasRapidas = [
    'Salsas aparte',
    'Sin cebolla',
    'Cilantro extra',
    'Tortilla bien dorada',
  ];

  seleccionarNivel(id: number): void {
    this.nivelSeleccionado.set(id);
    this.emitirCambios();
  }

  onNotasInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.notasEspeciales.set(target.value);
    this.emitirCambios();
  }

  agregarSugerencia(sug: string): void {
    const actual = this.notasEspeciales().trim();
    if (actual.includes(sug)) return;
    const nuevo = actual ? `${actual}, ${sug}` : sug;
    this.notasEspeciales.set(nuevo);
    this.emitirCambios();
  }

  private emitirCambios(): void {
    const actualNivel = this.nivelesPicante.find((n) => n.id === this.nivelSeleccionado()) || this.nivelesPicante[2];
    this.preferenciasCambiadas.emit({
      nivel: actualNivel.id,
      etiqueta: actualNivel.etiqueta,
      icono: actualNivel.icono,
      notas: this.notasEspeciales().trim(),
    });
  }
}
