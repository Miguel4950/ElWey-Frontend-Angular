import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CalaverasComponent } from '../../components/calaveras/calaveras.component';
import { OperadorTableComponent } from './components/operador-table/operador-table.component';
import { OperadorFormComponent } from './components/operador-form/operador-form.component';
import { OperadorDTO } from '../../dtos/operador.dto';
import { OperadorService } from '../../service/operador.service';
import { ClienteService } from '../../service/cliente.service';

/**
 * Página principal para la administración y CRUD de Operadores de cocina.
 * Diseñada para el rol Administrador de "El Wey". Divide su vista en componentes modulares.
 */
@Component({
  selector: 'app-operadores-page',
  imports: [
    NavbarComponent,
    FooterComponent,
    CalaverasComponent,
    OperadorTableComponent,
    OperadorFormComponent,
  ],
  templateUrl: './operadores-page.component.html',
  styleUrl: './operadores-page.component.css',
})
export class OperadoresPageComponent implements OnInit, OnDestroy {
  private operadorService = inject(OperadorService);
  private clienteService = inject(ClienteService);
  private subscription: Subscription = new Subscription();

  operadoresArray: OperadorDTO[] = [];
  operadorSeleccionado: OperadorDTO | null = null;
  mostrarFormulario: boolean = false;
  mensajeExito: string = '';
  errorMessage: string = '';

  get esAdmin(): boolean {
    return this.clienteService.esAdmin();
  }

  ngOnInit(): void {
    this.cargarOperadores();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Consulta la lista completa de operadores desde la API REST.
   */
  cargarOperadores(): void {
    this.errorMessage = '';
    this.subscription.add(
      this.operadorService.getOperadores().subscribe({
        next: (operadores) => {
          this.operadoresArray = operadores;
        },
        error: (err) => {
          console.error('Error al cargar operadores:', err);
          this.errorMessage = 'No se pudieron consultar los operadores desde el servidor.';
        },
      })
    );
  }

  /**
   * Abre el formulario en blanco para registrar un nuevo operador.
   */
  abrirNuevoOperador(): void {
    this.mostrarFormulario = false;
    setTimeout(() => {
      this.operadorSeleccionado = null;
      this.mostrarFormulario = true;
      this.mensajeExito = '';
      this.errorMessage = '';
    });
  }

  /**
   * Carga los datos del operador en el formulario para su edición.
   */
  iniciarEdicion(operador: OperadorDTO): void {
    this.mostrarFormulario = false;
    setTimeout(() => {
      this.operadorSeleccionado = { ...operador };
      this.mostrarFormulario = true;
      this.mensajeExito = '';
      this.errorMessage = '';
    });
  }

  /**
   * Guarda un operador (creación o actualización) llamando a OperadorService.
   */
  guardarOperador(operador: OperadorDTO): void {
    this.errorMessage = '';
    this.mensajeExito = '';

    if (operador.id) {
      // Modo Edición
      this.subscription.add(
        this.operadorService.updateOperador(operador.id, operador).subscribe({
          next: () => {
            this.mensajeExito = `El operador "${operador.nombre}" fue actualizado con éxito.`;
            this.mostrarFormulario = false;
            this.operadorSeleccionado = null;
            this.cargarOperadores();
          },
          error: (err) => {
            console.error('Error al actualizar operador:', err);
            this.errorMessage = err?.error?.mensaje || 'Error al actualizar los datos del operador.';
          },
        })
      );
    } else {
      // Modo Creación
      this.subscription.add(
        this.operadorService.createOperador(operador).subscribe({
          next: () => {
            this.mensajeExito = `El operador "${operador.nombre}" fue registrado con éxito.`;
            this.mostrarFormulario = false;
            this.cargarOperadores();
          },
          error: (err) => {
            console.error('Error al registrar operador:', err);
            this.errorMessage = err?.error?.mensaje || 'Error al registrar el nuevo operador.';
          },
        })
      );
    }
  }

  /**
   * Elimina un operador tras pedir confirmación al usuario.
   */
  eliminarOperador(id: number): void {
    const op = this.operadoresArray.find((o) => o.id === id);
    const nombre = op ? op.nombre : `con ID #${id}`;

    if (confirm(`¿Estás seguro de eliminar al operador "${nombre}" permanentemente?`)) {
      this.errorMessage = '';
      this.subscription.add(
        this.operadorService.deleteOperador(id).subscribe({
          next: () => {
            this.mensajeExito = `El operador "${nombre}" fue eliminado exitosamente.`;
            this.cargarOperadores();
          },
          error: (err) => {
            console.error('Error al eliminar operador:', err);
            this.errorMessage =
              err?.error?.mensaje || 'No fue posible eliminar al operador solicitado.';
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
    this.operadorSeleccionado = null;
  }
}
