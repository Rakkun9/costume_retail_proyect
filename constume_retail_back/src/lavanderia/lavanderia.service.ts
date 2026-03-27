import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListaLavanderia } from './lista-lavanderia.entity';
import { AgregarLavanderiaDto } from './dto/agregar-lavanderia.dto';
import { EnviarPrendasDto } from './dto/enviar-prendas.dto';
import { PrendasService } from '../prendas/prendas.service';
import { LavanderiaCommandInvoker } from './commands/lavanderia-command-invoker';
import { AgregarPrendaLavanderiaCommand } from './commands/agregar-prenda-lavanderia.command';
import { EnviarPrendasLavanderiaCommand } from './commands/enviar-prendas-lavanderia.command';
import { DomainEventPublisher } from '../patrones/observer/domain-event.publisher';
import { SeleccionEnvioStrategy } from './strategy/seleccion-envio.strategy';
import { PrioridadFifoStrategy } from './strategy/prioridad-fifo.strategy';
import { FifoStrategy } from './strategy/fifo.strategy';
import { ModoEnvioLavanderia } from './dto/modo-envio.enum';

@Injectable()
export class LavanderiaService {
  private readonly invoker = new LavanderiaCommandInvoker();

  constructor(
    @InjectRepository(ListaLavanderia)
    private readonly lavanderiaRepository: Repository<ListaLavanderia>,
    private readonly prendasService: PrendasService,
    private readonly domainEventPublisher: DomainEventPublisher,
  ) {}

  async agregar(dto: AgregarLavanderiaDto): Promise<ListaLavanderia> {
    const command = new AgregarPrendaLavanderiaCommand(
      this.lavanderiaRepository,
      this.prendasService,
      this.domainEventPublisher,
      dto,
    );

    return this.invoker.execute(command);
  }

  async findPendientes(): Promise<ListaLavanderia[]> {
    return this.lavanderiaRepository.find({
      where: { enviada: false },
      relations: ['prenda'],
      order: {
        prioridad: 'DESC',
        fecha_registro: 'ASC',
      },
    });
  }

  async enviar(dto: EnviarPrendasDto): Promise<{
    mensaje: string;
    cantidad_enviada: number;
    prendas_enviadas: ListaLavanderia[];
  }> {
    const command = new EnviarPrendasLavanderiaCommand(
      this.lavanderiaRepository,
      this.domainEventPublisher,
      dto,
      this.resolveStrategy(dto.estrategia),
    );

    return this.invoker.execute(command);
  }

  private resolveStrategy(
    estrategia?: ModoEnvioLavanderia,
  ): SeleccionEnvioStrategy {
    if (estrategia === ModoEnvioLavanderia.FIFO) {
      return new FifoStrategy();
    }
    return new PrioridadFifoStrategy();
  }
}
