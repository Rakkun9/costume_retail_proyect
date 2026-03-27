import { ListaLavanderia } from '../lista-lavanderia.entity';

export interface SeleccionEnvioStrategy {
  seleccionar(
    pendientes: ListaLavanderia[],
    cantidad: number,
  ): ListaLavanderia[];
}
