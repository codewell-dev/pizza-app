import { PartialType } from '@nestjs/swagger';
import { CreateGroupModifierDto } from './create-group-modifier.dto';
export class UpdateGroupModifierDto extends PartialType(CreateGroupModifierDto) {}
