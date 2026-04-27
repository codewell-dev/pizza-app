import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ── Status enum ──────────────────────────────────────────────────────────────

export enum OrderStatus {
  PENDING = 'pending',       // Прийнято, очікує підтвердження
  CONFIRMED = 'confirmed',   // Підтверджено рестораном
  PREPARING = 'preparing',   // Готується
  DELIVERING = 'delivering', // Передано кур'єру
  DONE = 'done',             // Доставлено
  CANCELLED = 'cancelled',   // Скасовано
}

// ── Snapshot sub-schemas — зберігаємо дані на момент замовлення ──────────────

@Schema({ _id: false })
export class OrderModifierSnapshot {
  @Prop() _id: string;
  @Prop() title: string;
  @Prop() price: number;
  @Prop() count: number;
}

@Schema({ _id: false })
export class OrderItemSnapshot {
  @Prop({ required: true }) productId: string;
  @Prop({ required: true }) title: string;
  @Prop({ required: true }) price: number;   // ціна з модифікаторами на момент замовлення
  @Prop({ required: true }) count: number;
  @Prop() weight: string;
  @Prop() imageLarge: string;
  @Prop({ type: [OrderModifierSnapshot], default: [] })
  modifiers: OrderModifierSnapshot[];
}

@Schema({ _id: false })
export class DeliveryAddress {
  @Prop() street: string;
  @Prop() house: string;
  @Prop() apartment: string;
}

// ── Main Order Schema ────────────────────────────────────────────────────────

@Schema({ timestamps: true })
export class Order extends Document {
  @ApiProperty({ type: String, description: 'Reference to User' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @ApiProperty({ enum: OrderStatus, example: OrderStatus.PENDING })
  @Prop({ enum: OrderStatus, default: OrderStatus.PENDING, index: true })
  status: OrderStatus;

  @ApiProperty({ example: 1250, description: 'Total order price at time of order' })
  @Prop({ required: true })
  totalPrice: number;

  @ApiProperty({ type: [OrderItemSnapshot] })
  @Prop({ type: [OrderItemSnapshot], required: true })
  items: OrderItemSnapshot[];

  @ApiProperty({ example: 'delivery', enum: ['delivery', 'pickup'] })
  @Prop({ enum: ['delivery', 'pickup'], default: 'delivery' })
  deliveryType: string;

  @ApiPropertyOptional()
  @Prop({ type: DeliveryAddress })
  address: DeliveryAddress;

  @ApiProperty({ example: 'cash', enum: ['cash', 'card', 'online'] })
  @Prop({ enum: ['cash', 'card', 'online'], default: 'cash' })
  paymentMethod: string;

  @ApiProperty({ example: 'Іван', description: 'Customer name' })
  @Prop({ required: true })
  customerName: string;

  @ApiProperty({ example: '+380991234567' })
  @Prop({ required: true })
  customerPhone: string;

  @ApiPropertyOptional({ example: 'Без цибулі' })
  @Prop()
  comment: string;
}

export type OrderDocument = Order & Document;
export const OrderSchema = SchemaFactory.createForClass(Order);

// Indexes for common queries
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });
