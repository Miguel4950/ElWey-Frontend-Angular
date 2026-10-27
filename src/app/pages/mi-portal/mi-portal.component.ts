import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CalaverasComponent } from '../../components/calaveras/calaveras.component';
import { ClienteService } from '../../service/cliente.service';
import { PedidoService } from '../../service/pedido.service';
import { ClienteDTO } from '../../dtos/cliente.dto';
import { PedidoDTO } from '../../dtos/pedido.dto';
import { PortalPedidosActivosComponent } from './components/portal-pedidos-activos/portal-pedidos-activos.component';
import { PortalHistorialPedidosComponent } from './components/portal-historial-pedidos/portal-historial-pedidos.component';
import { PortalPerfilFormComponent } from './components/portal-perfil-form/portal-perfil-form.component';

/**
 * Portal del Cliente en "El Wey".
 * Estructurado modularmente en subcomponentes pequeños:
 * - PortalPedidosActivosComponent: Monitoreo en tiempo real de órdenes activas.
 * - PortalHistorialPedidosComponent: Tabla de historial de pedidos completados.
 * - PortalPerfilFormComponent: Formulario reactivo de actualización de perfil y eliminación de cuenta.
 */
@Component({
  selector: 'app-mi-portal',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    CalaverasComponent,
    PortalPedidosActivosComponent,
    PortalHistorialPedidosComponent,
    PortalPerfilFormComponent,
  ],
  templateUrl: './mi-portal.component.html',
  styleUrl: './mi-portal.component.css',
})
export class MiPortalComponent implements OnInit, OnDestroy {
  private clienteService = inject(ClienteService);
  private pedidoService = inject(PedidoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private subscription: Subscription = new Subscription();

  cliente: ClienteDTO | null = null;
  pedidosCliente: PedidoDTO[] = [];
  mensajeActualizado: boolean = false;
  mensajeBienvenido: boolean = false;
  errorMessage: string = '';

  ngOnInit(): void {
    this.subscription.add(
      this.route.queryParams.subscribe((params) => {
        if (params['bienvenido']) {
          this.mensajeBienvenido = true;
        }
        if (params['actualizado']) {
          this.mensajeActualizado = true;
        }
      })
    );

    const idParam = this.route.snapshot.params['id'];
    if (idParam) {
      this.subscription.add(
        this.clienteService.getClienteById(Number(idParam)).subscribe({
          next: (cliente) => {
            this.cliente = cliente;
            if (cliente.id) {
              this.cargarPedidosCliente(cliente.id);
            }
          },
          error: (err) => console.error('Error al cargar cliente:', err),
        })
      );
    } else {
      const usuarioActual = this.clienteService.getClienteActual();
      if (usuarioActual && usuarioActual.id) {
        this.subscription.add(
          this.clienteService.getClienteById(usuarioActual.id).subscribe({
            next: (cliente) => {
              this.cliente = cliente;
              if (cliente.id) {
                this.cargarPedidosCliente(cliente.id);
              }
            },
            error: (err) => {
              console.warn('No se pudo obtener cliente completo desde backend, usando usuario de sesión:', err);
              this.cliente = {
                id: usuarioActual.id,
                nombre: usuarioActual.nombre,
                apellido: usuarioActual.apellido,
                correo: usuarioActual.correo,
                telefono: usuarioActual.telefono || '',
                direccion: usuarioActual.direccion || '',
                activo: usuarioActual.activo,
                fechaRegistro: usuarioActual.fechaRegistro,
              };
              if (this.cliente.id) {
                this.cargarPedidosCliente(this.cliente.id);
              }
            },
          })
        );
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  cargarPedidosCliente(clienteId: number): void {
    this.subscription.add(
      this.pedidoService.getPedidosByCliente(clienteId).subscribe({
        next: (pedidos) => {
          this.pedidosCliente = pedidos;
        },
        error: (err) => console.error('Error al cargar pedidos del cliente:', err),
      })
    );
  }

  get pedidosActivos(): PedidoDTO[] {
    return this.pedidosCliente.filter((p) => p.estado !== 'Entregado');
  }

  get pedidosEntregados(): PedidoDTO[] {
    return this.pedidosCliente.filter((p) => p.estado === 'Entregado');
  }

  onActualizarPerfil(datos: {
    nombre: string;
    apellido?: string;
    correo: string;
    telefono: string;
    direccion: string;
  }): void {
    if (!this.cliente || !this.cliente.id) return;

    const clienteActualizado: ClienteDTO = {
      ...this.cliente,
      nombre: datos.nombre,
      apellido: datos.apellido,
      correo: datos.correo,
      telefono: datos.telefono,
      direccion: datos.direccion,
    };

    this.subscription.add(
      this.clienteService.updateCliente(this.cliente.id, clienteActualizado).subscribe({
        next: (confirmado) => {
          this.clienteService.setClienteActual({ ...confirmado, rol: 'CLIENTE' });
          this.cliente = confirmado;
          this.mensajeActualizado = true;
          this.mensajeBienvenido = false;
          this.errorMessage = '';
        },
        error: (err) => {
          this.mensajeActualizado = false;
          this.errorMessage = err?.error?.mensaje || 'Error al actualizar la información. Por favor, intenta de nuevo.';
        },
      })
    );
  }

  onEliminarCuenta(): void {
    if (!this.cliente || !this.cliente.id) return;

    const confirmado = confirm(
      '¿Estás seguro de que deseas eliminar tu cuenta permanentemente? Esta acción no se puede deshacer.'
    );

    if (confirmado) {
      const idAEliminar = this.cliente.id;
      this.subscription.add(
        this.clienteService.eliminarCliente(idAEliminar).subscribe({
          next: () => {
            this.clienteService.setClienteActual(null);
            this.router.navigate(['/']);
          },
          error: (err) => {
            this.mensajeActualizado = false;
            console.error('Error al eliminar cuenta en el servidor:', err);
            this.errorMessage =
              err?.error?.mensaje || 'Error al eliminar la cuenta. Por favor, intenta de nuevo.';
          },
        })
      );
    }
  }
}
