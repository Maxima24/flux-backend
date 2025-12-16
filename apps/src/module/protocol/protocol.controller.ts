import {Controller,Get,Post,Body,Patch,Param,Delete} from '@nestjs/common';
import {ProtocolService} from './protocol.service';
import {CreateProtocolDto} from './dto/create-protocol.dto';
import {UpdateProtocolDto} from './dto/update-protocol.dto';

@Controller('protocols')
export class ProtocolController{
    constructor(private readonly protocolService:ProtocolService){}
    @Post()
    create(@Body() data:CreateProtocolDto){
        return this.protocolService.create(data)
    }
    @Get()
    findAll(){
        return this.protocolService.findAll()
    }
    @Get(':id')
    findOne(@Param('id') id:string){
        return this.protocolService.findOne(id)
    }
    @Patch(':id')
    update(@Param('id') id:string,@Body() data:UpdateProtocolDto){
        return this.protocolService.update(id,data)
    }
    @Delete(':id')
    remove(@Param('id') id:string){
        return this.protocolService.remove(id)
    }
    @Patch(':id/deactivate')
    deactivate(@Param("id") id:string){
        return this.protocolService.deactivate(id)
    }


}