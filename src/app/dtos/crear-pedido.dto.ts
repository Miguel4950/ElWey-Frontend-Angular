export interface AdicionalCantidadDTO {
    adicionalId: number;
    cantidad: number;
}

export interface ItemCrearPedidoDTO {
    comidaId: number;
    cantidad: number;
    adicionales: AdicionalCantidadDTO[];
}

export interface CrearPedidoDTO {
    clienteId: number;
    items: ItemCrearPedidoDTO[];
}