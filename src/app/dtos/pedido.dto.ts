export interface AdicionalCantidadDTO {
  adicionalId: number;
  cantidad: number;
}

export interface AdicionalSeleccionadoDTO {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  subtotal: number;
}

export interface ItemPedidoDTO {
  id?: number;
  comidaId: number;
  comidaNombre: string;
  categoriaNombre?: string;
  comidaPrecio: number;
  cantidad: number;
  cantidadAdicionales: number;
  subtotalComida: number;
  subtotalAdicionales: number;
  subtotal: number;
  adicionales: AdicionalSeleccionadoDTO[];
}

export interface PedidoDTO {
  id: number;
  estado: string;
  fechaCreacion: string;
  clienteId?: number;
  clienteNombre: string;
  clienteCorreo?: string;
  clienteTelefono?: string;
  clienteDireccion?: string;
  domiciliarioNombre?: string;
  domiciliarioCelular?: string;
  cantidadTotalProductos: number;
  cantidadTotalAdicionales: number;
  subtotalComida: number;
  subtotalAdicionales: number;
  total: number;
  items: ItemPedidoDTO[];
}

export interface ItemCrearPedidoDTO {
  comidaId: number;
  cantidad: number;
  adicionales: AdicionalCantidadDTO[];
}

export interface CrearPedidoDTO {
  comidaId?: number;
  cantidad?: number;
  adicionales?: AdicionalCantidadDTO[];
  clienteId?: number;
  items?: ItemCrearPedidoDTO[];
}
