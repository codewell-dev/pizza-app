import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { GroupModifiersService } from './group-modifiers.service';
import { CreateGroupModifierDto } from './dtos/create-group-modifier.dto';
import { UpdateGroupModifierDto } from './dtos/update-group-modifier.dto';
import { Public } from '../auth/auth.guard';

@ApiTags('Group Modifiers')
@Controller('group-modifiers')
export class GroupModifiersController {
  constructor(private readonly groupModifiersService: GroupModifiersService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all group modifiers (with populated modifiers)' })
  findAll() { return this.groupModifiersService.findAll(); }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get group modifier by ID' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  findOne(@Param('id') id: string) { return this.groupModifiersService.findOne(id); }

  @ApiBearerAuth('JWT-auth')
  @Post()
  @ApiOperation({ summary: 'Create group modifier' })
  create(@Body() dto: CreateGroupModifierDto) { return this.groupModifiersService.create(dto); }

  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  @ApiOperation({ summary: 'Update group modifier' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  update(@Param('id') id: string, @Body() dto: UpdateGroupModifierDto) {
    return this.groupModifiersService.update(id, dto);
  }

  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete group modifier' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  remove(@Param('id') id: string) { return this.groupModifiersService.remove(id); }
}
