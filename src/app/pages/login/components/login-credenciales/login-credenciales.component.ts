import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-login-credenciales',
  imports: [],
  templateUrl: './login-credenciales.component.html',
  styleUrl: './login-credenciales.component.css',
})
export class LoginCredencialesComponent {
  rolSeleccionado = input.required<'cliente' | 'operador' | 'domiciliario' | 'admin'>();
  credencialSelected = output<{ usuario: string; clave: string }>();

  seleccionar(usuario: string, clave: string): void {
    this.credencialSelected.emit({ usuario, clave });
  }
}
