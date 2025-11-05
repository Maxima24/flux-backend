import {Module} from '@nestjs/common';
import {ProtocolService} from './protocol.service';
import {ProtocolController} from './protocol.controller';
import {PrismaService} from '../prisma/prisma.service';
@Module({
    controllers:[ProtocolController],
    providers:[ProtocolService,PrismaService],
    exports:[ProtocolService]

})
export class ProtocolModule{}