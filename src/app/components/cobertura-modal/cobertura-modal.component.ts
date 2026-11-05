import { Component, input, output, signal, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';

export interface ZonaCobertura {
  id: string;
  nombre: string;
  tiempoMin: number;
  tiempoMax: number;
  tarifaEnvio: number;
  estado: 'Total' | 'Media';
  barrios: string;
}

/**
 * Modal interactivo que calcula tiempos de despacho y cobertura logística
 * para 10 localidades principales de Bogotá desde la sede Chapinero.
 * Standalone puro, Signals nativos de Angular 19.
 */
@Component({
  selector: 'app-cobertura-modal',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './cobertura-modal.component.html',
  styleUrl: './cobertura-modal.component.css',
})
export class CoberturaModalComponent {
  visible = input<boolean>(false);
  cerrar = output<void>();

  busqueda = signal<string>('');
  localidadSeleccionada = signal<ZonaCobertura | null>(null);

  readonly zonas: ZonaCobertura[] = [
    {
      id: 'chapinero',
      nombre: 'Chapinero (Sede Central)',
      tiempoMin: 15,
      tiempoMax: 25,
      tarifaEnvio: 4500,
      estado: 'Total',
      barrios: 'Rosales, Antiguo Country, Chapinero Alto, Chicó, El Nogal',
    },
    {
      id: 'teusaquillo',
      nombre: 'Teusaquillo',
      tiempoMin: 20,
      tiempoMax: 30,
      tarifaEnvio: 5000,
      estado: 'Total',
      barrios: 'Park Way, Galerías, La Soledad, Palermo, Santa Teresita',
    },
    {
      id: 'usaquen',
      nombre: 'Usaquén',
      tiempoMin: 25,
      tiempoMax: 35,
      tarifaEnvio: 6000,
      estado: 'Total',
      barrios: 'Santa Bárbara, Cedritos, Bella Suiza, San Patricio, Usaquén Central',
    },
    {
      id: 'barrios-unidos',
      nombre: 'Barrios Unidos',
      tiempoMin: 20,
      tiempoMax: 30,
      tarifaEnvio: 5000,
      estado: 'Total',
      barrios: 'Polo Club, 7 de Agosto, Los Alcázares, San Felipe',
    },
    {
      id: 'santa-fe',
      nombre: 'Santa Fe & La Candelaria',
      tiempoMin: 25,
      tiempoMax: 35,
      tarifaEnvio: 5500,
      estado: 'Total',
      barrios: 'Centro Internacional, Las Aguas, La Concordia, Bosque Izquierdo',
    },
    {
      id: 'fontibon',
      nombre: 'Fontibón / Salitre',
      tiempoMin: 30,
      tiempoMax: 40,
      tarifaEnvio: 6500,
      estado: 'Total',
      barrios: 'Ciudad Salitre Occidental, Modelia, Hayuelos, Capellanía',
    },
    {
      id: 'suba',
      nombre: 'Suba (Zona Oriental)',
      tiempoMin: 35,
      tiempoMax: 45,
      tarifaEnvio: 7000,
      estado: 'Media',
      barrios: 'Niza, Colina Campestre, Pontevedra, Mazurén',
    },
    {
      id: 'engativa',
      nombre: 'Engativá',
      tiempoMin: 35,
      tiempoMax: 45,
      tarifaEnvio: 7500,
      estado: 'Media',
      barrios: 'Normandía, Santa Cecilia, Álamos, Boyacá Real',
    },
    {
      id: 'puente-aranda',
      nombre: 'Puente Aranda',
      tiempoMin: 35,
      tiempoMax: 45,
      tarifaEnvio: 7000,
      estado: 'Media',
      barrios: 'Ciudad Montes, Salazar Gómez, La Alquería, Pradera',
    },
    {
      id: 'kennedy',
      nombre: 'Kennedy',
      tiempoMin: 40,
      tiempoMax: 50,
      tarifaEnvio: 8000,
      estado: 'Media',
      barrios: 'Castilla, Marsella, Américas Occidental, Mandalay',
    },
  ];

  zonasFiltradas = computed(() => {
    const q = this.busqueda().trim().toLowerCase();
    if (!q) return this.zonas;
    return this.zonas.filter(
      (z) => z.nombre.toLowerCase().includes(q) || z.barrios.toLowerCase().includes(q)
    );
  });

  // Ventana estimada de entrega calculada con la hora actual
  ventanaEntregaEstimada = computed(() => {
    const loc = this.localidadSeleccionada();
    if (!loc) return null;
    const ahora = new Date();
    const minTime = new Date(ahora.getTime() + loc.tiempoMin * 60000);
    const maxTime = new Date(ahora.getTime() + loc.tiempoMax * 60000);

    const f = (d: Date) =>
      `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

    return `${f(minTime)} – ${f(maxTime)}`;
  });

  onBusquedaInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.busqueda.set(target.value);
  }

  seleccionarZona(zona: ZonaCobertura): void {
    this.localidadSeleccionada.set(zona);
  }

  onCerrar(): void {
    this.cerrar.emit();
  }
}
