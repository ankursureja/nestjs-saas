import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TenancyModule } from 'src/tenancy/tenancy.module';

@Module({
  imports: [TenancyModule],
	providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
