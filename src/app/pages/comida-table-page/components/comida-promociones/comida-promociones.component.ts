import { Component, OnDestroy, OnInit, output, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';

export interface PromocionFlash {
  id: string;
  etiqueta: string;
  titulo: string;
  descripcion: string;
  precioAnterior: number;
  precioOferta: number;
  categoriaTarget: string;
  icono: string;
  badgeAhorro: string;
}

@Component({
  selector: 'app-comida-promociones',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './comida-promociones.component.html',
  styleUrl: './comida-promociones.component.css',
})
export class ComidaPromocionesComponent implements OnInit, OnDestroy {
  promocionSeleccionada = output<string>();

  readonly promociones: PromocionFlash[] = [
    {
      id: 'pastor-2x1',
      etiqueta: 'OFERTA FLASH 🔥',
      titulo: '2x1 en Órdenes de Tacos al Pastor Clásico',
      descripcion: 'Carne de cerdo marinada en achiote y naranja agria con piña asada, cilantro fresco y cebolla picada.',
      precioAnterior: 32000,
      precioOferta: 16000,
      categoriaTarget: 'Tacos',
      icono: '🌮',
      badgeAhorro: '50% OFF',
    },
    {
      id: 'combo-taquiza',
      etiqueta: 'COMBO FAMILIAR 👥',
      titulo: 'Taquiza Fiesta Wey (12 Tacos + Totopos + 1L Horchata)',
      descripcion: '4 Pastor + 4 Suadero + 4 Carnitas con totopos de la casa, salsas de cortesía y jarra de bebida artesanal.',
      precioAnterior: 64000,
      precioOferta: 48900,
      categoriaTarget: 'Para Compartir',
      icono: '🎉',
      badgeAhorro: 'Ahorras $15.100',
    },
    {
      id: 'quesadillas-guac',
      etiqueta: 'ESPECIAL DE LA CASA 🥑',
      titulo: 'Trío de Quesadillas Oaxaca + Guacamole Rústico',
      descripcion: 'Tortillas de maíz nixtamalizado al comal con queso Oaxaca derretido y porción de guacamole hass fresco.',
      precioAnterior: 36000,
      precioOferta: 26500,
      categoriaTarget: 'Quesadillas',
      icono: '🧀',
      badgeAhorro: 'Ahorras $9.500',
    },
  ];

  promoActivaIndex = signal<number>(0);
  tiempoRestante = signal<string>('03:42:15');
  private timerId?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.actualizarCountdown();
    this.timerId = setInterval(() => {
      this.actualizarCountdown();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  seleccionarTab(index: number): void {
    this.promoActivaIndex.set(index);
  }

  aplicarFiltroPromo(categoria: string): void {
    this.promocionSeleccionada.emit(categoria);
  }

  private actualizarCountdown(): void {
    const ahora = new Date();
    // Meta: medianoche de hoy
    const finDelDia = new Date();
    finDelDia.setHours(23, 59, 59, 999);

    const diferenciaMs = finDelDia.getTime() - ahora.getTime();
    if (diferenciaMs <= 0) {
      this.tiempoRestante.set('00:00:00');
      return;
    }

    const horas = Math.floor(diferenciaMs / (1000 * 60 * 60));
    const minutos = Math.floor((diferenciaMs % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferenciaMs % (1000 * 60)) / 1000);

    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    this.tiempoRestante.set(`${pad(horas)}h ${pad(minutos)}m ${pad(segundos)}s`);
  }
}
