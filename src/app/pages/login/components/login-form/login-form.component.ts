import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent {
  loginForm = input.required<FormGroup>();
  rolSeleccionado = input.required<'cliente' | 'operador' | 'domiciliario' | 'admin'>();
  errorMessage = input<string>('');
  logoutMessage = input<boolean>(false);
  portalAlert = input<boolean>(false);

  formSubmitted = output<void>();

  onSubmit(): void {
    this.formSubmitted.emit();
  }
}
