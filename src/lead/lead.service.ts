// src/lead/lead.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Role } from '@prisma/client';

@Injectable()
export class LeadService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.LeadCreateInput & { userId: string }) {
    return this.prisma.lead.create({
      data: {
        name: data.name,
        company: data.company,
        document: data.document,
        email: data.email,
        phone: data.phone,
        origin: data.origin,
        market: data.market,
        stage: 'entrada',
        user: {
          connect: { id: data.userId },
        },
      },
    });
  }

  async findAll(userId: string, role: Role) {
    const where = role === 'ADMIN' ? {} : { userId };

    const leads = await this.prisma.lead.findMany({
      where,
      include: {
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    return leads.map((lead) => {
      const lastActivity = lead.activities[0]?.createdAt ?? null;
      const { activities, ...rest } = lead;
      return {
        ...rest,
        lastActivityAt: lastActivity,
      };
    });
  }

  async findOne(id: string) {
    return this.prisma.lead.findUnique({ where: { id } });
  }

  async update(id: string, data: Prisma.LeadUpdateInput) {
    return this.prisma.lead.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.lead.delete({ where: { id } });
  }

  async createMany(leads: any[], userId: string) {
    const data = leads.map((lead) => ({
      name: lead.name,
      company: lead.company || null,
      document: lead.document || null,
      email: lead.email || null,
      phone: lead.phone || null,
      origin: lead.origin || null,
      market: lead.market || null,
      stage: lead.stage || 'entrada',
      userId,
    }));

    return this.prisma.lead.createMany({
      data,
      skipDuplicates: true,
    });
  }
}
