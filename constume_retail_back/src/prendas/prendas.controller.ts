import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrendasService } from './prendas.service';
import { CreatePrendaDto } from './dto/create-prenda.dto';

@ApiTags('Prendas')
@Controller('prendas')
export class PrendasController {
  constructor(private readonly prendasService: PrendasService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar una nueva prenda' })
  create(@Body() dto: CreatePrendaDto) {
    return this.prendasService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las prendas' })
  findAll() {
    return this.prendasService.findAll();
  }

  @Get('talla/:talla')
  @ApiOperation({ summary: 'Consultar prendas por talla' })
  findByTalla(@Param('talla') talla: string) {
    return this.prendasService.findByTalla(talla);
  }

  @Get(':referencia')
  @ApiOperation({ summary: 'Consultar prenda por referencia' })
  findOne(@Param('referencia') referencia: string) {
    return this.prendasService.findByReferencia(referencia);
  }
}
