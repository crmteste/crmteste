import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { CreateBuyerDto } from './dto/create-buyer.dto';
import { UpdateBuyerDto } from './dto/update-buyer.dto';

@Controller('buyers')
export class BuyerController {
  constructor(private readonly buyerService: BuyerService) {}

  @Post()
  async create(@Body() dto: CreateBuyerDto) {
    console.log('POST /buyers - Payload recebido:', dto);
    try {
      const createdBuyer = await this.buyerService.create(dto);
      console.log('Comprador criado com sucesso:', createdBuyer);
      return createdBuyer;
    } catch (error) {
      console.error('Erro ao criar comprador:', error);
      throw error;
    }
  }

  @Get('lead/:leadId')
  async findByLead(@Param('leadId') leadId: string) {
    return this.buyerService.findByLead(leadId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.buyerService.remove(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateBuyerDto) {
    return this.buyerService.update(id, dto);
  }
}
