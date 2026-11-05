import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ClienteService } from '../../service/cliente.service';
import { CarritoService } from '../../service/carrito.service';
import { CoberturaModalComponent } from '../cobertura-modal/cobertura-modal.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CoberturaModalComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private clienteService = inject(ClienteService);
  private carritoService = inject(CarritoService);
  private router = inject(Router);

  title: string = 'El Wey';
  modalCoberturaVisible = signal<boolean>(false);

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

  abrirModalCobertura(): void {
    this.modalCoberturaVisible.set(true);
  }

  cerrarModalCobertura(): void {
    this.modalCoberturaVisible.set(false);
  }

  cerrarSesion(): void {
    this.clienteService.cerrarSesion();
    this.router.navigate(['/login'], { queryParams: { logout: 'true' } });
  }
}
