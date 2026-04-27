import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './schemas/category.schema';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private readonly categoryModel: Model<Category>) {}

  async findAll(): Promise<Category[]> {
    return this.categoryModel
      .find()
      .populate('category_products')
      .populate({ path: 'category_group_products', populate: { path: 'products' } })
      .exec();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel
      .findById(id)
      .populate('category_products')
      .populate({ path: 'category_group_products', populate: { path: 'products' } })
      .exec();
    if (!category) throw new NotFoundException(`Category ${id} not found`);
    return category;
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    return new this.categoryModel(dto).save();
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const updated = await this.categoryModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException(`Category ${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<{ deleted: true }> {
    const result = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Category ${id} not found`);
    return { deleted: true };
  }
}
