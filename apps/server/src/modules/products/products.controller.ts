import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { CreateGroupedProductDto } from './dtos/create-grouped-product.dto';
import { UpdateGroupedProductDto } from './dtos/update-grouped-product.dto';
import { Public } from '../auth/auth.guard';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ── Grouped Products ─────────────────────────────────────────────────────────

  @Public()
  @Get('grouped')
  @ApiOperation({ summary: 'Get all grouped products (paginated catalog with variants)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({ status: 200, description: 'Paginated grouped products' })
  getAllGrouped(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.productsService.getAllGroupedProducts(
      page ? Math.max(1, parseInt(page, 10)) : 1,
      limit ? Math.min(100, parseInt(limit, 10)) : 50,
    );
  }

  @Public()
  @Get('grouped/:id')
  @ApiOperation({ summary: 'Get grouped product by ID' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId of the grouped product' })
  @ApiResponse({ status: 200, description: 'Grouped product with all variants populated' })
  @ApiResponse({ status: 404, description: 'Grouped product not found' })
  getGroupedById(@Param('id') id: string) {
    return this.productsService.getGroupedProductById(id);
  }

  @ApiBearerAuth('JWT-auth')
  @Post('grouped')
  @ApiOperation({ summary: 'Create grouped product (pizza group with size variants)' })
  @ApiResponse({ status: 201, description: 'Grouped product created' })
  createGrouped(@Body() dto: CreateGroupedProductDto) {
    return this.productsService.createGroupedProduct(dto);
  }

  @ApiBearerAuth('JWT-auth')
  @Patch('grouped/:id')
  @ApiOperation({ summary: 'Update grouped product' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  updateGrouped(@Param('id') id: string, @Body() dto: UpdateGroupedProductDto) {
    return this.productsService.updateGroupedProduct(id, dto);
  }

  @ApiBearerAuth('JWT-auth')
  @Delete('grouped/:id')
  @ApiOperation({ summary: 'Delete grouped product' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  removeGrouped(@Param('id') id: string) {
    return this.productsService.removeGroupedProduct(id);
  }

  // ── Single Product Variants ───────────────────────────────────────────────────

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all product variants' })
  findAll() {
    return this.productsService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get product variant by ID (with modifiers populated)' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @ApiBearerAuth('JWT-auth')
  @Post()
  @ApiOperation({ summary: 'Create a product variant (e.g., Pizza 30cm)' })
  @ApiResponse({ status: 201, description: 'Product created' })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  @ApiOperation({ summary: 'Update product variant' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete product variant' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
