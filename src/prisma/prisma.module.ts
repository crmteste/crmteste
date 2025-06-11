import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()  // <- adicione isso aqui
@Module({
  providers: [PrismaService],
  exports: [PrismaService],  // <- adicione isso aqui
})
export class PrismaModule {}
