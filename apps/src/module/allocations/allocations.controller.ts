import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AllocationsService } from './allocations.service';
import { CreateAllocationDto } from './dto/create-allocation.dto';
import { UpdateAllocationDto } from './dto/update-allocation.dto';

@Controller('allocations')
export class AllocationsController {
  constructor(private readonly allocationsService: AllocationsService) {}

  @Post()
  create(@Body() createAllocationDto: CreateAllocationDto) {
    return this.allocationsService.create(createAllocationDto);
  }

  @Get()
  findAll() {
    return this.allocationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.allocationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAllocationDto: UpdateAllocationDto) {
    return this.allocationsService.update(+id, updateAllocationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.allocationsService.remove(+id);
  }
}
