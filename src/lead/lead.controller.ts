// src/lead/lead.controller.ts
import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { LeadService } from './lead.service';
import { Prisma, Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('leads')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() data: Prisma.LeadCreateInput, @Req() req) {
    const userId = req.user.id;
    const leadData = {
      ...data,
      userId,
      stage: 'entrada',
    };
    return this.leadService.create(leadData);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req) {
    const userId = req.user.id;
    const role = req.user.role as Role;
    return this.leadService.findAll(userId, role);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leadService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.LeadUpdateInput) {
    return this.leadService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leadService.remove(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('bulk')
  @Roles(Role.ADMIN, Role.COLLABORATOR)
  async bulkCreate(@Body() leads: any[], @Req() req) {
    const userId = req.user.id;
    return this.leadService.createMany(leads, userId);
  }
}
