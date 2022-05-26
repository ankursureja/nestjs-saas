import {
	BadRequestException,
	MiddlewareConsumer,
	Module
} from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ErrorsInterceptor } from "./shared/interceptor/error.interceptor";
import { ResponseTransformInterceptor } from "./shared/interceptor/response.interceptor";
import { TenancyModule } from "./tenancy/tenancy.module";
import { NextFunction, Request, Response } from "express";
import { Connection, createConnection, getConnection } from "typeorm";
import { join } from "path";
import { UsersModule } from "./web/users/users.module";

@Module({
	imports: [
		TenancyModule,
    	UsersModule
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_INTERCEPTOR,
			useClass: ResponseTransformInterceptor
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: ErrorsInterceptor
		}
	]
})
export class AppModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer
			.apply(async (req: Request, res: Response, next: NextFunction) => {
				var subdomain = req.hostname.split('.')[0] as string;

				if (!subdomain) {
					throw new BadRequestException("Incorrect subdomain name supplied");
				}

				try {
					getConnection(subdomain);
					next();
				} catch {
					const newConnection: Connection = await createConnection({
						type: "mysql",
						timezone: "UTC",
						host: process.env.DATABASE_HOST,
						port: +process.env.DATABASE_PORT,
						username: process.env.DATABASE_USER,
						password: process.env.DATABASE_PASSWORD,
						database: subdomain + process.env.DATABASE_CLIENTS_POSTFIX,
						name: subdomain,
						entities: [join(__dirname, "./shared/entity/*.entity.{js,ts}")],
						// subscribers: [
						// 	join(__dirname, "./shared/listener/*.subscribers.{js,ts}")
						// ],
						//migrations: [join(__dirname, "./shared/migrations/*.{js,ts}")],
						//migrationsRun: true
						synchronize: true
					});
					if (newConnection.isConnected) {
						//await newConnection.runMigrations()
						next();
					} else {
						throw new BadRequestException(
							"Database connection error",
							"There is an error with database connection"
						);
					}
				}
			})
			.forRoutes("*");
	}
}
