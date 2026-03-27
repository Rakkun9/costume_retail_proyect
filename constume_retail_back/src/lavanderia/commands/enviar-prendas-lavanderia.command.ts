import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Command } from '../../patrones/command/command.interface';
import { ArrayIterator } from '../../patrones/iterator/array.iterator';
import { DomainEventPublisher } from '../../patrones/observer/domain-event.publisher';
import { EnviarPrendasDto } from '../dto/enviar-prendas.dto';
import { ListaLavanderia } from '../lista-lavanderia.entity';
import { SeleccionEnvioStrategy } from '../strategy/seleccion-envio.strategy';

export class EnviarPrendasLavanderiaCommand implements Command<{
  mensaje: string;
  cantidad_enviada: number;
  prendas_enviadas: ListaLavanderia[];
}> {
  constructor(
    private readonly lavanderiaRepository: Repository<ListaLavanderia>,
    private readonly domainEventPublisher: DomainEventPublisher,
    private readonly dto: EnviarPrendasDto,
    private readonly strategy: SeleccionEnvioStrategy,
  ) {}

  async execute(): Promise<{
    mensaje: string;
    cantidad_enviada: number;
    prendas_enviadas: ListaLavanderia[];
  }> {
    const pendientes = await this.lavanderiaRepository.find({
      where: { enviada: false },
      relations: ['prenda'],
      order: { fecha_registro: 'ASC' },
    });

    if (pendientes.length === 0) {
      throw new NotFoundException(
        'No hay prendas pendientes de envío a lavandería',
      );
    }

    const cantidadReal = Math.min(this.dto.cantidad, pendientes.length);
    const aEnviar = this.strategy.seleccionar(pendientes, cantidadReal);

    const iterator = new ArrayIterator(aEnviar);
    while (iterator.hasNext()) {
      const item = iterator.next();
      item.enviada = true;
      await this.lavanderiaRepository.save(item);
    }

    await this.domainEventPublisher.notify({
      name: 'lavanderia.prendas.enviadas',
      occurredOn: new Date(),
      payload: {
        cantidad_enviada: cantidadReal,
        referencias: aEnviar.map((item) => item.prenda.referencia),
        estrategia: this.dto.estrategia ?? 'PRIORIDAD_FIFO',
      },
    });

    return {
      mensaje: `Se enviaron ${cantidadReal} prenda(s) a lavandería exitosamente`,
      cantidad_enviada: cantidadReal,
      prendas_enviadas: aEnviar,
    };
  }
}
