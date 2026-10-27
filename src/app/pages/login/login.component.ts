import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CalaverasComponent } from '../../components/calaveras/calaveras.component';
import { ClienteService } from '../../service/cliente.service';
import { LoginDTO } from '../../dtos/login.dto';

/**
 * Componente de inicio de sesión con soporte explícito para 3 roles:
 * - Cliente (acceso a portal y pedidos personales)
 * - Operador (acceso directo a cocina y portal de despachos)
 * - Administrador (acceso completo a la gestión y CRUDs)
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NavbarComponent,
    FooterComponent,
    CalaverasComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy {
  private clienteService = inject(ClienteService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private subscription?: Subscription;

  // Rol activo seleccionado en las pestañas
  rolSeleccionado: 'cliente' | 'operador' | 'admin' = 'cliente';

  errorMessage: string = '';
  logoutMessage: boolean = false;
  portalAlert: boolean = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['logout']) {
        this.logoutMessage = true;
      }
      if (params['portal']) {
        this.portalAlert = true;
      }
      if (params['rol']) {
        const rolParam = params['rol'].toLowerCase();
        if (rolParam === 'operador' || rolParam === 'admin' || rolParam === 'cliente') {
          this.seleccionarRol(rolParam);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  /**
   * Cambia la pestaña de rol y ajusta dinámicamente las validaciones del formulario.
   */
  seleccionarRol(rol: 'cliente' | 'operador' | 'admin'): void {
    this.rolSeleccionado = rol;
    this.errorMessage = '';
    const emailControl = this.loginForm.get('email');

    if (rol === 'cliente') {
      emailControl?.setValidators([Validators.required, Validators.email]);
    } else {
      // Para Operador o Admin se permite nombre de usuario o correo
      emailControl?.setValidators([Validators.required, Validators.minLength(3)]);
    }
    emailControl?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage =
        this.rolSeleccionado === 'cliente'
          ? 'Por favor ingresa un correo y contraseña válidos.'
          : 'Por favor ingresa tu usuario o correo y tu contraseña.';
      return;
    }

    const credenciales: LoginDTO = {
      correo: this.loginForm.value.email ?? '',
      contrasena: this.loginForm.value.password ?? '',
    };

    this.subscription = this.clienteService
      .autenticarPorRol(credenciales, this.rolSeleccionado)
      .subscribe({
        next: (usuario) => {
          this.clienteService.setClienteActual(usuario);
          this.errorMessage = '';

          // Redirección inteligente según el rol autenticado
          if (this.rolSeleccionado === 'operador' || usuario.rol === 'OPERADOR') {
            this.router.navigate(['/pedidos']);
          } else if (this.rolSeleccionado === 'admin' || usuario.rol === 'ADMIN') {
            this.router.navigate(['/comidas/tabla']);
          } else {
            this.router.navigate(['/cliente/portal']);
          }
        },
        error: (err) => {
          console.error('Error de autenticación:', err);
          this.errorMessage =
            err?.error?.mensaje ||
            `Credenciales inválidas o no corresponden a un usuario con rol de ${this.rolSeleccionado.toUpperCase()}.`;
        },
      });
  }

  /**
   * Carga rápidamente credenciales de prueba en el formulario.
   */
  cargarCredencial(login: string, pass: string): void {
    this.loginForm.patchValue({
      email: login,
      password: pass,
    });
    this.errorMessage = '';
  }
}
