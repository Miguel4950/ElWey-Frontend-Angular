import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CalaverasComponent } from '../../components/calaveras/calaveras.component';
import { PedidosTableComponent } from './components/pedidos-table/pedidos-table.component';
import { PedidoDTO } from '../../dtos/pedido.dto';
import { PedidoService } from '../../service/pedido.service';
import { ClienteService } from '../../service/cliente.service';

@Component({
  selector: 'app-pedidos-page',
  imports: [
    RouterLink,
    NavbarComponent,
    FooterComponent,
    CalaverasComponent,
    PedidosTableComponent,
  ],
  templateUrl: './pedidos-page.component.html',
  styleUrl: './pedidos-page.component.css',
})
export class PedidosPageComponent implements OnInit, OnDestroy {
  private pedidoService = inject(PedidoService);
  private clienteService = inject(ClienteService);
  private subscription: Subscription = new Subscription();

  pedidosArray: PedidoDTO[] = [];
  errorMessage: string = '';

  get operarioActual() {
    return this.clienteService.getClienteActual();
  }

  ngOnInit(): void {
    this.cargarPedidos();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  cargarPedidos(): void {
    this.errorMessage = '';
    this.subscription.add(
      this.pedidoService.getPedidos().subscribe({
        next: (pedidos) => {
          this.pedidosArray = pedidos;
        },
        error: (err) => {
          console.error('Error al cargar los pedidos desde el backend:', err);
          this.errorMessage = 'No se pudieron cargar los pedidos del sistema.';
        },
      })
    );
  }
}
