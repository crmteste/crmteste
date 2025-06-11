import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateBuyerDto {
  @IsString()
  name: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  role?: string;

  @IsUUID()
  leadId: string;
}
