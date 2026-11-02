import { ComidaDTO } from './comida.dto';

/**
 * Representa una bebida seleccionada para acompañar un plato con su respectiva cantidad.
 */
export interface BebidaSeleccionadaItem {
  bebida: ComidaDTO;
  cantidad: number;
}
