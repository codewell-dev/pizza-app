import {
  IsString, IsNotEmpty, IsNumber, IsArray, IsEnum,
  IsOptional, ValidateNested, IsPositive, Min, ArrayMinSize,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class OrderModifierDto {
  @ApiProperty({ example: '6900...' })
  @IsString() @IsNotEmpty()
  _id: string;

  @ApiProperty({ example: 'Бортик з сиром' })
  @IsString() @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 80 })
  @IsNumber() @Min(0)
  price: number;

  @ApiProperty({ example: 1 })
  @IsNumber() @Min(1)
  count: number;
}

class OrderItemDto {
  @ApiProperty({ example: '6919...' })
  @IsString() @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 'Карбонара (40 см)' })
  @IsString() @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 530 })
  @IsNumber() @IsPositive()
  price: number;

  @ApiProperty({ example: 2 })
  @IsNumber() @Min(1)
  count: number;

  @ApiPropertyOptional({ example: '850' })
  @IsString() @IsOptional()
  weight?: string;

  @ApiPropertyOptional({ example: '/media/pizza.webp' })
  @IsString() @IsOptional()
  imageLarge?: string;

  @ApiPropertyOptional({ type: [OrderModifierDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderModifierDto)
  @IsOptional()
  modifiers?: OrderModifierDto[];
}

class DeliveryAddressDto {
  @ApiPropertyOptional({ example: 'Хрещатик' })
  @IsString() @IsOptional()
  street?: string;

  @ApiPropertyOptional({ example: '1' })
  @IsString() @IsOptional()
  house?: string;

  @ApiPropertyOptional({ example: '15' })
  @IsString() @IsOptional()
  apartment?: string;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ArrayMinSize(1, { message: 'Order must contain at least one item' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ example: 1250 })
  @IsNumber() @IsPositive()
  totalPrice: number;

  @ApiProperty({ enum: ['delivery', 'pickup'], example: 'delivery' })
  @IsEnum(['delivery', 'pickup'])
  deliveryType: string;

  @ApiProperty({ enum: ['cash', 'card', 'online'], example: 'cash' })
  @IsEnum(['cash', 'card', 'online'])
  paymentMethod: string;

  @ApiProperty({ example: 'Іван' })
  @IsString() @IsNotEmpty()
  customerName: string;

  @ApiProperty({ example: '+380991234567' })
  @IsString() @IsNotEmpty()
  customerPhone: string;

  @ApiPropertyOptional({ type: DeliveryAddressDto })
  @ValidateNested()
  @Type(() => DeliveryAddressDto)
  @IsOptional()
  address?: DeliveryAddressDto;

  @ApiPropertyOptional({ example: 'Без цибулі' })
  @IsString() @IsOptional()
  comment?: string;
}
