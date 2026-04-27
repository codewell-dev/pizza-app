import { IsString, IsNotEmpty, IsArray, IsOptional, IsMongoId, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGroupModifierDto {
  @ApiProperty({ example: 'Choose crust' })
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiPropertyOptional({
    enum: ['select_one', 'select_many'],
    default: 'select_many',
    description: 'select_one = radio button, select_many = checkbox',
  })
  @IsEnum(['select_one', 'select_many'])
  @IsOptional()
  readonly type?: string;

  @ApiPropertyOptional({ example: 0, description: 'Min required selections' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  readonly min_quantity?: number;

  @ApiPropertyOptional({ example: 3, description: 'Max allowed selections' })
  @IsNumber()
  @Max(100)
  @IsOptional()
  readonly max_quantity?: number;

  @ApiPropertyOptional({ type: [String], description: 'Modifier ObjectIds' })
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  readonly modifiers?: string[];
}
