import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Modifier } from './schemas/modifier.schema';
import { CreateModifierDto } from './dtos/create-modifier.dto';
import { UpdateModifierDto } from './dtos/update-modifier.dto';

@Injectable()
export class ModifiersService {
  constructor(@InjectModel(Modifier.name) private readonly modifierModel: Model<Modifier>) {}

  async findAll(): Promise<Modifier[]> {
    return this.modifierModel.find().exec();
  }

  async findOne(id: string): Promise<Modifier> {
    const modifier = await this.modifierModel.findById(id).exec();
    if (!modifier) throw new NotFoundException(`Modifier ${id} not found`);
    return modifier;
  }

  async create(dto: CreateModifierDto): Promise<Modifier> {
    return new this.modifierModel(dto).save();
  }

  async update(id: string, dto: UpdateModifierDto): Promise<Modifier> {
    const updated = await this.modifierModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) throw new NotFoundException(`Modifier ${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<{ deleted: true }> {
    const result = await this.modifierModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Modifier ${id} not found`);
    return { deleted: true };
  }
}
