import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CalaverasComponent } from '../../components/calaveras/calaveras.component';
import { LoginRolesComponent } from './components/login-roles/login-roles.component';
import { LoginCredencialesComponent } from './components/login-credenciales/login-credenciales.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { ClienteService } from '../../service/cliente.service';
import { LoginDTO } from '../../dtos/login.dto';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [

    NavbarComponent,
    FooterComponent,
    CalaverasComponent,
    LoginRolesComponent,
    LoginCredencialesComponent,
    LoginFormComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy {
  private clienteService = inject(ClienteService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private subscription?: Subscription;

  rolSeleccionado: 'cliente' | 'operador' | 'domiciliario' | 'admin' = 'cliente';

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
        if (
          rolParam === 'operador' ||
          rolParam === 'domiciliario' ||
          rolParam === 'admin' ||
          rolParam === 'cliente'
        ) {
          this.seleccionarRol(rolParam);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  seleccionarRol(rol: 'cliente' | 'operador' | 'domiciliario' | 'admin'): void {
    this.rolSeleccionado = rol;
    this.errorMessage = '';
    const emailControl = this.loginForm.get('email');

    if (rol === 'cliente') {
      emailControl?.setValidators([Validators.required, Validators.email]);
    } else {
      emailControl?.setValidators([Validators.required, Validators.minLength(3)]);
    }
    emailControl?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      if (this.rolSeleccionado === 'cliente') {
        this.errorMessage = 'Por favor ingresa un correo y contraseña válidos.';
      } else if (this.rolSeleccionado === 'domiciliario') {
        this.errorMessage = 'Por favor ingresa tu cédula o celular y tu contraseña.';
      } else {
        this.errorMessage = 'Por favor ingresa tu usuario o correo y tu contraseña.';
      }
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

          if (
            this.rolSeleccionado === 'operador' ||
            usuario.rol === 'OPERADOR'
          ) {
            this.router.navigate(['/pedidos']);
          } else if (
            this.rolSeleccionado === 'domiciliario' ||
            usuario.rol === 'DOMICILIARIO'
          ) {
            this.router.navigate(['/domiciliario/pedidos']);
          } else if (this.rolSeleccionado === 'admin' || usuario.rol === 'ADMIN') {
            this.router.navigate(['/comidas/tabla']);
          } else {
            this.router.navigate(['/comidas/tarjetas']);
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

  cargarCredencial(login: string, pass: string): void {
    this.loginForm.patchValue({
      email: login,
      password: pass,
    });
    this.errorMessage = '';
  }
}
