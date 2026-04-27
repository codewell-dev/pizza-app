import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class GroupModifier extends Document {
  @ApiProperty({ example: 'Choose crust', description: 'Group modifier title' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({
    enum: ['select_one', 'select_many'],
    example: 'select_one',
    description: 'select_one = radio, select_many = checkbox',
  })
  @Prop({ enum: ['select_one', 'select_many'], default: 'select_many' })
  type: string;

  @ApiPropertyOptional({ example: 0, description: 'Minimum required selections' })
  @Prop({ default: 0 })
  min_quantity: number;

  @ApiPropertyOptional({ example: 10, description: 'Maximum allowed selections' })
  @Prop({ default: 10 })
  max_quantity: number;

  @ApiProperty({ type: [String], description: 'Array of Modifier ObjectIds' })
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Modifier' }] })
  modifiers: Types.ObjectId[];
}

export const GroupModifierSchema = SchemaFactory.createForClass(GroupModifier);
