import { Component, OnInit, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomiciliarioDTO } from '../../../../dtos/domiciliario.dto';

/**
 * Componente hijo: Formulario Reactivo para la creación y edición de Domiciliarios.
 * Emplea Angular 19 signals input() y output() junto al ciclo de vida ngOnInit().
 */
@Component({
  selector: 'app-domiciliario-form',
  imports: [ReactiveFormsModule],
  templateUrl: './domiciliario-form.component.html',
  styleUrl: './domiciliario-form.component.css',
})
export class DomiciliarioFormComponent implements OnInit {
  domiciliarioEditar = input<DomiciliarioDTO | null>(null);

  onSave = output<DomiciliarioDTO>();
  onCancel = output<void>();

  domiciliarioForm = new FormGroup({
    id: new FormControl<number | undefined>(undefined),
    cedula: new FormControl('', [
      Validators.required,
      Validators.minLength(7),
      Validators.maxLength(15),
      Validators.pattern('^[0-9]+$'),
    ]),
    nombre: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
    celular: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(15),
    ]),
    disponible: new FormControl<boolean>(true, [Validators.required]),
  });

  /**
   * Ciclo de vida ngOnInit para inicializar y precargar el formulario con patchValue().
   */
  ngOnInit(): void {
    const dom = this.domiciliarioEditar();
    if (dom) {
      this.domiciliarioForm.patchValue({
        id: dom.id,
        cedula: dom.cedula,
        nombre: dom.nombre,
        celular: dom.celular,
        disponible: dom.disponible,
      });
    }
  }

  submitForm(): void {
    if (this.domiciliarioForm.invalid) {
      this.domiciliarioForm.markAllAsTouched();
      return;
    }

    const val = this.domiciliarioForm.value;
    const dto: DomiciliarioDTO = {
      id: val.id ?? undefined,
      cedula: val.cedula!.trim(),
      nombre: val.nombre!.trim(),
      celular: val.celular!.trim(),
      disponible: val.disponible ?? true,
    };

    this.onSave.emit(dto);
  }

  cancelar(): void {
    this.domiciliarioForm.reset();
    this.onCancel.emit();
  }
}
