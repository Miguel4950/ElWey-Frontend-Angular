import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CalaverasComponent } from '../../components/calaveras/calaveras.component';
import { ComidaDTO } from '../../dtos/comida.dto';
import { ComidaService } from '../../service/comida.service';
import { ComidaInfoDetalleComponent } from './components/comida-info-detalle/comida-info-detalle.component';

/**
 * Página para visualizar el detalle completo de un plato y seleccionar sus adicionales.
 * Utiliza RxJS mergeMap para consultar el plato y sus adicionales disponibles sin anidar subscribe.
 */
@Component({
  selector: 'app-comida-detail',
  imports: [
    RouterLink,
    NavbarComponent,
    FooterComponent,
    CalaverasComponent,
    ComidaInfoDetalleComponent,
  ],
  templateUrl: './comida-detail.component.html',
  styleUrl: './comida-detail.component.css',
})
export class ComidaDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private comidaService = inject(ComidaService);
  private subscription?: Subscription;

  comidaId = -1;
  comida: ComidaDTO | undefined;

  ngOnInit(): void {
    // 1. Obtener el ID del plato desde los parámetros de la URL
    this.comidaId = Number(this.route.snapshot.params['id']);

    // 2. Encadenar la consulta de la comida y sus adicionales con RxJS mergeMap
    if (this.comidaId) {
      this.subscription = this.comidaService.getComidaConAdicionales(this.comidaId).subscribe({
        next: (comida) => {
          this.comida = comida;
        },
        error: (err) => {
          console.error('Error al obtener detalle de comida con adicionales:', err);
          this.comida = undefined;
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
