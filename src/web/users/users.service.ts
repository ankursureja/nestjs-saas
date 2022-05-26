import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from 'src/shared/entity/user.entity';
import { TenancyService } from 'src/tenancy/tenancy.service';
import { ResponseMap } from 'src/utils/constant';
import { GlobalResponseType } from 'src/utils/types';

@Injectable()
export class UsersService {
    constructor(
		private readonly tenancyService: TenancyService
	) {}

    userRepository = this.tenancyService.getEntityRepository(UserEntity);

    async getUsers(): GlobalResponseType {
		try {
			const users = await this.userRepository
				.createQueryBuilder("user")
				.getMany();

			return ResponseMap({
				users
			});
		} catch (error) {
			throw new HttpException(
				error,
				error.status || HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
	}
}
