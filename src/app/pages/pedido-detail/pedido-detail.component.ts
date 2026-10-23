import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CalaverasComponent } from '../../components/calaveras/calaveras.component';
import { PedidoDTO } from '../../dtos/pedido.dto';
import { DomiciliarioDTO } from '../../dtos/domiciliario.dto';
import { PedidoService } from '../../service/pedido.service';
import { DomiciliarioService } from '../../service/domiciliario.service';
import { ClienteService } from '../../service/cliente.service';

/**
 * Detalle consolidado de un pedido (Comanda).
 * Utiliza getPedidoConItems(id) con mergeMap para consultar pedido e ítems reactivamente.
 * Permite a los roles de cocina y administración gestionar el ciclo de entrega.
 */
@Component({
  selector: 'app-pedido-detail',
  imports: [
    RouterLink,
    DecimalPipe,
    FormsModule,
    NavbarComponent,
    FooterComponent,
    CalaverasComponent,
  ],
  templateUrl: './pedido-detail.component.html',
  styleUrl: './pedido-detail.component.css',
})
export class PedidoDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private pedidoService = inject(PedidoService);
  private domiciliarioService = inject(DomiciliarioService);
  private clienteService = inject(ClienteService);
  private subscription: Subscription = new Subscription();

  pedidoId = -1;
  pedido: PedidoDTO | undefined;
  domiciliariosDisponibles: DomiciliarioDTO[] = [];
  domiciliarioSeleccionadoId?: number;

  mensajeExito: string = '';
  errorMessage: string = '';

  get puedeGestionar(): boolean {
    return this.clienteService.esOperador() || this.clienteService.esAdmin();
  }

  ngOnInit(): void {
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
          if (pedido.domiciliarioId) {
            this.domiciliarioSeleccionadoId = pedido.domiciliarioId;
          }
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

  /**
   * Cambia el estado del pedido a 'En preparación'.
   */
  pasarAEnPreparacion(): void {
    if (!this.pedidoId) return;
    this.actualizarEstado('En preparación');
  }

  /**
   * Despacha el pedido en ruta ('En camino') con el domiciliario seleccionado.
   */
  enviarPedido(): void {
    if (!this.pedidoId) return;
    if (!this.domiciliarioSeleccionadoId) {
      alert('Debes seleccionar un domiciliario disponible para despachar el pedido.');
      return;
    }
    this.actualizarEstado('En camino', this.domiciliarioSeleccionadoId);
  }

  /**
   * Marca el pedido como 'Entregado' al cliente y libera al repartidor.
   */
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
