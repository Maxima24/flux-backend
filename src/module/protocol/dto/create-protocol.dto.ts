import { IsString, IsOptional, IsBoolean, IsJSON } from 'class-validator';

export class CreateProtocolDto {
  @IsString()
  name: string;

  @IsString()
  displayName: string;

  @IsString()
  chain: string;

  @IsOptional()
  @IsString()
  contractAddress?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  metadata?: Record<string, any>;
}
