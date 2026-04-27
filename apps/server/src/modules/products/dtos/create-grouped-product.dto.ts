import {
  IsString,
  IsArray,
  IsOptional,
  IsNotEmpty,
  IsMongoId,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * Nested DTO for product images
 */
class ImageDto {
  @ApiPropertyOptional({ example: '/uploads/products/large.webp' })
  @IsString()
  @IsOptional()
  large?: string;

  @ApiPropertyOptional({ example: '/uploads/products/medium.webp' })
  @IsString()
  @IsOptional()
  medium?: string;

  @ApiPropertyOptional({ example: '/uploads/products/small.webp' })
  @IsString()
  @IsOptional()
  small?: string;
}

export class CreateGroupedProductDto {
  @ApiProperty({
    example: 'Quattro di Carne',
    description: 'The main title of the grouped product',
  })
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({
    example: '60c72b2f9b1e8b0015f8a7a1',
    description: 'The MongoDB ID of the parent category',
  })
  @IsMongoId()
  @IsNotEmpty()
  readonly category_id: string;

  @ApiPropertyOptional({
    example: 'A delicious selection of meat pizzas.',
    description: 'General description for the group',
  })
  @IsString()
  @IsOptional()
  readonly description?: string;

  @ApiPropertyOptional({ type: ImageDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ImageDto) // Required for nested validation to work
  readonly image?: ImageDto;

  @ApiPropertyOptional({
    example: 1,
    description: 'The display order of the product',
  })
  @IsNumber()
  @IsOptional()
  readonly order?: number;

  @ApiProperty({
    type: [String],
    example: ['60c72b2f9b1e8b0015f8a7b1', '60c72b2f9b1e8b0015f8a7b2'],
    description: 'Array of Product ObjectIDs that belong to this group',
  })
  @IsArray()
  @IsMongoId({ each: true })
  @IsNotEmpty()
  readonly products: string[];
}
