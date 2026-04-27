import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ModifiersService } from './modifiers.service';
import { CreateModifierDto } from './dtos/create-modifier.dto';
import { UpdateModifierDto } from './dtos/update-modifier.dto';
import { Public } from '../auth/auth.guard';

@ApiTags('Modifiers')
@Controller('modifiers')
export class ModifiersController {
  constructor(private readonly modifiersService: ModifiersService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all modifiers' })
  findAll() { return this.modifiersService.findAll(); }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get modifier by ID' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  @ApiResponse({ status: 404, description: 'Not found' })
  findOne(@Param('id') id: string) { return this.modifiersService.findOne(id); }

  @ApiBearerAuth('JWT-auth')
  @Post()
  @ApiOperation({ summary: 'Create modifier' })
  @ApiResponse({ status: 201, description: 'Modifier created' })
  create(@Body() dto: CreateModifierDto) { return this.modifiersService.create(dto); }

  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  @ApiOperation({ summary: 'Update modifier' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  update(@Param('id') id: string, @Body() dto: UpdateModifierDto) {
    return this.modifiersService.update(id, dto);
  }

  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete modifier' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  remove(@Param('id') id: string) { return this.modifiersService.remove(id); }
}
