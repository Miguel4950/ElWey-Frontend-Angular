import { Categoria } from './categoria.model';
import { Adicional } from './adicional.model';

/**
 * Modelo de clase para la entidad Comida.
 */
export class Comida {
  constructor(
    public id: number,
    public nombre: string,
    public precio: number,
    public descripcion: string,
    public imagen_url: string,
    public etiqueta: string,
    public activo: boolean = true,
    public categoria: Categoria,
    public adicionalesDisponibles: Adicional[] = [],
  ) {}
}
