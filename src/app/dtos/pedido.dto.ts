/**
 * DTO para representar un adicional seleccionado dentro del detalle de un ítem de pedido.
 */
export interface AdicionalSeleccionadoDTO {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  subtotal: number;
}

/**
 * DTO para representar un ítem/línea de pedido (plato + adicionales).
 */
export interface ItemPedidoDTO {
  id?: number;
  comidaId: number;
  comidaNombre: string;
  categoriaNombre?: string;
  comidaPrecio: number;
  cantidad: number;
  cantidadAdicionales?: number;
  subtotalComida?: number;
  subtotalAdicionales?: number;
  subtotal?: number;
  adicionales: AdicionalSeleccionadoDTO[];
}

/**
 * DTO representativo del pedido en el restaurante.
 * Mapea los atributos enviados por el backend en PedidoController y PedidoDto.
 */
export interface PedidoDTO {
  id: number;
  estado: string;
  fechaCreacion: string;
  fechaEntrega?: string;
  clienteId?: number;
  clienteNombre: string;
  clienteCorreo?: string;
  clienteTelefono?: string;
  clienteDireccion?: string;
  domiciliarioId?: number;
  domiciliarioNombre?: string;
  domiciliarioCelular?: string;
  cantidadTotalProductos?: number;
  cantidadTotalAdicionales?: number;
  subtotalComida?: number;
  subtotalAdicionales?: number;
  total: number;
  items?: ItemPedidoDTO[];
}

/**
 * DTO para cambio de estado del pedido y asignación de repartidor.
 * Coincide con ActualizarEstadoPedidoDto del backend.
 */
export interface ActualizarEstadoPedidoDTO {
  estado: string;
  domiciliarioId?: number;
}

