import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Schema for Grouped Products (e.g., a "Quattro di Carne" parent
 * containing different sizes as separate Product variants)
 */
@Schema({ timestamps: true })
export class GroupedProduct extends Document {
  @ApiProperty({
    example: 'Quattro di Carne',
    description: 'The main title of the grouped product',
  })
  @Prop({ required: true })
  title: string;

  @ApiProperty({
    example: '60c7...a1',
    description: 'Reference to the main Category ID',
  })
  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category_id: Types.ObjectId;

  @ApiProperty({
    example: 'Delicious meat pizza with 4 types of meat',
    required: false,
    description: 'General description for the whole group',
  })
  @Prop()
  description: string;

  @ApiProperty({
    type: [String],
    description:
      'Array of MongoDB ObjectIDs referencing specific Product variants',
  })
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }] })
  products: Types.ObjectId[];

  @ApiProperty({
    example: 1,
    default: 0,
    description: 'Sorting order for display',
  })
  @Prop({ default: 0 })
  order: number;
}

export type GroupedProductDocument = GroupedProduct & Document;
export const GroupedProductSchema =
  SchemaFactory.createForClass(GroupedProduct);

// Indexing for faster sorting and category filtering
GroupedProductSchema.index({ category_id: 1, order: 1 });
