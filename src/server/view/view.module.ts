import { Module } from '@nestjs/common';
import { ViewService } from './services/view.service';
import { ViewController } from './controllers/view.controller';

@Module({
  providers: [ViewService],
  controllers: [ViewController]
})
export class ViewModule {}
