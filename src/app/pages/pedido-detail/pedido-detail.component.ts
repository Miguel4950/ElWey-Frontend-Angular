import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CalaverasComponent } from '../../components/calaveras/calaveras.component';
import { PedidoDTO } from '../../dtos/pedido.dto';
import { PedidoService } from '../../service/pedido.service';

@Component({
  selector: 'app-pedido-detail',
  imports: [
    RouterLink,
    DecimalPipe,
    NavbarComponent,
    FooterComponent,
    CalaverasComponent,
  ],
  templateUrl: './pedido-detail.component.html',
  styleUrl: './pedido-detail.component.css',
})
export class PedidoDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private pedidoService = inject(PedidoService);
  private subscription?: Subscription;

  pedidoId = -1;
  pedido: PedidoDTO | undefined;

  ngOnInit(): void {
    this.pedidoId = Number(this.route.snapshot.params['id']);
    if (this.pedidoId) {
      this.subscription = this.pedidoService.getPedidoById(this.pedidoId).subscribe({
        next: (pedido) => {
          this.pedido = pedido;
        },
        error: (err) => {
          console.error('Error al obtener el detalle del pedido:', err);
          this.pedido = undefined;
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
