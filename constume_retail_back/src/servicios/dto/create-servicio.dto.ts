import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsString,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateServicioDto {
  @IsString()
  @IsNotEmpty()
  cliente_id: string;

  @IsString()
  @IsNotEmpty()
  empleado_id: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  referencias_prendas: string[];

  @IsDateString()
  fecha_alquiler: string;
}
