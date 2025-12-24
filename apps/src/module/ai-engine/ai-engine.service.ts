import { Injectable } from '@nestjs/common';
import { CreateAiEngineDto } from './dto/create-ai-engine.dto';
import { UpdateAiEngineDto } from './dto/update-ai-engine.dto';

@Injectable()
export class AiEngineService {
  create(createAiEngineDto: CreateAiEngineDto) {
    return 'This action adds a new aiEngine';
  }

  findAll() {
    return `This action returns all aiEngine`;
  }

  findOne(id: number) {
    return `This action returns a #${id} aiEngine`;
  }

  update(id: number, updateAiEngineDto: UpdateAiEngineDto) {
    return `This action updates a #${id} aiEngine`;
  }

  remove(id: number) {
    return `This action removes a #${id} aiEngine`;
  }
}
