import { Module } from '@nestjs/common';
import { LeadService } from './lead.service';
import { LeadController } from './lead.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads', // Diretório temporário onde os arquivos CSV serão salvos
    }),
  ],
  controllers: [LeadController],
  providers: [LeadService],
})
export class LeadModule {}
