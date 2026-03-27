import { ListaLavanderia } from '../lista-lavanderia.entity';
import { SeleccionEnvioStrategy } from './seleccion-envio.strategy';

export class FifoStrategy implements SeleccionEnvioStrategy {
  seleccionar(
    pendientes: ListaLavanderia[],
    cantidad: number,
  ): ListaLavanderia[] {
    const ordenadas = [...pendientes].sort(
      (a, b) =>
        new Date(a.fecha_registro).getTime() -
        new Date(b.fecha_registro).getTime(),
    );
    return ordenadas.slice(0, cantidad);
  }
}
