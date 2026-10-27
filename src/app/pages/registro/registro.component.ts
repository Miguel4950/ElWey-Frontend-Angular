import { Component, OnDestroy, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CalaverasComponent } from '../../components/calaveras/calaveras.component';
import { ClienteService } from '../../service/cliente.service';
import { ClienteDTO } from '../../dtos/cliente.dto';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NavbarComponent,
    FooterComponent,
    CalaverasComponent,
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export class RegistroComponent implements OnDestroy {
  private clienteService = inject(ClienteService);
  private router = inject(Router);
  private subscription?: Subscription;

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  errorMessage: string = '';

  registroForm = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(2)]),
    apellido: new FormControl('', [Validators.required, Validators.minLength(2)]),
    correo: new FormControl('', [Validators.required, Validators.email]),
    contrasena: new FormControl('', [Validators.required, Validators.minLength(4)]),
    telefono: new FormControl('', [Validators.required]),
    direccion: new FormControl('', [Validators.required]),
  });

  onSubmit(): void {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      this.errorMessage = 'Por favor completa todos los campos obligatorios correctamente.';
      return;
    }

    const { nombre, apellido, correo, contrasena, telefono, direccion } = this.registroForm.value;
    const emailLimpio = (correo ?? '').trim().toLowerCase();

    const nuevoCliente: ClienteDTO = {
      nombre: nombre!.trim(),
      apellido: apellido!.trim(),
      correo: emailLimpio,
      contrasena: contrasena!,
      telefono: telefono!.trim(),
      direccion: direccion!.trim(),
      activo: true,
    };

    this.subscription = this.clienteService.addCliente(nuevoCliente).subscribe({
      next: (clienteRegistrado) => {
        this.clienteService.setClienteActual({ ...clienteRegistrado, rol: 'CLIENTE' });
        this.router.navigate(['/cliente/portal'], { queryParams: { bienvenido: 'true' } });
      },
      error: (err) => {
        this.errorMessage = err?.error?.mensaje || 'No fue posible registrar la cuenta. Es posible que el correo ya esté registrado o haya un error en el servidor.';
      },
    });
  }
}
