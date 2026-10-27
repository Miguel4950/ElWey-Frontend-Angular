import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CalaverasComponent } from '../../components/calaveras/calaveras.component';
import { ComidaDTO } from '../../dtos/comida.dto';
import { AdicionalDTO } from '../../dtos/adicional.dto';
import { ComidaService } from '../../service/comida.service';
import { AdicionalService } from '../../service/adicional.service';
import { ComidaInfoDetalleComponent } from './components/comida-info-detalle/comida-info-detalle.component';

/**
 * Página para visualizar el detalle completo de un plato y seleccionar sus adicionales.
 * Realiza 2 consultas independientes al backend: una para el ComidaDTO y otra para AdicionalDTO[].
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
  private adicionalService = inject(AdicionalService);
  private subscription: Subscription = new Subscription();

  comidaId = -1;
  comida: ComidaDTO | undefined;
  adicionalesDisponibles: AdicionalDTO[] = [];

  ngOnInit(): void {
    // 1. Obtener el ID del plato desde los parámetros de la URL
    this.comidaId = Number(this.route.snapshot.params['id']);

    if (this.comidaId) {
      // Consulta 1: Obtener la información plana del plato (ComidaDTO)
      this.subscription.add(
        this.comidaService.getComidaById(this.comidaId).subscribe({
          next: (comida) => {
            this.comida = comida;
          },
          error: (err) => {
            console.error('Error al obtener detalle de comida:', err);
            this.comida = undefined;
          },
        })
      );

      // Consulta 2: Obtener los adicionales disponibles para este plato (AdicionalDTO[])
      this.subscription.add(
        this.adicionalService.getAdicionalesByComidaId(this.comidaId).subscribe({
          next: (adicionales) => {
            this.adicionalesDisponibles = adicionales;
          },
          error: (err) => {
            console.error('Error al obtener adicionales de la comida:', err);
            this.adicionalesDisponibles = [];
          },
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
