import { Injectable } from '@nestjs/common';
import { ResponseMap } from './utils/constant';
import { GlobalResponseType } from './utils/types';

@Injectable()
export class AppService {
  async serverRunning(): GlobalResponseType {
    return ResponseMap(
      {
        message: `Server running on port ${process.env.PORT} !`,
      },
    );
  }
}
