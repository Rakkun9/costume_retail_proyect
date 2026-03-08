import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicioAlquiler } from './servicio-alquiler.entity';
import { ServiciosService } from './servicios.service';
import { ServiciosController } from './servicios.controller';
import { ClientesModule } from '../clientes/clientes.module';
import { EmpleadosModule } from '../empleados/empleados.module';
import { PrendasModule } from '../prendas/prendas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServicioAlquiler]),
    ClientesModule,
    EmpleadosModule,
    PrendasModule,
  ],
  providers: [ServiciosService],
  controllers: [ServiciosController],
})
export class ServiciosModule {}
