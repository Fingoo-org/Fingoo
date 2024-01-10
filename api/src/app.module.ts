import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommunityModule } from './community/community.module';

@Module({
  imports: [CommunityModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
