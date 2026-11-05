import { Component, input, output, signal, OnInit } from '@angular/core';

export interface OpcionTortilla {
  id: string;
  nombre: string;
  icono: string;
  descripcion: string;
  etiqueta: string;
  esGlutenFree: boolean;
}

/**
 * Componente interactivo para seleccionar la base de masa o tortilla del plato.
 * Permite al comensale personalizar tacos, quesadillas y platillos mexicanos con
 * masas artesanales nixtamalizadas (maíz amarillo, maíz azul, trigo o lechuga).
 * Standalone puro, Signals de Angular 19 y control flow nativo (@for / @if).
 */
@Component({
  selector: 'app-comida-tortilla-selector',
  standalone: true,
  imports: [],
  templateUrl: './comida-tortilla-selector.component.html',
  styleUrl: './comida-tortilla-selector.component.css',
})
export class ComidaTortillaSelectorComponent implements OnInit {
  valorInicial = input<string>('Maíz Amarillo Nixtamalizado');
  cambioTortilla = output<string>();

  opcionSeleccionada = signal<string>('Maíz Amarillo Nixtamalizado');

  readonly opcionesTortilla: OpcionTortilla[] = [
    {
      id: 'maiz-amarillo',
      nombre: 'Maíz Amarillo Nixtamalizado',
      icono: '🌽',
      descripcion: 'Receta tradicional nixtamalizada con cal viva. Textura suave y resistente.',
      etiqueta: 'Clásica',
      esGlutenFree: true,
    },
    {
      id: 'maiz-azul',
      nombre: 'Maíz Azul Criollo',
      icono: '🫐',
      descripcion: 'Grano ancestral traído de Oaxaca con notas tostadas y aroma terroso.',
      etiqueta: 'Ancestral',
      esGlutenFree: true,
    },
    {
      id: 'harina-trigo',
      nombre: 'Harina de Trigo Suave',
      icono: '🌾',
      descripcion: 'Estilo sonorense norteño, amasada a mano y dorada al comal.',
      etiqueta: 'Norteña',
      esGlutenFree: false,
    },
    {
      id: 'hoja-lechuga',
      nombre: 'Hoja de Lechuga Fresca',
      icono: '🥬',
      descripcion: 'Opción crujiente y fresca para amantes de la alimentación Keto y Low Carb.',
      etiqueta: 'Keto / Fit',
      esGlutenFree: true,
    },
  ];

  ngOnInit(): void {
    if (this.valorInicial()) {
      this.opcionSeleccionada.set(this.valorInicial());
    }
  }

  seleccionarOpcion(opcion: OpcionTortilla): void {
    this.opcionSeleccionada.set(opcion.nombre);
    this.cambioTortilla.emit(opcion.nombre);
  }
}
