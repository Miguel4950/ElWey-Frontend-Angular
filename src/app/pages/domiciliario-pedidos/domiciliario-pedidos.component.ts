import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CalaverasComponent } from '../../components/calaveras/calaveras.component';
import { PedidoDTO } from '../../dtos/pedido.dto';
import { PedidoService } from '../../service/pedido.service';
import { ClienteService } from '../../service/cliente.service';

/**
 * Portal exclusivo para repartidores (Domiciliarios) de "El Wey".
 * Permite monitorear las entregas en curso en ruta, visualizar pedidos asignados en cola (cocina)
 * y confirmar las entregas exitosas a los clientes en tiempo real.
 */
@Component({
  selector: 'app-domiciliario-pedidos',
  standalone: true,
  imports: [
    DecimalPipe,
    NavbarComponent,
    FooterComponent,
    CalaverasComponent,
  ],
  templateUrl: './domiciliario-pedidos.component.html',
  styleUrl: './domiciliario-pedidos.component.css',
})
export class DomiciliarioPedidosComponent implements OnInit, OnDestroy {
  private pedidoService = inject(PedidoService);
  private clienteService = inject(ClienteService);
  private router = inject(Router);
  private subscription: Subscription = new Subscription();

  pedidosArray: PedidoDTO[] = [];
  cargando: boolean = true;
  mensajeExito: string = '';
  errorMessage: string = '';

  // Filtro de vista activo dentro del portal
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
    // Protección de ruta: Solo Domiciliario y Administrador pueden acceder
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
        error: (err) => {
          console.error('Error al cargar pedidos del domiciliario:', err);
          this.errorMessage = 'No se pudieron consultar tus pedidos asignados.';
          this.cargando = false;
        },
      })
    );
  }

  get pedidosEnRuta(): PedidoDTO[] {
    return this.pedidosArray.filter(
      (p) => p.estado === 'Enviado' || p.estado === 'En camino' || p.estado === 'Enviando'
    );
  }

  get pedidosEnCola(): PedidoDTO[] {
    return this.pedidosArray.filter(
      (p) => p.estado === 'Cocinando' || p.estado === 'Listo' || p.estado === 'En preparación'
    );
  }

  get pedidosEntregados(): PedidoDTO[] {
    return this.pedidosArray.filter((p) => p.estado === 'Entregado');
  }

  /**
   * Acción ejecutada directamente por el repartidor al entregar el pedido en mano del cliente.
   */
  marcarComoEntregado(pedidoId: number): void {
    if (!pedidoId) return;

    this.errorMessage = '';
    this.mensajeExito = '';

    this.subscription.add(
      this.pedidoService
        .actualizarEstadoPedido(pedidoId, { estado: 'Entregado' })
        .subscribe({
          next: () => {
            this.mensajeExito = `¡Excelente trabajo! El pedido #${pedidoId} ha sido marcado como entregado con éxito.`;
            this.cargarPedidos();
          },
          error: (err) => {
            console.error('Error al confirmar entrega:', err);
            this.errorMessage =
              err?.error?.mensaje || 'Ocurrió un error al confirmar la entrega del pedido.';
          },
        })
    );
  }
}
