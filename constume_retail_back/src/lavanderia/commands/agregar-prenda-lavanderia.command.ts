import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Command } from '../../patrones/command/command.interface';
import { AgregarLavanderiaDto } from '../dto/agregar-lavanderia.dto';
import { ListaLavanderia } from '../lista-lavanderia.entity';
import { EstadoPrenda } from '../../prendas/prenda.entity';
import { PrendasService } from '../../prendas/prendas.service';
import { DomainEventPublisher } from '../../patrones/observer/domain-event.publisher';

export class AgregarPrendaLavanderiaCommand implements Command<ListaLavanderia> {
  constructor(
    private readonly lavanderiaRepository: Repository<ListaLavanderia>,
    private readonly prendasService: PrendasService,
    private readonly domainEventPublisher: DomainEventPublisher,
    private readonly dto: AgregarLavanderiaDto,
  ) {}

  async execute(): Promise<ListaLavanderia> {
    const prenda = await this.prendasService.findByReferencia(
      this.dto.referencia,
    );

    if (prenda.estado === EstadoPrenda.EN_LAVANDERIA) {
      throw new BadRequestException(
        `La prenda "${this.dto.referencia}" ya se encuentra en la lista de lavandería`,
      );
    }

    await this.prendasService.updateEstado(
      this.dto.referencia,
      EstadoPrenda.EN_LAVANDERIA,
    );

    const registro = this.lavanderiaRepository.create({
      prenda,
      prioridad: this.dto.prioridad ?? false,
      enviada: false,
    });

    const guardado = await this.lavanderiaRepository.save(registro);

    await this.domainEventPublisher.notify({
      name: 'lavanderia.prenda.agregada',
      occurredOn: new Date(),
      payload: {
        id: guardado.id,
        referencia: this.dto.referencia,
        prioridad: guardado.prioridad,
      },
    });

    return guardado;
  }
}
