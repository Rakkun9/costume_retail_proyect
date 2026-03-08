import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LavanderiaService } from './lavanderia.service';
import { AgregarLavanderiaDto } from './dto/agregar-lavanderia.dto';
import { EnviarPrendasDto } from './dto/enviar-prendas.dto';

@ApiTags('Lavandería')
@Controller('lavanderia')
export class LavanderiaController {
  constructor(private readonly lavanderiaService: LavanderiaService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar prenda para envío a lavandería' })
  agregar(@Body() dto: AgregarLavanderiaDto) {
    return this.lavanderiaService.agregar(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Ver listado de prendas pendientes de envío a lavandería',
  })
  findPendientes() {
    return this.lavanderiaService.findPendientes();
  }

  @Post('enviar')
  @ApiOperation({ summary: 'Enviar prendas a lavandería (con prioridad FIFO)' })
  enviar(@Body() dto: EnviarPrendasDto) {
    return this.lavanderiaService.enviar(dto);
  }
}
