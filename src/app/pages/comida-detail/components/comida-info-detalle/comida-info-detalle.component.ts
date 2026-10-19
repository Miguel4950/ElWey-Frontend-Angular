import { Component, OnDestroy, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { ComidaDTO } from '../../../../dtos/comida.dto';
import { AdicionalCantidadDTO, CrearPedidoDTO, PedidoDTO } from '../../../../dtos/pedido.dto';
import { PedidoService } from '../../../../service/pedido.service';
import { ClienteService } from '../../../../service/cliente.service';
import { ComidaAdicionalesComponent } from '../comida-adicionales/comida-adicionales.component';

@Component({
  selector: 'app-comida-info-detalle, app-col-info-detalle',
  imports: [RouterLink, DecimalPipe, ComidaAdicionalesComponent],
  templateUrl: './comida-info-detalle.component.html',
  styleUrl: './comida-info-detalle.component.css',
})
export class ComidaInfoDetalleComponent implements OnDestroy {
  private pedidoService = inject(PedidoService);
  private clienteService = inject(ClienteService);
  private subscription?: Subscription;

  // Signal Input
  comida = input<ComidaDTO>();

  cantidadProducto: number = 1;
  adicionalesSeleccionados: AdicionalCantidadDTO[] = [];

  pedidoCreado: PedidoDTO | null = null;
  errorMessage: string = '';

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  actualizarCantidadProducto(event: Event): void {
    const input = event.target as HTMLInputElement;
    const valor = Number(input.value);
    this.cantidadProducto = valor > 0 ? valor : 1;
  }

  onAdicionalesChange(seleccionados: AdicionalCantidadDTO[]): void {
    this.adicionalesSeleccionados = seleccionados;
  }

  ordenarPedido(c: ComidaDTO): void {
    if (!c.id) return;

    this.errorMessage = '';
    this.pedidoCreado = null;

    const nuevoPedido: CrearPedidoDTO = {
      comidaId: c.id,
      cantidad: this.cantidadProducto,
      adicionales: this.adicionalesSeleccionados,
      clienteId: this.clienteService.getClienteActual()?.id,
    };

    this.subscription = this.pedidoService.crearPedido(nuevoPedido).subscribe({
      next: (pedido) => {
        this.pedidoCreado = pedido;
      },
      error: (err) => {
        console.error('Error al crear el pedido:', err);
        this.errorMessage =
          err?.error?.mensaje || 'No se pudo registrar el pedido. Intenta nuevamente.';
      },
    });
  }
}
