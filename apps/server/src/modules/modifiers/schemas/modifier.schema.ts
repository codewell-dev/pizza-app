import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class Modifier extends Document {
  @ApiProperty({ example: 'Extra cheese', description: 'Modifier name' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({ example: 30, description: 'Additional price in UAH (0 = free)' })
  @Prop({ required: true, min: 0, default: 0 })
  price: number;

  @ApiPropertyOptional({ example: '50g' })
  @Prop()
  weight: string;

  @ApiPropertyOptional({ example: '/media/modifiers/cheese.svg' })
  @Prop()
  image: string;

  @ApiProperty({ example: true, default: true })
  @Prop({ default: true })
  is_active: boolean;
}

export const ModifierSchema = SchemaFactory.createForClass(Modifier);
