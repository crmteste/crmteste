import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { LeadModule } from './lead/lead.module';
import { ActivityModule } from './activity/activity.module';
import { AuthModule } from './auth/auth.module';
import { BuyerModule } from './buyer/buyer.module'; // <== Importar aqui

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UserModule,
    LeadModule,
    ActivityModule,
    AuthModule,
    BuyerModule, // <== E adicionar no array
  ],
})
export class AppModule {}
