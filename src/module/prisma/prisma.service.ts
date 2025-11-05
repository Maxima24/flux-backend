import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import prisma from '../../config/prisma';
@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
    async onModuleInit(){
        await prisma.$connect()
        console.log("Prisma connnected:Connected to the database")
    }
    async onModuleDestroy(){
        await prisma.$disconnect()
         console.log("Prisma Disconnected:Disconnected from the database")
    }
    get client(){
    return prisma
}
}
