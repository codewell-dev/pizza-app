import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModifiersController } from './modifiers.controller';
import { ModifiersService } from './modifiers.service';
import { Modifier, ModifierSchema } from './schemas/modifier.schema';
import { GroupModifiersController } from './group-modifiers.controller';
import { GroupModifiersService } from './group-modifiers.service';
import { GroupModifier, GroupModifierSchema } from './schemas/group-modifier.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Modifier.name, schema: ModifierSchema },
      { name: GroupModifier.name, schema: GroupModifierSchema },
    ]),
  ],
  controllers: [ModifiersController, GroupModifiersController],
  providers: [ModifiersService, GroupModifiersService],
  exports: [ModifiersService, GroupModifiersService],
})
export class ModifiersModule {}
