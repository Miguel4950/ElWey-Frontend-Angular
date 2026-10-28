import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ClienteService } from '../../service/cliente.service';
import { CarritoService } from '../../service/carrito.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private clienteService = inject(ClienteService);
  private carritoService = inject(CarritoService);
  private router = inject(Router);

  title: string = 'El Wey';

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

  get cantidadCarrito(): number {
    return this.carritoService.getCantidadTotal();
  }

  cerrarSesion(): void {
    this.clienteService.cerrarSesion();
    this.router.navigate(['/login'], { queryParams: { logout: 'true' } });
  }
}
