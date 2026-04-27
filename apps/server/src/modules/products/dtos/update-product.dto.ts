import { PartialType } from '@nestjs/swagger'; // Changed from @nestjs/mapped-types
import { CreateProductDto } from './create-product.dto';

/**
 * DTO for updating an existing product variant.
 * Inherits all validation rules from CreateProductDto but marks all fields as optional.
 */
export class UpdateProductDto extends PartialType(CreateProductDto) {}
