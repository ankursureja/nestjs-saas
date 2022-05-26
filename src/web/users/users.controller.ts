import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { GlobalResponseType } from 'src/utils/types';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
		private readonly UsersService: UsersService
	) {}


    @ApiResponse({ status: 400, description: "Bad Request" })
	@ApiResponse({ status: 201, description: "CREATED Response" })
	@Get("getUsers")
	
	async getUsersAction(): GlobalResponseType {
		return await this.UsersService.getUsers();
	}
}
