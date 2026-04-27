import { PartialType } from '@nestjs/swagger'; // Changed from @nestjs/mapped-types
import { CreateGroupedProductDto } from './create-grouped-product.dto';

/**
 * DTO for updating a grouped product.
 * Inherits all fields from CreateGroupedProductDto but makes them optional.
 */
export class UpdateGroupedProductDto extends PartialType(
  CreateGroupedProductDto,
) {}
