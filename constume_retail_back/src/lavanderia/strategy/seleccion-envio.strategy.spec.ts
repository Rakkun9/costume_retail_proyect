import { ListaLavanderia } from '../lista-lavanderia.entity';
import { FifoStrategy } from './fifo.strategy';
import { PrioridadFifoStrategy } from './prioridad-fifo.strategy';

function item(
  id: number,
  prioridad: boolean,
  fecha: string,
  referencia: string,
): ListaLavanderia {
  return {
    id,
    prioridad,
    fecha_registro: new Date(fecha),
    enviada: false,
    prenda: {
      referencia,
    } as any,
  } as ListaLavanderia;
}

describe('SeleccionEnvioStrategy', () => {
  it('FifoStrategy respeta orden por fecha de registro', () => {
    const strategy = new FifoStrategy();
    const pendientes = [
      item(1, false, '2026-03-20', 'P3'),
      item(2, true, '2026-03-10', 'P1'),
      item(3, false, '2026-03-15', 'P2'),
    ];

    const result = strategy.seleccionar(pendientes, 2);

    expect(result.map((p) => p.prenda.referencia)).toEqual(['P1', 'P2']);
  });

  it('PrioridadFifoStrategy prioriza urgentes y luego fecha', () => {
    const strategy = new PrioridadFifoStrategy();
    const pendientes = [
      item(1, false, '2026-03-10', 'NP-OLD'),
      item(2, true, '2026-03-20', 'P-NEW'),
      item(3, true, '2026-03-12', 'P-OLD'),
      item(4, false, '2026-03-11', 'NP-MID'),
    ];

    const result = strategy.seleccionar(pendientes, 3);

    expect(result.map((p) => p.prenda.referencia)).toEqual([
      'P-OLD',
      'P-NEW',
      'NP-OLD',
    ]);
  });
});
