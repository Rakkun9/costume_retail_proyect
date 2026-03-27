import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EstadoPrenda } from '../../prendas/prenda.entity';
import { AgregarPrendaLavanderiaCommand } from './agregar-prenda-lavanderia.command';

describe('AgregarPrendaLavanderiaCommand', () => {
  function buildDeps() {
    const lavanderiaRepository = {
      create: jest.fn(),
      save: jest.fn(),
    } as unknown as Repository<any>;

    const prendasService = {
      findByReferencia: jest.fn(),
      updateEstado: jest.fn(),
    } as any;

    const domainEventPublisher = {
      notify: jest.fn(),
    } as any;

    return { lavanderiaRepository, prendasService, domainEventPublisher };
  }

  it('agrega una prenda a lavanderia y publica evento', async () => {
    const deps = buildDeps();
    const dto = { referencia: 'REF-1', prioridad: true };
    const prenda = { referencia: 'REF-1', estado: EstadoPrenda.DISPONIBLE };
    const creado = { prenda, prioridad: true, enviada: false };
    const guardado = { id: 100, ...creado };

    deps.prendasService.findByReferencia.mockResolvedValue(prenda);
    deps.lavanderiaRepository.create = jest.fn().mockReturnValue(creado);
    deps.lavanderiaRepository.save = jest.fn().mockResolvedValue(guardado);

    const command = new AgregarPrendaLavanderiaCommand(
      deps.lavanderiaRepository,
      deps.prendasService,
      deps.domainEventPublisher,
      dto,
    );

    const result = await command.execute();

    expect(deps.prendasService.updateEstado).toHaveBeenCalledWith(
      'REF-1',
      EstadoPrenda.EN_LAVANDERIA,
    );
    expect(deps.lavanderiaRepository.create).toHaveBeenCalledWith({
      prenda,
      prioridad: true,
      enviada: false,
    });
    expect(deps.domainEventPublisher.notify).toHaveBeenCalledTimes(1);
    expect(result).toEqual(guardado);
  });

  it('lanza error si la prenda ya esta en lavanderia', async () => {
    const deps = buildDeps();
    deps.prendasService.findByReferencia.mockResolvedValue({
      referencia: 'REF-2',
      estado: EstadoPrenda.EN_LAVANDERIA,
    });

    const command = new AgregarPrendaLavanderiaCommand(
      deps.lavanderiaRepository,
      deps.prendasService,
      deps.domainEventPublisher,
      { referencia: 'REF-2' },
    );

    await expect(command.execute()).rejects.toBeInstanceOf(BadRequestException);
    expect(deps.prendasService.updateEstado).not.toHaveBeenCalled();
    expect(deps.lavanderiaRepository.save).not.toHaveBeenCalled();
  });
});
