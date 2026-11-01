// Adicional seleccionado en un plato
export interface AdicionalSeleccionado {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  subtotal: number;
}
export type AdicionalSeleccionadoDTO = AdicionalSeleccionado;

// Línea del pedido con plato y sus adicionales
export interface ItemPedido {
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
  adicionales: AdicionalSeleccionado[];
}
export type ItemPedidoDTO = ItemPedido;

// Pedido completo del cliente
export interface Pedido {
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
  items?: ItemPedido[];
}
export type PedidoDTO = Pedido;

// Para actualizar estado y asignar domiciliario
export interface ActualizarEstadoPedido {
  estado: string;
  domiciliarioId?: number;
}
export type ActualizarEstadoPedidoDTO = ActualizarEstadoPedido;
