import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { CreateGroupedProductDto } from './dtos/create-grouped-product.dto';
import { GroupedProduct, GroupedProductDocument } from './schemas/grouped-product.schema';
import { UpdateGroupedProductDto } from './dtos/update-grouped-product.dto';

const MODIFIER_POPULATE = {
  path: 'group_modifiers',
  populate: { path: 'modifiers' },
};

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,

    @InjectModel(GroupedProduct.name)
    private readonly groupedProductModel: Model<GroupedProductDocument>,
  ) {}

  // ── Single Products ──────────────────────────────────────────────────────────

  async findAll(): Promise<Product[]> {
    return this.productModel
      .find()
      .populate('category_id')
      .populate(MODIFIER_POPULATE)
      .exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel
      .findById(id)
      .populate('category_id')
      .populate(MODIFIER_POPULATE)
      .populate('well_together_products')
      .exec();

    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    return new this.productModel(dto).save();
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const updated = await this.productModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException(`Product ${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<{ deleted: true }> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Product ${id} not found`);
    return { deleted: true };
  }

  // ── Grouped Products ─────────────────────────────────────────────────────────

  async getAllGroupedProducts(
    page = 1,
    limit = 50,
  ): Promise<PaginatedResult<GroupedProduct>> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.groupedProductModel
        .find()
        .populate({
          path: 'products',
          populate: [
            { path: 'category_id' },
            MODIFIER_POPULATE,
          ],
        })
        .sort({ order: 1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.groupedProductModel.countDocuments(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getGroupedProductById(id: string): Promise<GroupedProduct> {
    const group = await this.groupedProductModel
      .findById(id)
      .populate({
        path: 'products',
        populate: [{ path: 'category_id' }, MODIFIER_POPULATE],
      })
      .exec();

    if (!group) throw new NotFoundException(`Grouped product ${id} not found`);
    return group;
  }

  async createGroupedProduct(dto: CreateGroupedProductDto): Promise<GroupedProduct> {
    return new this.groupedProductModel(dto).save();
  }

  async updateGroupedProduct(id: string, dto: UpdateGroupedProductDto): Promise<GroupedProduct> {
    const updated = await this.groupedProductModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException(`Grouped product ${id} not found`);
    return updated;
  }

  async removeGroupedProduct(id: string): Promise<{ deleted: true }> {
    const result = await this.groupedProductModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Grouped product ${id} not found`);
    return { deleted: true };
  }
}
