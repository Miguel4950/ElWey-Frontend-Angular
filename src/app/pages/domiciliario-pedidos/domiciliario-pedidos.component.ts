import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CalaverasComponent } from '../../components/calaveras/calaveras.component';
import { DomiciliarioMetricasComponent } from './components/domiciliario-metricas/domiciliario-metricas.component';
import { DomiciliarioPedidoCardComponent } from './components/domiciliario-pedido-card/domiciliario-pedido-card.component';
import { Pedido } from '../../models/pedido.model';
import { PedidoService } from '../../service/pedido.service';
import { ClienteService } from '../../service/cliente.service';

@Component({
  selector: 'app-domiciliario-pedidos',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    CalaverasComponent,
    DomiciliarioMetricasComponent,
    DomiciliarioPedidoCardComponent,
  ],
  templateUrl: './domiciliario-pedidos.component.html',
  styleUrl: './domiciliario-pedidos.component.css',
})
export class DomiciliarioPedidosComponent implements OnInit, OnDestroy {
  private pedidoService = inject(PedidoService);
  private clienteService = inject(ClienteService);
  private router = inject(Router);
  private subscription: Subscription = new Subscription();

  pedidosArray: Pedido[] = [];
  cargando: boolean = true;
  mensajeExito: string = '';
  errorMessage: string = '';

  pestanaActiva: 'EN_RUTA' | 'EN_COLA' | 'ENTREGADOS' | 'TODOS' = 'EN_RUTA';

  get domiciliarioActual() {
    return this.clienteService.getClienteActual();
  }

  get esDomiciliario(): boolean {
    return this.clienteService.esDomiciliario();
  }

  get esAdmin(): boolean {
    return this.clienteService.esAdmin();
  }

  ngOnInit(): void {
    if (!this.esDomiciliario && !this.esAdmin) {
      this.router.navigate(['/cliente/portal']);
      return;
    }
    this.cargarPedidos();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  cargarPedidos(): void {
    const usuario = this.domiciliarioActual;
    if (!usuario?.id) {
      this.errorMessage = 'No se encontró una sesión activa de repartidor.';
      this.cargando = false;
      return;
    }

    this.cargando = true;
    this.subscription.add(
      this.pedidoService.getPedidosPorDomiciliario(usuario.id).subscribe({
        next: (pedidos) => {
          this.pedidosArray = pedidos;
          this.cargando = false;
        },
        error: (err: unknown) => {
          console.error('Error al cargar pedidos del domiciliario:', err);
          this.errorMessage = 'No se pudieron consultar tus pedidos asignados.';
          this.cargando = false;
        },
      })
    );
  }

  get pedidosEnRuta(): Pedido[] {
    return this.pedidosArray.filter(
      (p) => p.estado === 'Enviado' || p.estado === 'En camino' || p.estado === 'Enviando'
    );
  }

  get pedidosEnCola(): Pedido[] {
    return this.pedidosArray.filter(
      (p) => p.estado === 'Cocinando' || p.estado === 'Listo' || p.estado === 'En preparación'
    );
  }

  get pedidosEntregados(): Pedido[] {
    return this.pedidosArray.filter((p) => p.estado === 'Entregado');
  }

  marcarComoEntregado(pedidoId: number): void {
    this.mensajeExito = '';
    this.errorMessage = '';

    this.subscription.add(
      this.pedidoService.actualizarEstadoPedido(pedidoId, { estado: 'Entregado' }).subscribe({
        next: () => {
          this.mensajeExito = `¡Pedido #${pedidoId} marcado como entregado con éxito!`;
          this.cargarPedidos();
        },
        error: (err: unknown) => {
          console.error('Error al entregar pedido:', err);
          this.errorMessage = 'No se pudo actualizar el estado del pedido.';
        },
      })
    );
  }
}
