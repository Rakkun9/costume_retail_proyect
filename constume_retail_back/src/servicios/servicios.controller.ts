import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ServiciosService } from './servicios.service';
import { CreateServicioDto } from './dto/create-servicio.dto';

@ApiTags('Servicios de Alquiler')
@Controller('servicios')
export class ServiciosController {
  constructor(private readonly serviciosService: ServiciosService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo servicio de alquiler' })
  create(@Body() dto: CreateServicioDto) {
    return this.serviciosService.create(dto);
  }

  @Get('cliente/:clienteId')
  @ApiOperation({
    summary:
      'Consultar servicios vigentes de un cliente (fecha >= hoy), ordenados por fecha de alquiler',
  })
  findByCliente(@Param('clienteId') clienteId: string) {
    return this.serviciosService.findByCliente(clienteId);
  }

  @Get('fecha/:fecha')
  @ApiOperation({
    summary: 'Consultar servicios por fecha de alquiler (YYYY-MM-DD)',
  })
  findByFecha(@Param('fecha') fecha: string) {
    return this.serviciosService.findByFecha(fecha);
  }

  @Get(':numero')
  @ApiOperation({ summary: 'Consultar servicio por número' })
  findOne(@Param('numero', ParseIntPipe) numero: number) {
    return this.serviciosService.findByNumero(numero);
  }
}
