import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Schema({ timestamps: true })
export class User extends Document {
  @ApiProperty({ example: 'john@pizza.com', description: 'Unique user email' })
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Exclude() // never expose in API responses
  @Prop({ required: true })
  password: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
