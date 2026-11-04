import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ClienteService } from '../../service/cliente.service';
import { CarritoService } from '../../service/carrito.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private clienteService = inject(ClienteService);
  private carritoService = inject(CarritoService);
  private router = inject(Router);

  title: string = 'El Wey';

  // Reactividad en tiempo real mediante Signals convertidos desde observables de CarritoService
  readonly cantidadCarrito = toSignal(this.carritoService.cantidadTotal$, {
    initialValue: this.carritoService.getCantidadTotal(),
  });

  readonly totalCarrito = toSignal(this.carritoService.total$, {
    initialValue: this.carritoService.getTotal(),
  });

  get clienteActual() {
    return this.clienteService.getClienteActual();
  }

  get esOperador(): boolean {
    return this.clienteService.esOperador();
  }

  get esDomiciliario(): boolean {
    return this.clienteService.esDomiciliario();
  }

  get esAdmin(): boolean {
    return this.clienteService.esAdmin();
  }

  get rutaPerfil(): string {
    if (this.esOperador) return '/pedidos';
    if (this.esAdmin) return '/comidas/tabla';
    if (this.esDomiciliario) return '/domiciliario/pedidos';
    return '/cliente/portal';
  }

  get esPersonal(): boolean {
    return this.esAdmin || this.esOperador || this.esDomiciliario;
  }

  cerrarSesion(): void {
    this.clienteService.cerrarSesion();
    this.router.navigate(['/login'], { queryParams: { logout: 'true' } });
  }
}
