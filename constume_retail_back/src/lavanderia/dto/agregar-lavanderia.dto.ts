import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AgregarLavanderiaDto {
  @IsString()
  @IsNotEmpty()
  referencia: string;

  @IsBoolean()
  @IsOptional()
  prioridad?: boolean;
}
