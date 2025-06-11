import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Injectable()
export class ActivityService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateActivityDto) {
    return this.prisma.activity.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.activity.findMany({
      include: { lead: true },
    });
  }

  async findOne(id: string) {
    const activity = await this.prisma.activity.findUnique({
      where: { id },
      include: { lead: true },
    });

    if (!activity) {
      throw new NotFoundException('Atividade não encontrada');
    }

    return activity;
  }

  async findByLead(leadId: string) {
    return this.prisma.activity.findMany({
      where: { leadId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: UpdateActivityDto) {
    return this.prisma.activity.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.activity.delete({
      where: { id },
    });
  }
}
