export interface AdicionalCantidad {
  adicionalId: number;
  cantidad: number;
}
export type AdicionalCantidadDTO = AdicionalCantidad;

export interface ItemCrearPedido {
  comidaId: number;
  cantidad: number;
  adicionales: AdicionalCantidad[];
}
export type ItemCrearPedidoDTO = ItemCrearPedido;

// Objeto para enviar al backend al hacer un pedido
export interface CrearPedido {
  clienteId: number;
  items: ItemCrearPedido[];
}
export type CrearPedidoDTO = CrearPedido;
