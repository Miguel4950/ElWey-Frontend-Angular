import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CalaverasComponent } from '../../components/calaveras/calaveras.component';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { ComidaTableComponent } from './components/comida-table/comida-table.component';
import { ComidaDTO } from '../../dtos/comida.dto';
import { ComidaService } from '../../service/comida.service';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-comida-table-page',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    CalaverasComponent,
    PageTitleComponent,
    ComidaTableComponent,
    RouterLink,
    DecimalPipe,
  ],
  templateUrl: './comida-table-page.component.html',
  styleUrl: './comida-table-page.component.css',
})
export class ComidaTablePageComponent implements OnInit, OnDestroy {
  private comidaService = inject(ComidaService);
  private router = inject(Router);
  private subscription: Subscription = new Subscription();

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  title: string = 'Gestión de Comidas';
  username: string = '';
  comidaArray: ComidaDTO[] = [];
  esVistaTarjetas: boolean = false;
  filtroCategoria: string = '';
  busqueda: string = '';
  errorMessage: string = '';

  ngOnInit(): void {
    this.detectarVista();
    this.cargarComidas();

    this.subscription.add(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          const vistaAnterior = this.esVistaTarjetas;
          this.detectarVista();
          if (vistaAnterior !== this.esVistaTarjetas) {
            this.cargarComidas();
          }
        })
    );
  }

  cargarComidas(): void {
    const peticion$ = this.esVistaTarjetas
      ? this.comidaService.getComidasActivas()
      : this.comidaService.getComidas();

    this.subscription.add(
      peticion$.subscribe({
        next: (comidas) => {
          this.comidaArray = comidas;
        },
        error: (err) => {
          console.error('Error al cargar comidas desde el backend:', err);
        },
      })
    );
  }

  detectarVista(): void {
    this.esVistaTarjetas = this.router.url.includes('tarjetas');
  }

  seleccionarCategoria(cat: string): void {
    this.filtroCategoria = cat;
  }

  onBuscar(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.busqueda = input.value;
  }

  get comidasFiltradas(): ComidaDTO[] {
    return this.comidaArray.filter((item) => {
      const matchCat =
        !this.filtroCategoria ||
        (item.categoriaNombre &&
          item.categoriaNombre.toLowerCase() ===
          this.filtroCategoria.toLowerCase());
      const matchText =
        !this.busqueda ||
        item.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        item.descripcion.toLowerCase().includes(this.busqueda.toLowerCase());
      return matchCat && matchText;
    });
  }

  eliminarComida(comida: ComidaDTO): void {
    if (comida.id) {
      this.errorMessage = '';
      this.subscription.add(
        this.comidaService.eliminarComida(comida.id).subscribe({
          next: () => {
            this.errorMessage = '';
            this.cargarComidas();
          },
          error: (err) => {
            console.error('Error al eliminar comida:', err);
            this.errorMessage =
              err?.error?.mensaje || 'Error al eliminar el plato. Por favor, intenta de nuevo.';
          },
        })
      );
    }
  }
}
