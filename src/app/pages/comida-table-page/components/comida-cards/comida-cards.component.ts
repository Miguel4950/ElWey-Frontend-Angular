import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ComidaDTO } from '../../../../dtos/comida.dto';

/**
 * Subcomponente para la cuadrícula de tarjetas de menú gastronómico.
 */
@Component({
  selector: 'app-comida-cards',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './comida-cards.component.html',
  styleUrl: './comida-cards.component.css',
})
export class ComidaCardsComponent {
  comidas = input<ComidaDTO[]>([]);
}
