import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prenda } from './prenda.entity';
import { PrendasService } from './prendas.service';
import { PrendasController } from './prendas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Prenda])],
  providers: [PrendasService],
  controllers: [PrendasController],
  exports: [PrendasService],
})
export class PrendasModule {}
