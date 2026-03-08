import { IsInt, IsPositive } from 'class-validator';

export class EnviarPrendasDto {
  @IsInt()
  @IsPositive()
  cantidad: number;
}
