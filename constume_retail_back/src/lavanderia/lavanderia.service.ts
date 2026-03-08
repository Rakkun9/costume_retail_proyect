import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListaLavanderia } from './lista-lavanderia.entity';
import { AgregarLavanderiaDto } from './dto/agregar-lavanderia.dto';
import { EnviarPrendasDto } from './dto/enviar-prendas.dto';
import { PrendasService } from '../prendas/prendas.service';
import { EstadoPrenda } from '../prendas/prenda.entity';

@Injectable()
export class LavanderiaService {
  constructor(
    @InjectRepository(ListaLavanderia)
    private readonly lavanderiaRepository: Repository<ListaLavanderia>,
    private readonly prendasService: PrendasService,
  ) {}

  async agregar(dto: AgregarLavanderiaDto): Promise<ListaLavanderia> {
    const prenda = await this.prendasService.findByReferencia(dto.referencia);

    if (prenda.estado === EstadoPrenda.EN_LAVANDERIA) {
      throw new BadRequestException(
        `La prenda "${dto.referencia}" ya se encuentra en la lista de lavandería`,
      );
    }

    // Actualizar estado de la prenda
    await this.prendasService.updateEstado(
      dto.referencia,
      EstadoPrenda.EN_LAVANDERIA,
    );

    const registro = this.lavanderiaRepository.create({
      prenda,
      prioridad: dto.prioridad ?? false,
      enviada: false,
    });

    return this.lavanderiaRepository.save(registro);
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
    const pendientes = await this.lavanderiaRepository.find({
      where: { enviada: false },
      relations: ['prenda'],
      order: {
        prioridad: 'DESC',
        fecha_registro: 'ASC',
      },
    });

    if (pendientes.length === 0) {
      throw new NotFoundException(
        'No hay prendas pendientes de envío a lavandería',
      );
    }

    const cantidadReal = Math.min(dto.cantidad, pendientes.length);
    const aEnviar = pendientes.slice(0, cantidadReal);

    for (const item of aEnviar) {
      item.enviada = true;
      await this.lavanderiaRepository.save(item);
    }

    return {
      mensaje: `Se enviaron ${cantidadReal} prenda(s) a lavandería exitosamente`,
      cantidad_enviada: cantidadReal,
      prendas_enviadas: aEnviar,
    };
  }
}
