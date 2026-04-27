import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GroupModifier } from './schemas/group-modifier.schema';
import { CreateGroupModifierDto } from './dtos/create-group-modifier.dto';
import { UpdateGroupModifierDto } from './dtos/update-group-modifier.dto';

@Injectable()
export class GroupModifiersService {
  constructor(
    @InjectModel(GroupModifier.name)
    private readonly groupModifierModel: Model<GroupModifier>,
  ) {}

  async findAll(): Promise<GroupModifier[]> {
    return this.groupModifierModel.find().populate('modifiers').exec();
  }

  async findOne(id: string): Promise<GroupModifier> {
    const group = await this.groupModifierModel.findById(id).populate('modifiers').exec();
    if (!group) throw new NotFoundException(`GroupModifier ${id} not found`);
    return group;
  }

  async create(dto: CreateGroupModifierDto): Promise<GroupModifier> {
    return new this.groupModifierModel(dto).save();
  }

  async update(id: string, dto: UpdateGroupModifierDto): Promise<GroupModifier> {
    const updated = await this.groupModifierModel
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('modifiers')
      .exec();
    if (!updated) throw new NotFoundException(`GroupModifier ${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<{ deleted: true }> {
    const result = await this.groupModifierModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`GroupModifier ${id} not found`);
    return { deleted: true };
  }
}
