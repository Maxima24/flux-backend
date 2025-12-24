import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AiEngineService } from './ai-engine.service';
import { CreateAiEngineDto } from './dto/create-ai-engine.dto';
import { UpdateAiEngineDto } from './dto/update-ai-engine.dto';

@Controller('ai-engine')
export class AiEngineController {
  constructor(private readonly aiEngineService: AiEngineService) {}

  @Post()
  create(@Body() createAiEngineDto: CreateAiEngineDto) {
    return this.aiEngineService.create(createAiEngineDto);
  }

  @Get()
  findAll() {
    return this.aiEngineService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aiEngineService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAiEngineDto: UpdateAiEngineDto) {
    return this.aiEngineService.update(+id, updateAiEngineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aiEngineService.remove(+id);
  }
}
