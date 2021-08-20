import { Body, Controller, Post } from '@nestjs/common';

@Controller('api/webhooks')
export class WebhooksController {
  @Post('twitch')
  twitchWebhook(@Body() payload) {
    console.log(payload);
  }
}
