import { IsEnum, IsInt, IsOptional, IsPositive } from 'class-validator';
import { ModoEnvioLavanderia } from './modo-envio.enum';

export class EnviarPrendasDto {
  @IsInt()
  @IsPositive()
  cantidad: number;

  @IsOptional()
  @IsEnum(ModoEnvioLavanderia)
  estrategia?: ModoEnvioLavanderia;
}
