import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class Category extends Document {
  @ApiProperty({ example: 'Pizza', description: 'Category name' })
  @Prop({ required: true })
  title: string;

  @ApiPropertyOptional({ example: 'Our signature pizzas' })
  @Prop()
  description: string;

  @ApiPropertyOptional({ example: 'pizza', description: 'URL slug' })
  @Prop({ unique: true, sparse: true })
  url: string;

  @ApiPropertyOptional({ example: '/media/pizza-icon.svg' })
  @Prop()
  image: string;

  @ApiPropertyOptional({ type: [String], description: 'Grouped products in this category' })
  @Prop({ type: [{ type: Types.ObjectId, ref: 'GroupedProduct' }] })
  category_group_products: Types.ObjectId[];

  @ApiPropertyOptional({ type: [String], description: 'Standalone products in this category' })
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }] })
  category_products: Types.ObjectId[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.index({ url: 1 });
CategorySchema.index({ title: 1 });
