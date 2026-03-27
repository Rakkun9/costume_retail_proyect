import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EnviarPrendasLavanderiaCommand } from './enviar-prendas-lavanderia.command';
import { SeleccionEnvioStrategy } from '../strategy/seleccion-envio.strategy';
import { ModoEnvioLavanderia } from '../dto/modo-envio.enum';

describe('EnviarPrendasLavanderiaCommand', () => {
  function buildDeps() {
    const lavanderiaRepository = {
      find: jest.fn(),
      save: jest.fn(),
    } as unknown as Repository<any>;

    const domainEventPublisher = {
      notify: jest.fn(),
    } as any;

    const strategy: SeleccionEnvioStrategy = {
      seleccionar: jest.fn(),
    };

    return { lavanderiaRepository, domainEventPublisher, strategy };
  }

  it('lanza error cuando no hay pendientes', async () => {
    const deps = buildDeps();
    deps.lavanderiaRepository.find = jest.fn().mockResolvedValue([]);

    const command = new EnviarPrendasLavanderiaCommand(
      deps.lavanderiaRepository,
      deps.domainEventPublisher,
      { cantidad: 2 },
      deps.strategy,
    );

    await expect(command.execute()).rejects.toBeInstanceOf(NotFoundException);
    expect(deps.strategy.seleccionar).not.toHaveBeenCalled();
  });

  it('envia prendas seleccionadas por strategy y publica evento', async () => {
    const deps = buildDeps();

    const p1 = {
      id: 1,
      enviada: false,
      prioridad: true,
      fecha_registro: new Date('2026-03-20'),
      prenda: { referencia: 'A-1' },
    };
    const p2 = {
      id: 2,
      enviada: false,
      prioridad: false,
      fecha_registro: new Date('2026-03-21'),
      prenda: { referencia: 'B-2' },
    };

    deps.lavanderiaRepository.find = jest.fn().mockResolvedValue([p1, p2]);
    (deps.strategy.seleccionar as jest.Mock).mockReturnValue([p2]);
    deps.lavanderiaRepository.save = jest.fn().mockImplementation(async (x) => x);

    const command = new EnviarPrendasLavanderiaCommand(
      deps.lavanderiaRepository,
      deps.domainEventPublisher,
      { cantidad: 1, estrategia: ModoEnvioLavanderia.FIFO },
      deps.strategy,
    );

    const result = await command.execute();

    expect(deps.strategy.seleccionar).toHaveBeenCalledWith([p1, p2], 1);
    expect(deps.lavanderiaRepository.save).toHaveBeenCalledTimes(1);
    expect(p2.enviada).toBe(true);
    expect(result.cantidad_enviada).toBe(1);
    expect(result.prendas_enviadas).toEqual([p2]);
    expect(deps.domainEventPublisher.notify).toHaveBeenCalledTimes(1);
  });
});
