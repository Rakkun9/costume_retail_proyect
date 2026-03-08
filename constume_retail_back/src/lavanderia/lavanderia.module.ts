import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListaLavanderia } from './lista-lavanderia.entity';
import { LavanderiaService } from './lavanderia.service';
import { LavanderiaController } from './lavanderia.controller';
import { PrendasModule } from '../prendas/prendas.module';

@Module({
  imports: [TypeOrmModule.forFeature([ListaLavanderia]), PrendasModule],
  providers: [LavanderiaService],
  controllers: [LavanderiaController],
})
export class LavanderiaModule {}
