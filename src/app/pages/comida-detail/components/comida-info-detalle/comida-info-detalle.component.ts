import { Component, OnInit, OnDestroy, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { ComidaDTO } from '../../../../dtos/comida.dto';
import { AdicionalDTO } from '../../../../dtos/adicional.dto';
import { AdicionalCantidadDTO, CrearPedidoDTO, ItemCrearPedidoDTO } from '../../../../dtos/crear-pedido.dto';
import { PedidoDTO } from '../../../../dtos/pedido.dto';
import { ItemCarritoDTO } from '../../../../dtos/carrito.dto';
import { PedidoService } from '../../../../service/pedido.service';
import { ClienteService } from '../../../../service/cliente.service';
import { CarritoService } from '../../../../service/carrito.service';
import { ComidaService } from '../../../../service/comida.service';
import { ComidaAdicionalesComponent } from '../comida-adicionales/comida-adicionales.component';

@Component({
  selector: 'app-comida-info-detalle, app-col-info-detalle',
  imports: [RouterLink, DecimalPipe, ComidaAdicionalesComponent],
  templateUrl: './comida-info-detalle.component.html',
  styleUrl: './comida-info-detalle.component.css',
})
export class ComidaInfoDetalleComponent implements OnInit, OnDestroy {
  private pedidoService = inject(PedidoService);
  private clienteService = inject(ClienteService);
  private carritoService = inject(CarritoService);
  private comidaService = inject(ComidaService);
  private subsBebidas?: Subscription;
  bebidasDisponibles: ComidaDTO[] = [];
  bebidaSeleccionada: ComidaDTO | null = null;
  private subscription?: Subscription;

  // Signal Inputs independientes (ComidaDTO y AdicionalDTO[])
  comida = input<ComidaDTO>();
  adicionales = input<AdicionalDTO[]>([]);

  cantidadProducto: number = 1;
  // Control reactivo del pop-up modal (Angular Way con @if + Bootstrap 5)
  isModalOpen: boolean = false;
  elementoSeleccionado: ComidaDTO | null = null;
  adicionalesSeleccionados: AdicionalCantidadDTO[] = [];

  pedidoCreado: PedidoDTO | null = null;
  agregadoAlCarrito: boolean = false;
  errorMessage: string = '';

  ngOnInit(): void {
    this.subsBebidas = this.comidaService.getComidasActivas().subscribe({
      next: (comidas) => {
        this.bebidasDisponibles = comidas.filter(
          (c) => (c.categoriaNombre || '').toLowerCase() === 'bebidas'
        );
      },
      error: (err) => console.error('Error al cargar bebidas recomendadas:', err),
    });
  }

  toggleBebida(b: ComidaDTO): void {
    if (this.bebidaSeleccionada?.id === b.id) {
      this.bebidaSeleccionada = null;
    } else {
      this.bebidaSeleccionada = b;
    }
  }

  get esBebida(): boolean {
    return (this.comida()?.categoriaNombre || '').toLowerCase() === 'bebidas';
  }

  get esAdmin(): boolean {
    return this.clienteService.esAdmin();
  }

  get subtotalAcumulado(): number {
    const plato = this.comida();
    if (!plato) return 0;
    const listaAdicionales = this.adicionales() || [];
    const subtotalPlato = (plato.precio || 0) * this.cantidadProducto;
    const subtotalAdicsPorcion = this.adicionalesSeleccionados.reduce((sum, item) => {
      const adicObj = listaAdicionales.find((a) => a.id === item.adicionalId);
      const precio = adicObj?.precio || 0;
      return sum + precio * item.cantidad;
    }, 0);
    const subtotalBebida = this.bebidaSeleccionada ? (this.bebidaSeleccionada.precio || 0) : 0;
    return subtotalPlato + subtotalAdicsPorcion * this.cantidadProducto + subtotalBebida;
  }

  get totalAdicionalesCantidad(): number {
    return this.adicionalesSeleccionados.reduce(
      (sum, item) => sum + item.cantidad * this.cantidadProducto,
      0
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.subsBebidas?.unsubscribe();
  }

  actualizarCantidadProducto(event: Event): void {
    const input = event.target as HTMLInputElement;
    const valor = Number(input.value);
    this.cantidadProducto = valor > 0 ? valor : 1;
  }

  abrirModal(c: ComidaDTO): void {
    this.elementoSeleccionado = c;
    this.isModalOpen = true;
  }

  cerrarModal(): void {
    this.isModalOpen = false;
    this.elementoSeleccionado = null;
  }

  confirmarPedidoDirecto(): void {
    if (!this.elementoSeleccionado) return;
    const plato = this.elementoSeleccionado;
    this.cerrarModal();
    this.ordenarPedido(plato);
  }

  onAdicionalesChange(seleccionados: AdicionalCantidadDTO[]): void {
    this.adicionalesSeleccionados = seleccionados;
  }

  agregarAlCarrito(c: ComidaDTO): void {
    if (!c.id) return;

    const listaAdicionales = this.adicionales() || [];
    const subtotalComida = (c.precio || 0) * this.cantidadProducto;

    const adicsMapeados = this.adicionalesSeleccionados.map((item) => {
      const adicObj = listaAdicionales.find((a) => a.id === item.adicionalId);
      const nombre = adicObj?.nombre || `Adicional #${item.adicionalId}`;
      const precio = adicObj?.precio || 0;
      return {
        adicionalId: item.adicionalId,
        nombre,
        precio,
        cantidad: item.cantidad,
        subtotal: precio * item.cantidad * this.cantidadProducto,
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

    if (this.bebidaSeleccionada && this.bebidaSeleccionada.id) {
      const b = this.bebidaSeleccionada;
      const itemBebida: ItemCarritoDTO = {
        id: `${b.id}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        comidaId: b.id!,
        comidaNombre: b.nombre,
        comidaPrecio: b.precio,
        categoriaNombre: b.categoriaNombre,
        imagenUrl: b.imagen_url,
        cantidad: 1,
        adicionales: [],
        subtotalComida: b.precio || 0,
        subtotalAdicionales: 0,
        subtotal: b.precio || 0,
      };
      this.carritoService.agregarItem(itemBebida);
    }
    this.agregadoAlCarrito = true;
    this.pedidoCreado = null;
    this.errorMessage = "";
  }

  ordenarPedido(c: ComidaDTO): void {
    if (!c.id) return;

    const clienteId = this.clienteService.getClienteActual()?.id;
    if (clienteId == null) {
      this.errorMessage = 'Debes iniciar sesión para confirmar tu pedido.';
      return;
    }

    this.errorMessage = '';
    this.pedidoCreado = null;

    const itemsPedido: ItemCrearPedidoDTO[] = [
      {
        comidaId: c.id,
        cantidad: this.cantidadProducto,
        adicionales: this.adicionalesSeleccionados.map((item) => ({
          adicionalId: item.adicionalId,
          cantidad: item.cantidad,
        })),
      },
    ];

    if (this.bebidaSeleccionada && this.bebidaSeleccionada.id) {
      itemsPedido.push({
        comidaId: this.bebidaSeleccionada.id!,
        cantidad: 1,
        adicionales: [],
      });
    }

    const nuevoPedido: CrearPedidoDTO = {
      clienteId,
      items: itemsPedido,
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
