import { IsNumber, IsString, IsNotEmpty, IsOptional, IsBoolean, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateModifierDto {
  @ApiProperty({ example: 'Extra cheese', description: 'Modifier name' })
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({ example: 30, description: 'Price in UAH (0 = free)' })
  @IsNumber()
  @Min(0)
  readonly price: number;

  @ApiPropertyOptional({ example: '50g' })
  @IsString()
  @IsOptional()
  readonly weight?: string;

  @ApiPropertyOptional({ example: '/media/cheese.svg' })
  @IsString()
  @IsOptional()
  readonly image?: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsBoolean()
  @IsOptional()
  readonly is_active?: boolean;
}
