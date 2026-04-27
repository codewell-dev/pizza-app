import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Sub-schema for product images with different sizes
 */
@Schema({ _id: false })
export class Image {
  @ApiProperty({
    example: '/uploads/large.webp',
    description: 'Large size image URL',
  })
  @Prop()
  large: string;

  @ApiProperty({
    example: '/uploads/medium.webp',
    description: 'Medium size image URL',
  })
  @Prop()
  medium: string;

  @ApiProperty({
    example: '/uploads/small.webp',
    description: 'Small size image URL',
  })
  @Prop()
  small: string;
}

const ImageSchema = SchemaFactory.createForClass(Image);

/**
 * Main Product Schema
 */
@Schema({ timestamps: true }) // Added timestamps for createdAt and updatedAt
export class Product extends Document {
  @ApiProperty({ example: 450, description: 'Price of the product' })
  @Prop({ required: true, index: true })
  price: number;

  @ApiProperty({ example: '30 cm', description: 'Weight or size details' })
  @Prop()
  weight: string;

  @ApiProperty({ example: 'Quattro di Carne', description: 'Product title' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({ example: 'Meat lover pizza...', required: false })
  @Prop()
  description: string;

  @ApiProperty({ example: 'g.', required: false })
  @Prop()
  unit: string;

  @ApiProperty({ type: String, description: 'Reference ID to Category' })
  @Prop({ type: Types.ObjectId, ref: 'Category' })
  category_id: Types.ObjectId;

  @ApiProperty({ type: Image, description: 'Product image object' })
  @Prop({ type: ImageSchema })
  image: Image;

  @ApiProperty({ type: [String], description: 'List of group modifier IDs' })
  @Prop({ type: [{ type: Types.ObjectId, ref: 'GroupModifier' }] })
  group_modifiers: Types.ObjectId[];

  @ApiProperty({
    type: [String],
    description: 'Recommended products (cross-sell)',
  })
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }] })
  well_together_products: Types.ObjectId[];

  @ApiProperty({ type: [String], description: 'Grouped variants IDs' })
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }] })
  group: Types.ObjectId[];

  @ApiProperty({
    example: 1,
    description: 'Activity status: 1 - active, 0 - inactive',
  })
  @Prop({ default: 1 })
  is_active: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Indexes for optimization
ProductSchema.index({ title: 1 });
ProductSchema.index({ category_id: 1 });   // filter by category
ProductSchema.index({ is_active: 1 });      // filter active products

export type ProductDocument = Product & Document;
