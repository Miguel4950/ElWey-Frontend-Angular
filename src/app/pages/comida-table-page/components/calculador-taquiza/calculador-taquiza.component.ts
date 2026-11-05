import { Component, input, output, signal, computed, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { ComidaDTO } from '../../../../dtos/comida.dto';
import { CarritoService } from '../../../../service/carrito.service';
import { ItemCarritoDTO } from '../../../../dtos/carrito.dto';

export interface ItemPaqueteTaquiza {
  comida: ComidaDTO;
  cantidad: number;
  subtotal: number;
}

@Component({
  selector: 'app-calculador-taquiza',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './calculador-taquiza.component.html',
  styleUrl: './calculador-taquiza.component.css',
})
export class CalculadorTaquizaComponent {
  mostrar = input<boolean>(false);
  comidas = input<ComidaDTO[]>([]);

  cerrar = output<void>();

  private carritoService = inject(CarritoService);
  private router = inject(Router);

  // Parámetros del evento
  comensales = signal<number>(6);
  apetito = signal<'ligero' | 'estandar' | 'wey'>('estandar');
  incluirBebidas = signal<boolean>(true);
  incluirEntradas = signal<boolean>(true);

  // Estado de éxito
  taquizaAgregada = signal<boolean>(false);

  // Cálculos matemáticos reactivos
  readonly tacosPorPersona = computed<number>(() => {
    switch (this.apetito()) {
      case 'ligero':
        return 2;
      case 'estandar':
        return 3;
      case 'wey':
        return 4;
    }
  });

  readonly totalTacos = computed<number>(() => {
    return this.comensales() * this.tacosPorPersona();
  });

  readonly totalBebidas = computed<number>(() => {
    return this.incluirBebidas() ? this.comensales() : 0;
  });

  readonly totalEntradas = computed<number>(() => {
    return this.incluirEntradas() ? Math.ceil(this.comensales() / 4) : 0;
  });

  // Distribución automática del surtido taquero
  readonly surtidoTaquiza = computed<ItemPaqueteTaquiza[]>(() => {
    const listaComidas = this.comidas();
    if (listaComidas.length === 0) return [];

    const resultado: ItemPaqueteTaquiza[] = [];

    // 1. Tacos disponibles
    const tacosDisponibles = listaComidas.filter(
      (c) =>
        (c.categoriaNombre || '').toLowerCase().includes('taco') ||
        c.nombre.toLowerCase().includes('taco')
    );

    const tacosPool =
      tacosDisponibles.length > 0 ? tacosDisponibles : listaComidas.slice(0, 3);
    const totalT = this.totalTacos();
    const cantVariedades = Math.min(3, tacosPool.length);
    const basePorVariedad = Math.floor(totalT / cantVariedades);
    let remanente = totalT % cantVariedades;

    for (let i = 0; i < cantVariedades; i++) {
      const cantidad = basePorVariedad + (remanente > 0 ? 1 : 0);
      if (remanente > 0) remanente--;
      if (cantidad > 0) {
        resultado.push({
          comida: tacosPool[i],
          cantidad,
          subtotal: tacosPool[i].precio * cantidad,
        });
      }
    }

    // 2. Bebidas
    if (this.incluirBebidas()) {
      const bebidas = listaComidas.filter((c) =>
        (c.categoriaNombre || '').toLowerCase().includes('bebida')
      );
      if (bebidas.length > 0) {
        const totalB = this.totalBebidas();
        const variedadB = Math.min(2, bebidas.length);
        const cantPorBebida = Math.floor(totalB / variedadB);
        let remB = totalB % variedadB;

        for (let j = 0; j < variedadB; j++) {
          const cantidad = cantPorBebida + (remB > 0 ? 1 : 0);
          if (remB > 0) remB--;
          if (cantidad > 0) {
            resultado.push({
              comida: bebidas[j],
              cantidad,
              subtotal: bebidas[j].precio * cantidad,
            });
          }
        }
      }
    }

    // 3. Entradas / Acompañamientos (Guacamole, Totopos)
    if (this.incluirEntradas()) {
      const entradas = listaComidas.filter(
        (c) =>
          (c.categoriaNombre || '').toLowerCase().includes('entrada') ||
          c.nombre.toLowerCase().includes('guacamole') ||
          c.nombre.toLowerCase().includes('totopo') ||
          c.nombre.toLowerCase().includes('nacho')
      );
      const entradaElegida = entradas.length > 0 ? entradas[0] : null;
      if (entradaElegida && this.totalEntradas() > 0) {
        resultado.push({
          comida: entradaElegida,
          cantidad: this.totalEntradas(),
          subtotal: entradaElegida.precio * this.totalEntradas(),
        });
      }
    }

    return resultado;
  });

  readonly precioRegular = computed<number>(() => {
    return this.surtidoTaquiza().reduce((acc, it) => acc + it.subtotal, 0);
  });

  readonly descuentoEvento = computed<number>(() => {
    return Math.round(this.precioRegular() * 0.1);
  });

  readonly precioFinal = computed<number>(() => {
    return Math.max(0, this.precioRegular() - this.descuentoEvento());
  });

  cambiarComensales(delta: number): void {
    const nuevo = Math.min(30, Math.max(2, this.comensales() + delta));
    this.comensales.set(nuevo);
  }

  setComensales(cantidad: number): void {
    this.comensales.set(Math.min(30, Math.max(2, cantidad)));
  }

  setApetito(nivel: 'ligero' | 'estandar' | 'wey'): void {
    this.apetito.set(nivel);
  }

  toggleBebidas(): void {
    this.incluirBebidas.update((v) => !v);
  }

  toggleEntradas(): void {
    this.incluirEntradas.update((v) => !v);
  }

  onCerrar(): void {
    this.taquizaAgregada.set(false);
    this.cerrar.emit();
  }

  agregarAlCarrito(): void {
    const paquete = this.surtidoTaquiza();
    if (paquete.length === 0) return;

    for (const item of paquete) {
      if (!item.comida.id) continue;
      const itemCarrito: ItemCarritoDTO = {
        id: `${item.comida.id}-taquiza-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 7)}`,
        comidaId: item.comida.id,
        comidaNombre: item.comida.nombre,
        comidaPrecio: item.comida.precio,
        categoriaNombre: item.comida.categoriaNombre,
        imagenUrl: item.comida.imagen_url,
        cantidad: item.cantidad,
        adicionales: [],
        subtotalComida: item.subtotal,
        subtotalAdicionales: 0,
        subtotal: item.subtotal,
      };
      this.carritoService.agregarItem(itemCarrito);
    }

    this.taquizaAgregada.set(true);
  }

  irAlCarrito(): void {
    this.onCerrar();
    this.router.navigate(['/carrito']);
  }
}
