import { Component, OnDestroy, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { ComidaDTO } from '../../../../dtos/comida.dto';
import { AdicionalCantidadDTO, CrearPedidoDTO, PedidoDTO } from '../../../../dtos/pedido.dto';
import { ItemCarritoDTO } from '../../../../dtos/carrito.dto';
import { PedidoService } from '../../../../service/pedido.service';
import { ClienteService } from '../../../../service/cliente.service';
import { CarritoService } from '../../../../service/carrito.service';
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
  private carritoService = inject(CarritoService);
  private subscription?: Subscription;

  // Signal Input
  comida = input<ComidaDTO>();

  cantidadProducto: number = 1;
  adicionalesSeleccionados: AdicionalCantidadDTO[] = [];

  pedidoCreado: PedidoDTO | null = null;
  agregadoAlCarrito: boolean = false;
  errorMessage: string = '';

  get esAdmin(): boolean {
    return this.clienteService.esAdmin();
  }

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

  agregarAlCarrito(c: ComidaDTO): void {
    if (!c.id) return;

    const subtotalComida = (c.precio || 0) * this.cantidadProducto;

    const adicsMapeados = this.adicionalesSeleccionados.map((item) => {
      const adicObj = c.adicionales?.find((a) => a.id === item.adicionalId);
      const nombre = adicObj?.nombre || `Adicional #${item.adicionalId}`;
      const precio = adicObj?.precio || 0;
      return {
        adicionalId: item.adicionalId,
        nombre,
        precio,
        cantidad: item.cantidad,
        subtotal: precio * item.cantidad,
      };
    });

    const subtotalAdics = adicsMapeados.reduce((sum, a) => sum + a.subtotal, 0);

    const itemCarrito: ItemCarritoDTO = {
      id: `${c.id}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      comidaId: c.id,
      comidaNombre: c.nombre,
      comidaPrecio: c.precio,
      categoriaNombre: c.categoriaNombre,
      imagenUrl: c.imagen_url,
      cantidad: this.cantidadProducto,
      adicionales: adicsMapeados,
      subtotalComida,
      subtotalAdicionales: subtotalAdics,
      subtotal: subtotalComida + subtotalAdics,
    };

    this.carritoService.agregarItem(itemCarrito);
    this.agregadoAlCarrito = true;
    this.pedidoCreado = null;
    this.errorMessage = '';
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
