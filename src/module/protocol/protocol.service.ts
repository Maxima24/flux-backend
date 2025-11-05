import { Injectable,NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProtocolDto } from "./dto/create-protocol.dto";
import { UpdateProtocolDto } from "./dto/update-protocol.dto";
@Injectable()
export class ProtocolService{
    constructor(private prisma:PrismaService){}
    async create(data:CreateProtocolDto){
        return this.prisma.client.protocol.create({data})
    }
    async findAll(){
        return this.prisma.client.protocol.findMany({
            where:{isActive:true},
            orderBy:{createdAt:"desc"}
        })
    }
    async findOne(id:string){
        const protocol = await this.prisma.client.protocol.findUnique({
            where:{id}
        })
        if(!protocol) throw new NotFoundException('Protocol not found');
        return protocol

    }
    async update(id:string,data:UpdateProtocolDto){
        await this.findOne(id)
        return this.prisma.client.protocol.update({
            where:{id},data
        })
    }
    async deactivate(id:string){
        await this.findOne(id)
        return this.prisma.client.protocol.update({
            where:{id},
            data:{isActive:false}
        })
    }
    async remove(id:string){
        await this.findOne(id)
        return this.prisma.client.protocol.delete({
            where:{id}
        })
    }
    
}