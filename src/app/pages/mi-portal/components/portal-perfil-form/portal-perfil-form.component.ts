import { Component, OnInit, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClienteDTO } from '../../../../dtos/cliente.dto';

/**
 * Subcomponente de formulario para la edición del perfil de usuario y datos personales.
 * Sigue estrictamente las reglas de clase: ReactiveFormsModule, input(), output(), ngOnInit().
 */
@Component({
  selector: 'app-portal-perfil-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './portal-perfil-form.component.html',
  styleUrl: './portal-perfil-form.component.css',
})
export class PortalPerfilFormComponent implements OnInit {
  cliente = input<ClienteDTO | null>(null);

  guardar = output<{
    nombre: string;
    apellido?: string;
    correo: string;
    telefono: string;
    direccion: string;
  }>();

  eliminar = output<void>();

  portalForm = new FormGroup({
    id: new FormControl<number | null>(null),
    nombre: new FormControl('', [Validators.required, Validators.minLength(2)]),
    apellido: new FormControl('', [Validators.required, Validators.minLength(2)]),
    correo: new FormControl('', [Validators.required, Validators.email]),
    telefono: new FormControl('', [Validators.required]),
    direccion: new FormControl('', [Validators.required]),
    fechaRegistro: new FormControl(''),
  });

  ngOnInit(): void {
    if (this.cliente()) {
      this.cargarFormulario(this.cliente()!);
    }
  }

  cargarFormulario(c: ClienteDTO): void {
    this.portalForm.patchValue({
      id: c.id,
      nombre: c.nombre,
      apellido: c.apellido || '',
      correo: c.correo,
      telefono: c.telefono,
      direccion: c.direccion,
      fechaRegistro: c.fechaRegistro || '15 de Enero, 2026',
    });
  }

  onSubmit(): void {
    if (this.portalForm.invalid) {
      this.portalForm.markAllAsTouched();
      return;
    }

    const { nombre, apellido, correo, telefono, direccion } = this.portalForm.value;
    this.guardar.emit({
      nombre: nombre!.trim(),
      apellido: apellido ? apellido.trim() : '',
      correo: correo!.trim(),
      telefono: telefono!.trim(),
      direccion: direccion!.trim(),
    });
  }

  onRestablecer(): void {
    if (this.cliente()) {
      this.cargarFormulario(this.cliente()!);
    }
  }

  onEliminarClick(): void {
    this.eliminar.emit();
  }
}
