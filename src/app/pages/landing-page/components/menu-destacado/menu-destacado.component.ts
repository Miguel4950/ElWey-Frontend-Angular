import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ComidaDTO } from '../../../../dtos/comida.dto';

@Component({
  selector: 'app-menu-destacado',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './menu-destacado.component.html',
  styleUrl: './menu-destacado.component.css',
})
export class MenuDestacadoComponent {

  comidaArray = input<ComidaDTO[]>();

}
