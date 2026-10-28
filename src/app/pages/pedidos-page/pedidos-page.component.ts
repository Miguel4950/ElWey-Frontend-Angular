import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CalaverasComponent } from '../../components/calaveras/calaveras.component';
import { PedidosTableComponent } from './components/pedidos-table/pedidos-table.component';
import { PedidoDTO } from '../../dtos/pedido.dto';
import { DomiciliarioDTO } from '../../dtos/domiciliario.dto';
import { PedidoService } from '../../service/pedido.service';
import { DomiciliarioService } from '../../service/domiciliario.service';
import { ClienteService } from '../../service/cliente.service';

/**
 * Página principal para la gestión, despacho y monitoreo de pedidos de restaurante "El Wey".
 * Soporta filtrado por estado, por plato y por rango de fechas (fechaDesde - fechaHasta).
 * Configura por defecto la pestaña de pedidos según el rol del usuario:
 * - Operador / Domiciliario: ve pedidos activos por defecto.
 * - Administrador: ve todos los pedidos (activos y entregados).
 */
@Component({
  selector: 'app-pedidos-page',
  imports: [
    RouterLink,
    FormsModule,
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
  private domiciliarioService = inject(DomiciliarioService);
  private clienteService = inject(ClienteService);
  private router = inject(Router);
  private subscription: Subscription = new Subscription();

  pedidosArray: PedidoDTO[] = [];
  domiciliariosDisponibles: DomiciliarioDTO[] = [];

  // Pestaña de estado activa
  pestanaEstado: 'TODOS' | 'ACTIVOS' | 'ENTREGADOS' = 'TODOS';

  // Filtros reactivos por comida y rango de fechas
  filtroComida: string = '';
  fechaDesde: string = '';
  fechaHasta: string = '';

  mensajeExito: string = '';
  errorMessage: string = '';

  get usuarioActual() {
    return this.clienteService.getClienteActual();
  }

  get esAdmin(): boolean {
    return this.clienteService.esAdmin();
  }

  get esOperador(): boolean {
    return this.clienteService.esOperador();
  }

  get esDomiciliario(): boolean {
    return this.clienteService.esDomiciliario();
  }

  ngOnInit(): void {
    // Solo Administrador y Operador de Cocina tienen permiso para ver el portal de pedidos
    if (!this.esAdmin && !this.esOperador) {
      if (this.esDomiciliario) {
        this.router.navigate(['/comidas/tabla']);
      } else {
        this.router.navigate(['/cliente/portal']);
      }
      return;
    }

    // Configurar pestaña por defecto según rol
    if (this.esAdmin) {
      this.pestanaEstado = 'TODOS';
    } else {
      this.pestanaEstado = 'ACTIVOS';
    }

    this.cargarDatos();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Carga la lista completa de pedidos y la flota de domiciliarios disponibles.
   */
  cargarDatos(): void {
    this.errorMessage = '';
    // Consulta pedidos
    this.subscription.add(
      this.pedidoService.getPedidos().subscribe({
        next: (pedidos) => {
          this.pedidosArray = pedidos;
        },
        error: (err) => {
          console.error('Error al cargar pedidos:', err);
          this.errorMessage = 'No se pudieron consultar los pedidos desde el servidor.';
        },
      })
    );

    // Consulta domiciliarios disponibles
    this.subscription.add(
      this.domiciliarioService.getDomiciliariosDisponibles().subscribe({
        next: (doms) => {
          this.domiciliariosDisponibles = doms;
        },
        error: (err) => {
          console.error('Error al cargar domiciliarios disponibles:', err);
        },
      })
    );
  }

  /**
   * Actualiza el estado de un pedido y/o asigna un repartidor.
   */
  actualizarEstadoPedido(evento: {
    pedidoId: number;
    nuevoEstado: string;
    domiciliarioId?: number;
  }): void {
    this.errorMessage = '';
    this.mensajeExito = '';

    this.subscription.add(
      this.pedidoService
        .actualizarEstadoPedido(evento.pedidoId, {
          estado: evento.nuevoEstado,
          domiciliarioId: evento.domiciliarioId,
        })
        .subscribe({
          next: (pedidoActualizado) => {
            this.mensajeExito = `El pedido #${pedidoActualizado.id} ahora está: ${pedidoActualizado.estado}.`;
            this.cargarDatos();
          },
          error: (err) => {
            console.error('Error al actualizar estado:', err);
            this.errorMessage =
              err?.error?.mensaje || 'No se pudo actualizar el estado del pedido.';
          },
        })
    );
  }

  /**
   * Normaliza formatos de fecha (dd/MM/yyyy HH:mm o ISO) a YYYY-MM-DD para comparaciones de rango exactas.
   */
  private normalizarFecha(fechaStr?: string): string {
    if (!fechaStr) return '';
    const trimmed = fechaStr.trim();
    if (trimmed.includes('/')) {
      const partes = trimmed.split(' ')[0].split('/');
      if (partes.length === 3) {
        const [dia, mes, anio] = partes;
        return `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
      }
    }
    if (trimmed.includes('-')) {
      return trimmed.substring(0, 10);
    }
    return '';
  }

  /**
   * Filtra los pedidos según la pestaña de estado, nombre de comida y rango de fechas.
   */
  get pedidosFiltrados(): PedidoDTO[] {
    return this.pedidosArray.filter((p) => {
      // 1. Filtro por pestaña de estado
      if (this.pestanaEstado === 'ACTIVOS') {
        if (p.estado === 'Entregado') return false;
      } else if (this.pestanaEstado === 'ENTREGADOS') {
        if (p.estado !== 'Entregado') return false;
      }

      // 2. Filtro por nombre de comida / plato
      if (this.filtroComida.trim() !== '') {
        const query = this.filtroComida.trim().toLowerCase();
        const coincidePlato = p.items?.some((item) =>
          item.comidaNombre?.toLowerCase().includes(query)
        );
        if (!coincidePlato) return false;
      }

      // 3. Filtro por rango de fechas (fechaDesde y fechaHasta)
      const fechaPedido = this.normalizarFecha(p.fechaCreacion);
      if (fechaPedido) {
        if (this.fechaDesde && fechaPedido < this.fechaDesde) {
          return false;
        }
        if (this.fechaHasta && fechaPedido > this.fechaHasta) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Limpia los filtros y restablece la pestaña por defecto según el rol.
   */
  limpiarFiltros(): void {
    this.filtroComida = '';
    this.fechaDesde = '';
    this.fechaHasta = '';
    if (this.esAdmin) {
      this.pestanaEstado = 'TODOS';
    } else {
      this.pestanaEstado = 'ACTIVOS';
    }
  }

  get hayFiltrosActivos(): boolean {
    const estadoPorDefecto = this.esAdmin ? 'TODOS' : 'ACTIVOS';
    return (
      this.filtroComida.trim() !== '' ||
      this.fechaDesde !== '' ||
      this.fechaHasta !== '' ||
      this.pestanaEstado !== estadoPorDefecto
    );
  }

  get conteoActivos(): number {
    return this.pedidosArray.filter((p) => p.estado !== 'Entregado').length;
  }

  get conteoEntregados(): number {
    return this.pedidosArray.filter((p) => p.estado === 'Entregado').length;
  }
}
