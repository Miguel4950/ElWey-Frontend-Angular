import { DecimalPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CalaverasComponent } from '../../components/calaveras/calaveras.component';
import { AdicionalDTO } from '../../dtos/adicional.dto';
import { CategoriaDTO } from '../../dtos/categoria.dto';
import { AdicionalService } from '../../service/adicional.service';
import { ClienteService } from '../../service/cliente.service';
import { ComidaService } from '../../service/comida.service';

@Component({
  selector: 'app-categorias-adicionales-page',
  imports: [DecimalPipe, NavbarComponent, FooterComponent, CalaverasComponent],
  templateUrl: './categorias-adicionales-page.component.html',
  styleUrl: './categorias-adicionales-page.component.css',
})
export class CategoriasAdicionalesPageComponent implements OnInit, OnDestroy {
  private adicionalService = inject(AdicionalService);
  private comidaService = inject(ComidaService);
  private clienteService = inject(ClienteService);
  private router = inject(Router);
  private subscription = new Subscription();

  categorias: CategoriaDTO[] = [];
  adicionales: AdicionalDTO[] = [];
  adicionalesSeleccionados = new Set<number>();
  categoriaSeleccionadaId: number | null = null;
  cargando = false;
  guardando = false;
  mensajeExito = '';
  errorMessage = '';

  get esAdmin(): boolean {
    return this.clienteService.esAdmin();
  }

  get categoriaSeleccionada(): CategoriaDTO | undefined {
    return this.categorias.find((categoria) => categoria.id === this.categoriaSeleccionadaId);
  }

  ngOnInit(): void {
    if (!this.esAdmin) {
      this.router.navigate(['/']);
      return;
    }

    this.cargarDatos();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  cargarDatos(): void {
    this.cargando = true;
    this.errorMessage = '';
    this.subscription.add(
      forkJoin({
        categorias: this.comidaService.getCategorias(),
        adicionales: this.adicionalService.getAdicionales(),
      }).subscribe({
        next: ({ categorias, adicionales }) => {
          this.categorias = categorias;
          this.adicionales = adicionales;

          if (!this.categorias.some((categoria) => categoria.id === this.categoriaSeleccionadaId)) {
            this.categoriaSeleccionadaId = null;
          }

          this.sincronizarSeleccion();
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error al cargar categorías y adicionales:', err);
          this.errorMessage = 'No se pudieron cargar las categorías y los adicionales.';
          this.cargando = false;
        },
      })
    );
  }

  cambiarCategoria(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.categoriaSeleccionadaId = value ? Number(value) : null;
    this.mensajeExito = '';
    this.errorMessage = '';
    this.sincronizarSeleccion();
  }

  cambiarSeleccion(adicionalId: number | undefined, event: Event): void {
    if (adicionalId === undefined) return;

    const seleccionado = (event.target as HTMLInputElement).checked;
    if (seleccionado) {
      this.adicionalesSeleccionados.add(adicionalId);
    } else {
      this.adicionalesSeleccionados.delete(adicionalId);
    }
    this.mensajeExito = '';
    this.errorMessage = '';
  }

  estaSeleccionado(adicionalId: number | undefined): boolean {
    return adicionalId !== undefined && this.adicionalesSeleccionados.has(adicionalId);
  }

  guardarAsignaciones(): void {
    if (this.categoriaSeleccionadaId === null || this.guardando) return;

    const asignaciones = this.adicionales
      .filter((adicional): adicional is AdicionalDTO & { id: number } => adicional.id !== undefined)
      .map((adicional) => ({
        id: adicional.id,
        seleccionado: this.adicionalesSeleccionados.has(adicional.id),
      }));

    this.guardando = true;
    this.mensajeExito = '';
    this.errorMessage = '';
    const categoriaId = this.categoriaSeleccionadaId;
    this.subscription.add(
      this.adicionalService.guardarAdicionalesPorCategoria(categoriaId, asignaciones).subscribe({
        next: () => {
          this.mensajeExito = `Se guardaron las asignaciones de ${this.adicionalesSeleccionados.size} adicionales para la categoría "${this.categoriaSeleccionada?.nombre}".`;
          this.cargarDatos();
          this.guardando = false;
        },
        error: (err) => {
          console.error('Error al guardar las categorías de los adicionales:', err);
          this.errorMessage =
            'No se pudieron guardar las asignaciones. Inténtalo de nuevo.';
          this.guardando = false;
        },
      })
    );
  }

  private sincronizarSeleccion(): void {
    this.adicionalesSeleccionados = new Set(
      this.adicionales
        .filter((adicional) => adicional.categoriaId === this.categoriaSeleccionadaId)
        .map((adicional) => adicional.id)
        .filter((id): id is number => id !== undefined)
    );
  }
}
