import { Component, OnInit, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdicionalDTO } from '../../../../dtos/adicional.dto';

/**
 * Componente hijo de formulario reactivo para crear y editar adicionales.
 * Utiliza signals input() y output() de Angular 19 y el ciclo de vida ngOnInit().
 */
@Component({
  selector: 'app-adicional-form',
  imports: [ReactiveFormsModule],
  templateUrl: './adicional-form.component.html',
  styleUrl: './adicional-form.component.css',
})
export class AdicionalFormComponent implements OnInit {
  adicionalEditar = input<AdicionalDTO | null>(null);

  onSave = output<AdicionalDTO>();
  onCancel = output<void>();

  adicionalForm = new FormGroup({
    id: new FormControl<number | undefined>(undefined),
    nombre: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(80),
    ]),
    precio: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0),
    ]),
    activo: new FormControl(true, [Validators.required]),
  });

  /**
   * Ciclo de vida ngOnInit para inicializar y precargar el formulario mediante patchValue().
   */
  ngOnInit(): void {
    const adic = this.adicionalEditar();
    if (adic) {
      this.adicionalForm.patchValue({
        id: adic.id,
        nombre: adic.nombre,
        precio: adic.precio,
        activo: adic.activo !== false,
      });
    }
  }

  submitForm(): void {
    if (this.adicionalForm.invalid) {
      this.adicionalForm.markAllAsTouched();
      return;
    }

    const val = this.adicionalForm.value;
    const adicionalDTO: AdicionalDTO = {
      id: val.id ?? undefined,
      nombre: val.nombre!.trim(),
      precio: Number(val.precio),
      activo: val.activo ?? true,
    };

    this.onSave.emit(adicionalDTO);
  }

  cancelar(): void {
    this.adicionalForm.reset({ activo: true });
    this.onCancel.emit();
  }
}
