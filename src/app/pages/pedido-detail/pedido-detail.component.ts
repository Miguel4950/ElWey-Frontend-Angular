import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CalaverasComponent } from '../../components/calaveras/calaveras.component';
import { PedidoDTO } from '../../dtos/pedido.dto';
import { DomiciliarioDTO } from '../../dtos/domiciliario.dto';
import { PedidoService } from '../../service/pedido.service';
import { DomiciliarioService } from '../../service/domiciliario.service';
import { ClienteService } from '../../service/cliente.service';
import { PedidoGestionComponent } from './components/pedido-gestion/pedido-gestion.component';
import { PedidoInfoComponent } from './components/pedido-info/pedido-info.component';

/**
 * Detalle consolidado de un pedido (Comanda).
 * Estructurado en subcomponentes visuales especializados:
 * - PedidoGestionComponent: Barra de operaciones de cocina y asignación/despacho de repartidores.
 * - PedidoInfoComponent: Datos del comensal, desglose de platos, adicionales y totales.
 */
@Component({
  selector: 'app-pedido-detail',
  standalone: true,
  imports: [
    RouterLink,
    NavbarComponent,
    FooterComponent,
    CalaverasComponent,
    PedidoGestionComponent,
    PedidoInfoComponent,
  ],
  templateUrl: './pedido-detail.component.html',
  styleUrl: './pedido-detail.component.css',
})
export class PedidoDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pedidoService = inject(PedidoService);
  private domiciliarioService = inject(DomiciliarioService);
  private clienteService = inject(ClienteService);
  private subscription: Subscription = new Subscription();

  pedidoId = -1;
  pedido: PedidoDTO | undefined;
  domiciliariosDisponibles: DomiciliarioDTO[] = [];

  mensajeExito: string = '';
  errorMessage: string = '';

  get puedeGestionar(): boolean {
    return (
      this.clienteService.esOperador() ||
      this.clienteService.esAdmin()
    );
  }

  ngOnInit(): void {
    if (this.clienteService.esDomiciliario()) {
      this.router.navigate(['/comidas/tabla']);
      return;
    }
    this.pedidoId = Number(this.route.snapshot.params['id']);
    if (this.pedidoId) {
      this.cargarDetalleYRepartidores();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Carga el pedido con sus ítems (usando mergeMap en el servicio) y la flota disponible.
   */
  cargarDetalleYRepartidores(): void {
    this.errorMessage = '';
    this.subscription.add(
      this.pedidoService.getPedidoConItems(this.pedidoId).subscribe({
        next: (pedido) => {
          this.pedido = pedido;
        },
        error: (err) => {
          console.error('Error al obtener el detalle del pedido:', err);
          this.pedido = undefined;
          this.errorMessage = 'No fue posible consultar el pedido solicitado.';
        },
      })
    );

    if (this.puedeGestionar) {
      this.subscription.add(
        this.domiciliarioService.getDomiciliariosDisponibles().subscribe({
          next: (doms) => {
            this.domiciliariosDisponibles = doms;
          },
          error: (err) => console.error('Error al cargar domiciliarios disponibles:', err),
        })
      );
    }
  }

  enviarPedido(domiciliarioId: number): void {
    if (!this.pedidoId) return;
    this.actualizarEstado('Enviado', domiciliarioId);
  }

  marcarEntregado(): void {
    if (!this.pedidoId) return;
    this.actualizarEstado('Entregado');
  }

  private actualizarEstado(nuevoEstado: string, domiciliarioId?: number): void {
    this.errorMessage = '';
    this.mensajeExito = '';

    this.subscription.add(
      this.pedidoService
        .actualizarEstadoPedido(this.pedidoId, {
          estado: nuevoEstado,
          domiciliarioId: domiciliarioId,
        })
        .subscribe({
          next: (actualizado) => {
            this.mensajeExito = `El pedido ahora está en estado: "${actualizado.estado}".`;
            this.cargarDetalleYRepartidores();
          },
          error: (err) => {
            console.error('Error al actualizar el estado del pedido:', err);
            this.errorMessage =
              err?.error?.mensaje || 'Error al actualizar el estado del pedido.';
          },
        })
    );
  }
}
