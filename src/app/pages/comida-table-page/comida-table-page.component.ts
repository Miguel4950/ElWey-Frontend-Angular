import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CalaverasComponent } from '../../components/calaveras/calaveras.component';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { ComidaTableComponent } from './components/comida-table/comida-table.component';
import { ComidaCardsComponent } from './components/comida-cards/comida-cards.component';
import { ComidaDTO } from '../../dtos/comida.dto';
import { ComidaService } from '../../service/comida.service';
import { ClienteService } from '../../service/cliente.service';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';

/**
 * Página principal del catálogo de comidas.
 * Soporta dos modos visuales divididos en subcomponentes:
 * - ComidaTableComponent: Vista de inventario tabular (personal staff / admin / operadores / domiciliarios).
 * - ComidaCardsComponent: Vista en cuadrícula de tarjetas de menú gastronómico para clientes y público general.
 */
@Component({
  selector: 'app-comida-table-page',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    CalaverasComponent,
    PageTitleComponent,
    ComidaTableComponent,
    ComidaCardsComponent,
    RouterLink,
  ],
  templateUrl: './comida-table-page.component.html',
  styleUrl: './comida-table-page.component.css',
})
export class ComidaTablePageComponent implements OnInit, OnDestroy {
  private comidaService = inject(ComidaService);
  private clienteService = inject(ClienteService);
  private router = inject(Router);
  private subscription: Subscription = new Subscription();

  get esAdmin(): boolean {
    return this.clienteService.esAdmin();
  }

  get esPersonal(): boolean {
    return (
      this.clienteService.esAdmin() ||
      this.clienteService.esOperador() ||
      this.clienteService.esDomiciliario()
    );
  }

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
    this.evaluarRuta();
    this.cargarComidas();

    this.subscription.add(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          this.evaluarRuta();
        })
    );
  }

  evaluarRuta(): void {
    const url = this.router.url;
    this.esVistaTarjetas = url.includes('tarjetas');
    const cliente = this.clienteService.getClienteActual();
    // Si un cliente común autenticado intenta entrar a la tabla, redirigir a tarjetas
    if (!this.esVistaTarjetas && cliente && !this.esPersonal) {
      this.router.navigate(['/comidas/tarjetas']);
    }
  }

  cargarComidas(): void {
    this.errorMessage = '';
    this.subscription.add(
      this.comidaService.getComidasActivas().subscribe({
        next: (comidas: ComidaDTO[]) => {
          this.comidaArray = comidas;
        },
        error: (err: any) => {
          console.error('Error al cargar comidas:', err);
          this.errorMessage = 'No se pudieron consultar los platos desde el servidor.';
        },
      })
    );
  }

  seleccionarCategoria(cat: string): void {
    this.filtroCategoria = cat;
  }

  onBuscar(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.busqueda = input.value;
  }

  get contarEstrellas(): number {
    return this.comidaArray.filter((c) => this.esPlatoEstrella(c)).length;
  }

  get contarVegetarianos(): number {
    return this.comidaArray.filter((c) => this.esPlatoVegetariano(c)).length;
  }

  contarPorCategoria(cat: string): number {
    return this.comidaArray.filter(
      (c) => c.categoriaNombre?.toLowerCase() === cat.toLowerCase()
    ).length;
  }

  esPlatoEstrella(c: ComidaDTO): boolean {
    const et = (c.etiqueta || '').toLowerCase();
    return (
      et.includes('estrella') ||
      et.includes('top') ||
      et.includes('favorito') ||
      et.includes('recomendado')
    );
  }

  esPlatoVegetariano(c: ComidaDTO): boolean {
    const et = (c.etiqueta || '').toLowerCase();
    const nom = (c.nombre || '').toLowerCase();
    return (
      et.includes('vegano') ||
      et.includes('vegetariano') ||
      et.includes('saludable') ||
      nom.includes('vegetariano') ||
      nom.includes('guacamole') ||
      nom.includes('calabaza') ||
      nom.includes('champiñon')
    );
  }

  get comidasFiltradas(): ComidaDTO[] {
    return this.comidaArray.filter((c) => {
      let matchCat = true;
      if (this.filtroCategoria === 'estrella') {
        matchCat = this.esPlatoEstrella(c);
      } else if (this.filtroCategoria === 'vegetariano') {
        matchCat = this.esPlatoVegetariano(c);
      } else if (this.filtroCategoria) {
        matchCat = Boolean(
          c.categoriaNombre &&
            c.categoriaNombre.toLowerCase() === this.filtroCategoria.toLowerCase()
        );
      }

      const matchBusqueda =
        !this.busqueda ||
        c.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        c.descripcion.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        (c.etiqueta && c.etiqueta.toLowerCase().includes(this.busqueda.toLowerCase()));

      return matchCat && matchBusqueda;
    });
  }

  eliminarComida(comida: ComidaDTO): void {
    if (!comida.id) return;

    this.errorMessage = '';
    this.subscription.add(
      this.comidaService.eliminarComida(comida.id).subscribe({
        next: () => {
          this.cargarComidas();
        },
        error: (err: any) => {
          console.error('Error al eliminar comida en backend:', err);
          this.errorMessage =
            err?.error?.mensaje ||
            'No es posible eliminar el plato porque tiene registros o pedidos asociados en el restaurante.';
        },
      })
    );
  }
}
