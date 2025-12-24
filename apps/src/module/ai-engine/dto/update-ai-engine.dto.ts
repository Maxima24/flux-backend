import { PartialType } from '@nestjs/mapped-types';
import { CreateAiEngineDto } from './create-ai-engine.dto';

export class UpdateAiEngineDto extends PartialType(CreateAiEngineDto) {}
