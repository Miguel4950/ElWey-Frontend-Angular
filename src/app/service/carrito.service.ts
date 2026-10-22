import { Injectable } from '@angular/core';
import { ItemCarritoDTO } from '../dtos/carrito.dto';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private items: ItemCarritoDTO[] = [];

  constructor() {
    this.cargarDesdeStorage();
  }

  getItems(): ItemCarritoDTO[] {
    return this.items;
  }

  agregarItem(item: ItemCarritoDTO): void {
    // Si ya existe el mismo plato con exactamente los mismos adicionales, sumamos la cantidad
    const index = this.items.findIndex((it) => this.sonIguales(it, item));
    if (index !== -1) {
      this.items[index].cantidad += item.cantidad;
      this.recalcularItem(this.items[index]);
    } else {
      this.items.push(item);
    }
    this.guardarEnStorage();
  }

  eliminarItem(id: string): void {
    this.items = this.items.filter((it) => it.id !== id);
    this.guardarEnStorage();
  }

  actualizarCantidad(id: string, delta: number): void {
    const item = this.items.find((it) => it.id === id);
    if (!item) return;

    item.cantidad += delta;
    if (item.cantidad <= 0) {
      this.eliminarItem(id);
    } else {
      this.recalcularItem(item);
      this.guardarEnStorage();
    }
  }

  limpiar(): void {
    this.items = [];
    this.guardarEnStorage();
  }

  getCantidadTotal(): number {
    return this.items.reduce((acc, it) => acc + it.cantidad, 0);
  }

  getCantidadTotalAdicionales(): number {
    return this.items.reduce((acc, it) => {
      const sumAdics = it.adicionales.reduce((sub, a) => sub + a.cantidad, 0);
      return acc + sumAdics;
    }, 0);
  }

  getSubtotalComidas(): number {
    return this.items.reduce((acc, it) => acc + it.subtotalComida, 0);
  }

  getSubtotalAdicionales(): number {
    return this.items.reduce((acc, it) => acc + it.subtotalAdicionales, 0);
  }

  getTotal(): number {
    return this.items.reduce((acc, it) => acc + it.subtotal, 0);
  }

  private recalcularItem(item: ItemCarritoDTO): void {
    item.subtotalComida = item.comidaPrecio * item.cantidad;
    item.subtotalAdicionales = item.adicionales.reduce(
      (sub, adic) => sub + adic.precio * adic.cantidad,
      0
    );
    item.subtotal = item.subtotalComida + item.subtotalAdicionales;
  }

  private sonIguales(a: ItemCarritoDTO, b: ItemCarritoDTO): boolean {
    if (a.comidaId !== b.comidaId) return false;
    if (a.adicionales.length !== b.adicionales.length) return false;

    // Verificar si todos los adicionales y cantidades coinciden
    for (const adicA of a.adicionales) {
      const adicB = b.adicionales.find((ad) => ad.adicionalId === adicA.adicionalId);
      if (!adicB || adicB.cantidad !== adicA.cantidad) {
        return false;
      }
    }
    return true;
  }

  private guardarEnStorage(): void {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.setItem('elwey_carrito', JSON.stringify(this.items));
      }
    } catch {
      // Ignorar si sessionStorage no está disponible
    }
  }

  private cargarDesdeStorage(): void {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const raw = sessionStorage.getItem('elwey_carrito');
        if (raw) {
          this.items = JSON.parse(raw);
        }
      }
    } catch {
      this.items = [];
    }
  }
}
