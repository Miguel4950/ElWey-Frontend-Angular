import { Component, OnInit, OnDestroy, inject } from '@angular/core';
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
import { CrearPedidoDTO } from '../../dtos/crear-pedido.dto';
import { PedidoDTO } from '../../dtos/pedido.dto';
import { CarritoItemsComponent } from './components/carrito-items/carrito-items.component';
import { CarritoResumenComponent } from './components/carrito-resumen/carrito-resumen.component';

/**
 * Página principal del Carrito de Compras en "El Wey".
 * Dividida en subcomponentes visuales reutilizables:
 * - CarritoItemsComponent: Lista de platos, adicionales, modificadores de cantidad y eliminación.
 * - CarritoResumenComponent: Resumen de totales, desglose financiero y botón de checkout.
 */
@Component({
  selector: 'app-carrito-page',
  standalone: true,
  imports: [
    RouterLink,
    DecimalPipe,
    NavbarComponent,
    FooterComponent,
    CalaverasComponent,
    CarritoItemsComponent,
    CarritoResumenComponent,
  ],
  templateUrl: './carrito-page.component.html',
  styleUrl: './carrito-page.component.css',
})
export class CarritoPageComponent implements OnInit, OnDestroy {
  get esAdmin(): boolean {
    return this.clienteService.esAdmin();
  }

  get esPersonal(): boolean {
    return this.clienteService.esAdmin() || this.clienteService.esOperador() || this.clienteService.esDomiciliario();
  }

  ngOnInit(): void {
    if (this.esPersonal) {
      if (this.clienteService.esAdmin()) {
        this.router.navigate(['/comidas']);
      } else {
        this.router.navigate(['/pedidos']);
      }
    }
  }
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

  onModificarCantidad(event: { id: string; delta: number }): void {
    this.carritoService.actualizarCantidad(event.id, event.delta);
  }

  onEliminarItem(id: string): void {
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

    const clienteId = this.clienteActual?.id;
    if (clienteId == null) {
      this.errorMessage = 'Debes iniciar sesión para confirmar tu pedido.';
      return;
    }

    this.cargando = true;
    this.errorMessage = '';
    this.pedidoExitoso = null;

    const payload: CrearPedidoDTO = {
      clienteId,
      items: this.items.map((it) => ({
        comidaId: it.comidaId,
        cantidad: it.cantidad,
        adicionales: it.adicionales.map((ad) => ({
          adicionalId: ad.adicionalId,
          cantidad: ad.cantidad,
        })),
      })),
    };

    this.subscription = this.pedidoService.crearPedido(payload).subscribe({
      next: (pedidoCreado: PedidoDTO) => {
        this.cargando = false;
        this.pedidoExitoso = pedidoCreado;
        this.carritoService.limpiar();
      },
      error: (err: any) => {
        this.cargando = false;
        console.error('Error al registrar pedido en backend:', err);
        this.errorMessage =
          err?.error?.mensaje || 'Ocurrió un error al procesar tu pedido. Por favor, intenta de nuevo.';
      },
    });
  }
}
