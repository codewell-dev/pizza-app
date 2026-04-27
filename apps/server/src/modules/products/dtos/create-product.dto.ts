import {
  IsNumber,
  IsString,
  IsOptional,
  IsArray,
  IsNotEmpty,
  IsMongoId,
  ValidateNested,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class ImageDto {
  @IsString() @IsOptional() large?: string;
  @IsString() @IsOptional() medium?: string;
  @IsString() @IsOptional() small?: string;
}

export class CreateProductDto {
  @ApiProperty({ example: 450 })
  @IsNumber()
  @IsNotEmpty()
  readonly price: number;

  @ApiPropertyOptional({ example: '480' })
  @IsString()
  @IsOptional()
  readonly weight?: string;

  @ApiPropertyOptional({ example: 'г.' })
  @IsString()
  @IsOptional()
  readonly unit?: string;

  @ApiProperty({ example: 'Маргарита (35 см)' })
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly description?: string;

  // category_id — опціональний, бо варіанти піци прив'язуються через GroupedProduct
  @ApiPropertyOptional({ example: '60c72b2f9b1e8b0015f8a7a1' })
  @IsMongoId()
  @IsOptional()
  readonly category_id?: string;

  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => ImageDto)
  @IsOptional()
  readonly image?: ImageDto;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  readonly group_modifiers?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly tags?: string[];

  // is_active: число (1 = активний, 0 = прихований) — як в оригінальному pizzahouse API
  @ApiPropertyOptional({
    example: 1,
    description: '1 = активний, 0 = прихований',
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  readonly is_active?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  readonly well_together_products?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  readonly group?: string[];

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @IsOptional()
  readonly order?: number;
}
