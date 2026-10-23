import { Categoria } from './categoria.model';
import { Comida } from './comida.model';

/**
 * Modelo de clase para la entidad Adicional.
 */
export class Adicional {
  constructor(
    public id: number,
    public nombre: string,
    public precio: number,
    public activo: boolean = true,
    public categorias: Categoria[] = [],
    public comidas: Comida[] = [],
  ) {}
}
