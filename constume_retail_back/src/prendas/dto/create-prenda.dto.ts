import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { EstadoPrenda } from '../prenda.entity';

export class CreatePrendaDto {
  @IsString()
  @IsNotEmpty()
  referencia: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsNotEmpty()
  talla: string;

  @IsString()
  @IsNotEmpty()
  tipo: string;

  @IsEnum(EstadoPrenda)
  @IsOptional()
  estado?: EstadoPrenda;

  @IsNumber()
  @Min(0)
  precio_alquiler: number;
}
