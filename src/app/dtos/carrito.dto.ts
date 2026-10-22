export interface AdicionalItemCarritoDTO {
  adicionalId: number;
  nombre: string;
  precio: number;
  cantidad: number;
  subtotal: number;
}

export interface ItemCarritoDTO {
  id: string; // Identificador único temporal para el carrito
  comidaId: number;
  comidaNombre: string;
  comidaPrecio: number;
  categoriaNombre?: string;
  imagenUrl?: string;
  cantidad: number;
  adicionales: AdicionalItemCarritoDTO[];
  subtotalComida: number;
  subtotalAdicionales: number;
  subtotal: number;
}
