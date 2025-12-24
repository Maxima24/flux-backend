import { Injectable } from '@nestjs/common';
import { CreateProtocolDto } from './dto/create-protocol.dto';
import { UpdateProtocolDto } from './dto/update-protocol.dto';

@Injectable()
export class ProtocolsService {
  create(createProtocolDto: CreateProtocolDto) {
    return 'This action adds a new protocol';
  }

  findAll() {
    return `This action returns all protocols`;
  }

  findOne(id: number) {
    return `This action returns a #${id} protocol`;
  }

  update(id: number, updateProtocolDto: UpdateProtocolDto) {
    return `This action updates a #${id} protocol`;
  }

  remove(id: number) {
    return `This action removes a #${id} protocol`;
  }
}
