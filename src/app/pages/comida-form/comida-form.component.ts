import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CalaverasComponent } from '../../components/calaveras/calaveras.component';
import { ComidaDTO } from '../../dtos/comida.dto';
import { CategoriaDTO } from '../../dtos/categoria.dto';
import { AdicionalDTO } from '../../dtos/adicional.dto';
import { ComidaService } from '../../service/comida.service';
import { AdicionalService } from '../../service/adicional.service';

/**
 * Componente de formulario reactivo para la creación y edición de platos de comida.
 * Permite seleccionar dinámicamente los adicionales disponibles para el plato.
 */
@Component({
  selector: 'app-comida-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    DecimalPipe,
    NavbarComponent,
    FooterComponent,
    CalaverasComponent,
  ],
  templateUrl: './comida-form.component.html',
  styleUrl: './comida-form.component.css',
})
export class ComidaFormComponent implements OnInit, OnDestroy {
  private comidaService = inject(ComidaService);
  private adicionalService = inject(AdicionalService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private subscription: Subscription = new Subscription();

  comidaId: number | undefined = undefined;
  isEdit = false;
  categorias: CategoriaDTO[] = [];
  adicionalesList: AdicionalDTO[] = [];
  adicionalesSeleccionados: number[] = [];

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
    // 1. Cargar categorías para el selector
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

    // 2. Cargar todos los adicionales disponibles en el restaurante
    this.subscription.add(
      this.adicionalService.getAdicionales().subscribe({
        next: (adics) => {
          this.adicionalesList = adics;
        },
        error: (err) => {
          console.error('Error al cargar adicionales:', err);
        },
      })
    );

    // 3. Verificar si estamos en modo edición por el parámetro de ruta :id
    this.comidaId = Number(this.activatedRoute.snapshot.params['id']);

    if (this.comidaId) {
      this.isEdit = true;
      this.subscription.add(
        this.comidaService.getComidaConAdicionales(this.comidaId).subscribe({
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

              // Preseleccionar los adicionales asignados a este plato
              if (comida.adicionales && comida.adicionales.length > 0) {
                this.adicionalesSeleccionados = comida.adicionales
                  .map((a) => a.id)
                  .filter((id): id is number => id !== undefined);
              } else if (comida.adicionalesIds && comida.adicionalesIds.length > 0) {
                this.adicionalesSeleccionados = [...comida.adicionalesIds];
              }
            }
          },
          error: (err) => {
            console.error('Error al obtener comida con adicionales:', err);
          },
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Alterna la selección de un adicional por su ID en el arreglo de IDs seleccionados.
   */
  toggleAdicional(adicId?: number): void {
    if (!adicId) return;
    const index = this.adicionalesSeleccionados.indexOf(adicId);
    if (index > -1) {
      this.adicionalesSeleccionados.splice(index, 1);
    } else {
      this.adicionalesSeleccionados.push(adicId);
    }
  }

  /**
   * Retorna true si el adicional con el ID suministrado se encuentra seleccionado.
   */
  isAdicionalSelected(adicId?: number): boolean {
    return !!adicId && this.adicionalesSeleccionados.includes(adicId);
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
      adicionalesIds: this.adicionalesSeleccionados,
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
