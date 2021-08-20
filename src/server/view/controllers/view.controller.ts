import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ViewService } from '../services/view.service';

@Controller('/')
export class ViewController {
  constructor(private viewService: ViewService) {}

  @Get('*')
  static(@Req() request: Request, @Res() response: Response) {
    const handle = this.viewService.getNextServer().getRequestHandler();
    handle(request, response);
  }
}
