import { Component, OnDestroy, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CalaverasComponent } from '../../components/calaveras/calaveras.component';
import { CarritoService } from '../../service/carrito.service';
import { PedidoService } from '../../service/pedido.service';
import { ClienteService } from '../../service/cliente.service';
import { ItemCarritoDTO } from '../../dtos/carrito.dto';
import { CrearPedidoDTO, PedidoDTO } from '../../dtos/pedido.dto';

@Component({
  selector: 'app-carrito-page',
  standalone: true,
  imports: [
    RouterLink,
    DecimalPipe,
    NavbarComponent,
    FooterComponent,
    CalaverasComponent,
  ],
  templateUrl: './carrito-page.component.html',
  styleUrl: './carrito-page.component.css',
})
export class CarritoPageComponent implements OnDestroy {
  private carritoService = inject(CarritoService);
  private pedidoService = inject(PedidoService);
  private clienteService = inject(ClienteService);
  private router = inject(Router);
  private subscription?: Subscription;

  cargando: boolean = false;
  pedidoExitoso: PedidoDTO | null = null;
  errorMessage: string = '';

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  get items(): ItemCarritoDTO[] {
    return this.carritoService.getItems();
  }

  get cantidadTotal(): number {
    return this.carritoService.getCantidadTotal();
  }

  get cantidadAdicionales(): number {
    return this.carritoService.getCantidadTotalAdicionales();
  }

  get subtotalComidas(): number {
    return this.carritoService.getSubtotalComidas();
  }

  get subtotalAdicionales(): number {
    return this.carritoService.getSubtotalAdicionales();
  }

  get total(): number {
    return this.carritoService.getTotal();
  }

  get clienteActual() {
    return this.clienteService.getClienteActual();
  }

  actualizarCantidad(id: string, delta: number): void {
    this.carritoService.actualizarCantidad(id, delta);
  }

  eliminarItem(id: string): void {
    this.carritoService.eliminarItem(id);
  }

  limpiarCarrito(): void {
    if (confirm('¿Deseas vaciar tu carrito de compras?')) {
      this.carritoService.limpiar();
    }
  }

  confirmarPedido(): void {
    if (this.items.length === 0) {
      this.errorMessage = 'El carrito está vacío.';
      return;
    }

    this.cargando = true;
    this.errorMessage = '';
    this.pedidoExitoso = null;

    const payload: CrearPedidoDTO = {
      clienteId: this.clienteActual?.id,
      items: this.items.map((it) => ({
        comidaId: it.comidaId,
        cantidad: it.cantidad,
        adicionales: it.adicionales.map((ad) => ({
          adicionalId: ad.adicionalId,
          // Se envía la cantidad total de adicionales para esa línea (ad.cantidad * it.cantidad)
          cantidad: ad.cantidad * it.cantidad,
        })),
      })),
    };

    this.subscription = this.pedidoService.crearPedido(payload).subscribe({
      next: (pedido) => {
        this.cargando = false;
        this.pedidoExitoso = pedido;
        this.carritoService.limpiar();
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error al confirmar pedido:', err);
        this.errorMessage =
          err?.error?.mensaje || 'No se pudo crear el pedido en la base de datos. Intenta nuevamente.';
      },
    });
  }
}
