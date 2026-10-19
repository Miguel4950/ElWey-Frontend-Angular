import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CalaverasComponent } from '../../components/calaveras/calaveras.component';
import { ClienteService } from '../../service/cliente.service';
import { LoginDTO } from '../../dtos/login.dto';
import { ClienteDTO } from '../../dtos/cliente.dto';

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

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

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
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage = 'Por favor ingresa un correo y contraseña válidos.';
      return;
    }

    const credenciales: LoginDTO = {
      correo: this.loginForm.value.email ?? '',
      contrasena: this.loginForm.value.password ?? '',
    };

    this.subscription = this.clienteService.autenticar(credenciales).subscribe({
      next: (cliente) => {
        this.clienteService.setClienteActual(cliente);
        this.errorMessage = '';
        if (this.clienteService.esOperador()) {
          this.router.navigate(['/pedidos']);
        } else {
          this.router.navigate(['/cliente/portal']);
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.mensaje || 'Error de conexión. Por favor, intenta nuevamente.';
      },
    });
  }

  cargarCredencial(email: string, pass: string): void {
    this.loginForm.patchValue({
      email: email,
      password: pass,
    });
    this.errorMessage = '';
  }
}
