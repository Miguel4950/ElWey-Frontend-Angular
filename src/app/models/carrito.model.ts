// Adicional guardado en el carrito
export interface AdicionalItemCarrito {
  adicionalId: number;
  nombre: string;
  precio: number;
  cantidad: number;
  subtotal: number;
}
export type AdicionalItemCarritoDTO = AdicionalItemCarrito;

// Ítem individual en el carrito
export interface ItemCarrito {
  id: string; // ID temporal para el carrito local
  comidaId: number;
  comidaNombre: string;
  comidaPrecio: number;
  categoriaNombre?: string;
  imagenUrl?: string;
  cantidad: number;
  adicionales: AdicionalItemCarrito[];
  subtotalComida: number;
  subtotalAdicionales: number;
  subtotal: number;
}
export type ItemCarritoDTO = ItemCarrito;
