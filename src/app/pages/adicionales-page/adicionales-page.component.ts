import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CalaverasComponent } from '../../components/calaveras/calaveras.component';
import { AdicionalTableComponent } from './components/adicional-table/adicional-table.component';
import { AdicionalFormComponent } from './components/adicional-form/adicional-form.component';
import { AdicionalDTO } from '../../dtos/adicional.dto';
import { AdicionalService } from '../../service/adicional.service';
import { ClienteService } from '../../service/cliente.service';

/**
 * Página principal para la gestión y CRUD de Adicionales del restaurante.
 * Diseñada para el rol Administrador. Divide su presentación en componentes hijos.
 */
@Component({
  selector: 'app-adicionales-page',
  imports: [
    NavbarComponent,
    FooterComponent,
    CalaverasComponent,
    AdicionalTableComponent,
    AdicionalFormComponent,
  ],
  templateUrl: './adicionales-page.component.html',
  styleUrl: './adicionales-page.component.css',
})
export class AdicionalesPageComponent implements OnInit, OnDestroy {
  private adicionalService = inject(AdicionalService);
  private clienteService = inject(ClienteService);
  private subscription: Subscription = new Subscription();

  adicionalesArray: AdicionalDTO[] = [];
  adicionalSeleccionado: AdicionalDTO | null = null;
  mostrarFormulario: boolean = false;
  mensajeExito: string = '';
  errorMessage: string = '';

  get esAdmin(): boolean {
    return this.clienteService.esAdmin();
  }

  ngOnInit(): void {
    this.cargarAdicionales();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  cargarAdicionales(): void {
    this.errorMessage = '';
    this.subscription.add(
      this.adicionalService.getAdicionales().subscribe({
        next: (adicionales) => {
          this.adicionalesArray = adicionales;
        },
        error: (err) => {
          console.error('Error al cargar adicionales:', err);
          this.errorMessage = 'No se pudieron consultar los adicionales desde el servidor.';
        },
      })
    );
  }

  abrirNuevoAdicional(): void {
    this.mostrarFormulario = false;
    setTimeout(() => {
      this.adicionalSeleccionado = null;
      this.mostrarFormulario = true;
      this.mensajeExito = '';
      this.errorMessage = '';
    });
  }

  iniciarEdicion(adicional: AdicionalDTO): void {
    this.mostrarFormulario = false;
    setTimeout(() => {
      this.adicionalSeleccionado = { ...adicional };
      this.mostrarFormulario = true;
      this.mensajeExito = '';
      this.errorMessage = '';
    });
  }

  guardarAdicional(adicional: AdicionalDTO): void {
    this.errorMessage = '';
    this.mensajeExito = '';

    if (adicional.id) {
      // Actualización
      this.subscription.add(
        this.adicionalService.updateAdicional(adicional.id, adicional).subscribe({
          next: () => {
            this.mensajeExito = `El adicional "${adicional.nombre}" ha sido actualizado con éxito.`;
            this.mostrarFormulario = false;
            this.adicionalSeleccionado = null;
            this.cargarAdicionales();
          },
          error: (err) => {
            console.error('Error al actualizar adicional:', err);
            this.errorMessage = err?.error?.mensaje || 'Error al actualizar el adicional.';
          },
        })
      );
    } else {
      // Creación
      this.subscription.add(
        this.adicionalService.createAdicional(adicional).subscribe({
          next: () => {
            this.mensajeExito = `El adicional "${adicional.nombre}" ha sido creado con éxito.`;
            this.mostrarFormulario = false;
            this.cargarAdicionales();
          },
          error: (err) => {
            console.error('Error al crear adicional:', err);
            this.errorMessage = err?.error?.mensaje || 'Error al registrar el adicional.';
          },
        })
      );
    }
  }

  eliminarAdicional(id: number): void {
    const adic = this.adicionalesArray.find((a) => a.id === id);
    const nombre = adic ? adic.nombre : `con ID #${id}`;

    if (confirm(`¿Estás seguro de eliminar el adicional "${nombre}" permanentemente?`)) {
      this.errorMessage = '';
      this.subscription.add(
        this.adicionalService.deleteAdicional(id).subscribe({
          next: () => {
            this.mensajeExito = `El adicional "${nombre}" fue eliminado exitosamente.`;
            this.cargarAdicionales();
          },
          error: (err) => {
            console.error('Error al eliminar adicional:', err);
            this.errorMessage =
              err?.error?.mensaje || 'No fue posible eliminar el adicional. Verifica dependencias activas.';
          },
        })
      );
    }
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.adicionalSeleccionado = null;
  }
}
