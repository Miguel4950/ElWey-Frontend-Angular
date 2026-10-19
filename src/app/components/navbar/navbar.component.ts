import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ClienteService } from '../../service/cliente.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private clienteService = inject(ClienteService);
  private router = inject(Router);

  title: string = 'El Wey';

  get clienteActual() {
    return this.clienteService.getClienteActual();
  }

  get esOperador(): boolean {
    return this.clienteService.esOperador();
  }

  cerrarSesion(): void {
    this.clienteService.cerrarSesion();
    this.router.navigate(['/login'], { queryParams: { logout: 'true' } });
  }
}
