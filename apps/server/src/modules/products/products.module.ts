import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product, ProductSchema } from './schemas/product.schema';
import {
  GroupedProduct,
  GroupedProductSchema,
} from './schemas/grouped-product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      // Registering standalone product variants
      { name: Product.name, schema: ProductSchema },
      // Registering grouped products (collections of variants)
      { name: GroupedProduct.name, schema: GroupedProductSchema },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  // Exporting service in case it's needed in OrderModule or CartModule
  exports: [ProductsService],
})
export class ProductsModule {}
