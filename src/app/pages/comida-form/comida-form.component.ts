import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CalaverasComponent } from '../../components/calaveras/calaveras.component';
import { ComidaDTO } from '../../dtos/comida.dto';
import { CategoriaDTO } from '../../dtos/categoria.dto';
import { ComidaService } from '../../service/comida.service';

@Component({
  selector: 'app-comida-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NavbarComponent,
    FooterComponent,
    CalaverasComponent,
  ],
  templateUrl: './comida-form.component.html',
  styleUrl: './comida-form.component.css',
})
export class ComidaFormComponent implements OnInit, OnDestroy {
  // Inyección de dependencias funcional idéntica al código del profesor
  private comidaService = inject(ComidaService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private subscription: Subscription = new Subscription();

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  comidaId: number | undefined = undefined;
  isEdit = false;
  categorias: CategoriaDTO[] = [];

  comidaForm = new FormGroup({
    nombre: new FormControl('', [
      Validators.required,
      Validators.maxLength(80),
    ]),
    precio: new FormControl('', [
      Validators.required,
      Validators.min(0),
      Validators.pattern(/^[0-9]+$/),
    ]),
    descripcion: new FormControl('', [
      Validators.required,
      Validators.maxLength(255),
    ]),
    categoriaId: new FormControl('', [Validators.required]),
    etiqueta: new FormControl('Estrella', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50),
    ]),
    imagen_url: new FormControl('', [
      Validators.required,
      Validators.pattern(
        /^(https?:\/\/[\w\-]+(\.[\w\-]+)*(:\d+)?(\/[^\s]*)?|\/[a-zA-Z0-9_\-\.\/]+)$/i,
      ),
    ]),
    activo: new FormControl(true, [Validators.required]),
  });

  ngOnInit(): void {
    this.subscription.add(
      this.comidaService.getCategorias().subscribe({
        next: (cats) => {
          this.categorias = cats;
        },
        error: (err) => {
          console.error('Error al cargar categorías:', err);
        },
      })
    );

    this.comidaId = Number(this.activatedRoute.snapshot.params['id']);

    if (this.comidaId) {
      this.isEdit = true;
      this.subscription.add(
        this.comidaService.getComidaById(this.comidaId).subscribe({
          next: (comida) => {
            if (comida) {
              this.comidaForm.patchValue({
                nombre: comida.nombre,
                precio: comida.precio.toString(),
                descripcion: comida.descripcion,
                categoriaId: comida.categoriaId ? comida.categoriaId.toString() : '1',
                etiqueta: comida.etiqueta,
                imagen_url: comida.imagen_url,
                activo: comida.activo,
              });
            }
          },
          error: (err) => {
            console.error('Error al obtener comida para edición:', err);
          },
        })
      );
    }
  }

  handleSubmit(): void {
    if (!this.comidaForm.valid) {
      this.comidaForm.markAllAsTouched();
      return;
    }

    const val = this.comidaForm.value;
    const cat =
      this.categorias.find((c) => c.id === Number(val.categoriaId)) ||
      this.categorias[0];

    const plato: ComidaDTO = {
      id: this.isEdit && this.comidaId ? this.comidaId : 0,
      nombre: val.nombre ?? 'Plato Desconocido',
      precio: Number(val.precio),
      descripcion: val.descripcion ?? '',
      imagen_url:
        val.imagen_url && val.imagen_url.trim() !== ''
          ? val.imagen_url
          : 'https://images.unsplash.com/photo-1648437595587-e6a8b0cdf1f9?w=600&h=400&fit=crop',
      etiqueta: val.etiqueta ?? 'Estrella',
      activo: val.activo ?? true,
      categoriaId: cat ? cat.id : 1,
      categoriaNombre: cat ? cat.nombre : 'General',
    };

    if (this.isEdit && this.comidaId) {
      this.subscription.add(
        this.comidaService.updateComida(this.comidaId, plato).subscribe({
          next: () => {
            this.router.navigate(['/comidas']);
          },
          error: (err) => {
            console.error('Error al actualizar comida:', err);
          },
        })
      );
    } else {
      this.subscription.add(
        this.comidaService.addComida(plato).subscribe({
          next: () => {
            this.router.navigate(['/comidas']);
          },
          error: (err) => {
            console.error('Error al crear comida:', err);
          },
        })
      );
    }
  }
}
