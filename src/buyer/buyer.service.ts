import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBuyerDto } from './dto/create-buyer.dto';
import { UpdateBuyerDto } from './dto/update-buyer.dto';

@Injectable()
export class BuyerService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateBuyerDto) {
    const buyersCount = await this.prisma.buyer.count({
      where: { leadId: data.leadId },
    });

    if (buyersCount >= 10) {
      throw new BadRequestException('Limite de compradores atingido.');
    }

    try {
      return await this.prisma.buyer.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role,
          leadId: data.leadId,
        },
      });
    } catch (error) {
      throw new BadRequestException('Erro ao criar comprador: ' + error.message);
    }
  }

  async findByLead(leadId: string) {
    return this.prisma.buyer.findMany({ where: { leadId } });
  }

  async remove(id: string) {
    try {
      return await this.prisma.buyer.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Comprador não encontrado.');
    }
  }

  async update(id: string, data: UpdateBuyerDto) {
    try {
      const existing = await this.prisma.buyer.findUnique({ where: { id } });
      if (!existing) throw new NotFoundException('Comprador não encontrado.');

      return await this.prisma.buyer.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new BadRequestException('Erro ao atualizar comprador: ' + error.message);
    }
  }
}
