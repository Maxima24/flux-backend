import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProtocolsService } from './protocols.service';
import { CreateProtocolDto } from './dto/create-protocol.dto';
import { UpdateProtocolDto } from './dto/update-protocol.dto';

@Controller('protocols')
export class ProtocolsController {
  constructor(private readonly protocolsService: ProtocolsService) {}

  @Post()
  create(@Body() createProtocolDto: CreateProtocolDto) {
    return this.protocolsService.create(createProtocolDto);
  }

  @Get()
  findAll() {
    return this.protocolsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.protocolsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProtocolDto: UpdateProtocolDto) {
    return this.protocolsService.update(+id, updateProtocolDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.protocolsService.remove(+id);
  }
}
