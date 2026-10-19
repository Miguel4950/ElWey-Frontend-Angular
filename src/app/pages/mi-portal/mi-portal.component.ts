import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CalaverasComponent } from '../../components/calaveras/calaveras.component';
import { ClienteService } from '../../service/cliente.service';
import { ClienteDTO } from '../../dtos/cliente.dto';

@Component({
  selector: 'app-mi-portal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NavbarComponent,
    FooterComponent,
    CalaverasComponent,
  ],
  templateUrl: './mi-portal.component.html',
  styleUrl: './mi-portal.component.css',
})
export class MiPortalComponent implements OnInit, OnDestroy {
  private clienteService = inject(ClienteService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private subscription: Subscription = new Subscription();

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  cliente: ClienteDTO | null = null;
  mensajeActualizado: boolean = false;
  mensajeBienvenido: boolean = false;
  errorMessage: string = '';

  portalForm = new FormGroup({
    id: new FormControl<number | null>(null),
    nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
    correo: new FormControl('', [Validators.required, Validators.email]),
    telefono: new FormControl('', [Validators.required]),
    direccion: new FormControl('', [Validators.required]),
    fechaRegistro: new FormControl(''),
  });

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

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.subscription.add(
        this.clienteService.getClienteById(Number(idParam)).subscribe({
          next: (cliente) => {
            this.cliente = cliente;
            this.cargarFormulario(cliente);
          },
          error: (err) => console.error('Error al cargar cliente:', err),
        })
      );
    } else {
      this.cliente = this.clienteService.getClienteActual();
      if (this.cliente) {
        this.cargarFormulario(this.cliente);
      }
    }
  }

  cargarFormulario(cliente: ClienteDTO): void {
    this.portalForm.patchValue({
      id: cliente.id,
      nombre: cliente.nombre,
      correo: cliente.correo,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
      fechaRegistro: cliente.fechaRegistro || '15 de Enero, 2026',
    });
  }

  onActualizar(): void {
    if (this.portalForm.invalid) {
      this.portalForm.markAllAsTouched();
      this.errorMessage = 'Por favor completa todos los campos con valores válidos.';
      return;
    }

    if (!this.cliente || !this.cliente.id) {
      return;
    }

    const { nombre, correo, telefono, direccion } = this.portalForm.value;

    const clienteActualizado: ClienteDTO = {
      id: this.cliente.id,
      nombre: nombre!.trim(),
      correo: correo!.trim(),
      contrasena: this.cliente.contrasena,
      telefono: telefono!.trim(),
      direccion: direccion!.trim(),
      activo: this.cliente.activo,
      fechaRegistro: this.cliente.fechaRegistro,
    };

    this.subscription.add(
      this.clienteService.updateCliente(this.cliente.id, clienteActualizado).subscribe({
        next: (confirmado) => {
          this.clienteService.setClienteActual(confirmado);
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

  onRestablecer(): void {
    if (this.cliente) {
      this.cargarFormulario(this.cliente);
      this.mensajeActualizado = false;
      this.errorMessage = '';
    }
  }

  onEliminarCuenta(): void {
    if (!this.cliente || !this.cliente.id) {
      return;
    }

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
