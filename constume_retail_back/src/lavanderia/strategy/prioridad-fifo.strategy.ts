import { ListaLavanderia } from '../lista-lavanderia.entity';
import { SeleccionEnvioStrategy } from './seleccion-envio.strategy';

export class PrioridadFifoStrategy implements SeleccionEnvioStrategy {
  seleccionar(
    pendientes: ListaLavanderia[],
    cantidad: number,
  ): ListaLavanderia[] {
    const ordenadas = [...pendientes].sort((a, b) => {
      if (a.prioridad === b.prioridad) {
        return (
          new Date(a.fecha_registro).getTime() -
          new Date(b.fecha_registro).getTime()
        );
      }
      return a.prioridad ? -1 : 1;
    });
    return ordenadas.slice(0, cantidad);
  }
}
