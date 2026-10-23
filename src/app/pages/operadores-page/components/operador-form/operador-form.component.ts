import { Component, OnInit, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OperadorDTO } from '../../../../dtos/operador.dto';

/**
 * Componente hijo de formulario reactivo para la creación y edición de Operadores.
 * Utiliza signals input() y output() de Angular 19 y el ciclo de vida ngOnInit().
 */
@Component({
  selector: 'app-operador-form',
  imports: [ReactiveFormsModule],
  templateUrl: './operador-form.component.html',
  styleUrl: './operador-form.component.css',
})
export class OperadorFormComponent implements OnInit {
  operadorEditar = input<OperadorDTO | null>(null);

  onSave = output<OperadorDTO>();
  onCancel = output<void>();

  operadorForm = new FormGroup({
    id: new FormControl<number | undefined>(undefined),
    nombre: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
    usuario: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
    ]),
    contrasena: new FormControl('', [
      Validators.minLength(4),
    ]),
  });

  /**
   * Ciclo de vida ngOnInit para inicializar y precargar el formulario mediante patchValue().
   */
  ngOnInit(): void {
    const op = this.operadorEditar();
    if (op) {
      this.operadorForm.patchValue({
        id: op.id,
        nombre: op.nombre,
        usuario: op.usuario,
        contrasena: '',
      });
      // Si es edición, la contraseña puede ser opcional
      this.operadorForm.get('contrasena')?.clearValidators();
      this.operadorForm.get('contrasena')?.updateValueAndValidity();
    } else {
      this.operadorForm.reset({ id: undefined, nombre: '', usuario: '', contrasena: '' });
      // Si es nuevo, la contraseña es obligatoria
      this.operadorForm.get('contrasena')?.setValidators([Validators.required, Validators.minLength(4)]);
      this.operadorForm.get('contrasena')?.updateValueAndValidity();
    }
  }

  submitForm(): void {
    if (this.operadorForm.invalid) {
      this.operadorForm.markAllAsTouched();
      return;
    }

    const val = this.operadorForm.value;
    const dto: OperadorDTO = {
      id: val.id ?? undefined,
      nombre: val.nombre!.trim(),
      usuario: val.usuario!.trim().toLowerCase(),
      contrasena: val.contrasena ? val.contrasena.trim() : undefined,
    };

    this.onSave.emit(dto);
  }

  cancelar(): void {
    this.operadorForm.reset();
    this.onCancel.emit();
  }
}
