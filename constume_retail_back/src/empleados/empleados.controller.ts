import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EmpleadosService } from './empleados.service';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';

@ApiTags('Empleados')
@Controller('empleados')
export class EmpleadosController {
  constructor(private readonly empleadosService: EmpleadosService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo empleado' })
  create(@Body() dto: CreateEmpleadoDto) {
    return this.empleadosService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los empleados' })
  findAll() {
    return this.empleadosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar empleado por número de identificación' })
  findOne(@Param('id') id: string) {
    return this.empleadosService.findById(id);
  }
}
