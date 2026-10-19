import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CalaverasComponent } from '../../components/calaveras/calaveras.component';
import { HeroComponent } from './components/hero/hero.component';
import { NosotrosComponent } from './components/nosotros/nosotros.component';
import { MenuDestacadoComponent } from './components/menu-destacado/menu-destacado.component';
import { GaleriaComponent } from './components/galeria/galeria.component';
import { BannerCtaComponent } from './components/banner-cta/banner-cta.component';
import { UbicacionComponent } from './components/ubicacion/ubicacion.component';
import { ComidaDTO } from '../../dtos/comida.dto';
import { ComidaService } from '../../service/comida.service';

@Component({
  selector: 'app-landing-page',
  imports: [
    NavbarComponent,
    FooterComponent,
    CalaverasComponent,
    HeroComponent,
    NosotrosComponent,
    MenuDestacadoComponent,
    GaleriaComponent,
    BannerCtaComponent,
    UbicacionComponent,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent implements OnInit, OnDestroy {
  private comidaService = inject(ComidaService);
  private subscription?: Subscription;

  comidaArray: ComidaDTO[] = [];

  ngOnInit(): void {
    this.subscription = this.comidaService.getComidasActivas().subscribe({
      next: (comidas) => {
        this.comidaArray = comidas.slice(0, 4);
      },
      error: (err) => {
        console.error('Error al cargar comidas destacadas:', err);
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
