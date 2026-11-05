import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ClienteService } from '../../service/cliente.service';
import { CarritoService } from '../../service/carrito.service';
import { ReferirModalComponent } from '../referir-modal/referir-modal.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, ReferirModalComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private clienteService = inject(ClienteService);
  private carritoService = inject(CarritoService);
  private router = inject(Router);

  title: string = 'El Wey';
  modalReferirVisible = signal<boolean>(false);

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

  abrirModalReferir(): void {
    this.modalReferirVisible.set(true);
  }

  cerrarModalReferir(): void {
    this.modalReferirVisible.set(false);
  }

  cerrarSesion(): void {
    this.clienteService.cerrarSesion();
    this.router.navigate(['/login'], { queryParams: { logout: 'true' } });
  }
}
