import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CalaverasComponent } from '../../components/calaveras/calaveras.component';
import { DomiciliarioTableComponent } from './components/domiciliario-table/domiciliario-table.component';
import { DomiciliarioFormComponent } from './components/domiciliario-form/domiciliario-form.component';
import { DomiciliarioDTO } from '../../dtos/domiciliario.dto';
import { DomiciliarioService } from '../../service/domiciliario.service';
import { ClienteService } from '../../service/cliente.service';
import { Router } from '@angular/router';

/**
 * Página principal para la gestión y monitoreo del personal de reparto (domiciliarios).
 * Diseñada para el rol Administrador de "El Wey". Divide su vista en componentes hijos modulares.
 */
@Component({
  selector: 'app-domiciliarios-page',
  imports: [
    NavbarComponent,
    FooterComponent,
    CalaverasComponent,
    DomiciliarioTableComponent,
    DomiciliarioFormComponent,
  ],
  templateUrl: './domiciliarios-page.component.html',
  styleUrl: './domiciliarios-page.component.css',
})
export class DomiciliariosPageComponent implements OnInit, OnDestroy {
  private domiciliarioService = inject(DomiciliarioService);
  private clienteService = inject(ClienteService);
  private router = inject(Router);
  private subscription: Subscription = new Subscription();

  domiciliariosArray: DomiciliarioDTO[] = [];
  domiciliarioSeleccionado: DomiciliarioDTO | null = null;
  mostrarFormulario: boolean = false;
  mensajeExito: string = '';
  errorMessage: string = '';

  get esAdmin(): boolean {
    return this.clienteService.esAdmin();
  }

  ngOnInit(): void {
    if (!this.clienteService.esAdmin() && !this.clienteService.esOperador()) {
      if (this.clienteService.esDomiciliario()) {
        this.router.navigate(['/pedidos']);
      } else {
        this.router.navigate(['/']);
      }
      return;
    }
    this.cargarDomiciliarios();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Consulta el listado actualizado de domiciliarios desde la API REST.
   */
  cargarDomiciliarios(): void {
    this.errorMessage = '';
    this.subscription.add(
      this.domiciliarioService.getDomiciliarios().subscribe({
        next: (domiciliarios) => {
          this.domiciliariosArray = domiciliarios;
        },
        error: (err) => {
          console.error('Error al cargar domiciliarios:', err);
          this.errorMessage = 'No se pudieron consultar los domiciliarios desde el servidor.';
        },
      })
    );
  }

  /**
   * Abre el formulario para registrar un nuevo domiciliario.
   */
  abrirNuevoDomiciliario(): void {
    this.mostrarFormulario = false;
    setTimeout(() => {
      this.domiciliarioSeleccionado = null;
      this.mostrarFormulario = true;
      this.mensajeExito = '';
      this.errorMessage = '';
    });
  }

  /**
   * Carga los datos del domiciliario seleccionado en el formulario para editarlo.
   */
  iniciarEdicion(domiciliario: DomiciliarioDTO): void {
    this.mostrarFormulario = false;
    setTimeout(() => {
      this.domiciliarioSeleccionado = { ...domiciliario };
      this.mostrarFormulario = true;
      this.mensajeExito = '';
      this.errorMessage = '';
    });
  }

  /**
   * Alterna de forma directa la disponibilidad del domiciliario (disponible vs ocupado).
   */
  toggleDisponibilidad(domiciliario: DomiciliarioDTO): void {
    if (!domiciliario.id) return;
    this.errorMessage = '';
    const nuevoEstado = !domiciliario.disponible;

    this.subscription.add(
      this.domiciliarioService.cambiarDisponibilidad(domiciliario.id, nuevoEstado).subscribe({
        next: (actualizado) => {
          const estadoTxt = actualizado.disponible ? 'Disponible' : 'Ocupado';
          this.mensajeExito = `Domiciliario "${actualizado.nombre}" ahora está marcado como ${estadoTxt}.`;
          this.cargarDomiciliarios();
        },
        error: (err) => {
          console.error('Error al cambiar disponibilidad:', err);
          this.errorMessage =
            err?.error?.mensaje || 'Error al cambiar la disponibilidad del domiciliario.';
        },
      })
    );
  }

  /**
   * Guarda o actualiza un domiciliario mediante el servicio REST.
   */
  guardarDomiciliario(domiciliario: DomiciliarioDTO): void {
    this.errorMessage = '';
    this.mensajeExito = '';

    if (domiciliario.id) {
      // Edición
      this.subscription.add(
        this.domiciliarioService.updateDomiciliario(domiciliario.id, domiciliario).subscribe({
          next: () => {
            this.mensajeExito = `El domiciliario "${domiciliario.nombre}" fue actualizado con éxito.`;
            this.mostrarFormulario = false;
            this.domiciliarioSeleccionado = null;
            this.cargarDomiciliarios();
          },
          error: (err) => {
            console.error('Error al actualizar domiciliario:', err);
            this.errorMessage =
              err?.error?.mensaje || 'Error al actualizar los datos del domiciliario.';
          },
        })
      );
    } else {
      // Creación
      this.subscription.add(
        this.domiciliarioService.createDomiciliario(domiciliario).subscribe({
          next: () => {
            this.mensajeExito = `El domiciliario "${domiciliario.nombre}" fue registrado con éxito.`;
            this.mostrarFormulario = false;
            this.cargarDomiciliarios();
          },
          error: (err) => {
            console.error('Error al registrar domiciliario:', err);
            this.errorMessage =
              err?.error?.mensaje || 'Error al registrar el nuevo domiciliario.';
          },
        })
      );
    }
  }

  /**
   * Elimina un domiciliario del sistema tras confirmación.
   */
  eliminarDomiciliario(id: number): void {
    const d = this.domiciliariosArray.find((item) => item.id === id);
    const nombre = d ? d.nombre : `con ID #${id}`;

    if (confirm(`¿Estás seguro de eliminar al domiciliario "${nombre}" permanentemente?`)) {
      this.errorMessage = '';
      this.subscription.add(
        this.domiciliarioService.deleteDomiciliario(id).subscribe({
          next: () => {
            this.mensajeExito = `El domiciliario "${nombre}" fue eliminado exitosamente.`;
            this.cargarDomiciliarios();
          },
          error: (err) => {
            console.error('Error al eliminar domiciliario:', err);
            this.errorMessage =
              err?.error?.mensaje || 'No fue posible eliminar al domiciliario solicitado.';
          },
        })
      );
    }
  }

  /**
   * Cierra el formulario modal o colapsable.
   */
  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.domiciliarioSeleccionado = null;
  }
}
