import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { GlobalResponseType } from './utils/types';
@ApiTags('Default Route')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'default route to identify port' })
  @ApiOkResponse({description: `returns Server running on port`})
  @Get('port')
  serverRunning(): GlobalResponseType {
    return this.appService.serverRunning();
  }
}
