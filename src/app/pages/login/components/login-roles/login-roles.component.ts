import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-login-roles',
  imports: [],
  templateUrl: './login-roles.component.html',
  styleUrl: './login-roles.component.css',
})
export class LoginRolesComponent {
  rolSeleccionado = input.required<'cliente' | 'operador' | 'domiciliario' | 'admin'>();
  rolSelected = output<'cliente' | 'operador' | 'domiciliario' | 'admin'>();

  seleccionar(rol: 'cliente' | 'operador' | 'domiciliario' | 'admin'): void {
    this.rolSelected.emit(rol);
  }
}
