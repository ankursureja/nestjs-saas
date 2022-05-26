import { config } from "dotenv";
config();

export const ResponseMap = <T>(
	data: T,
	message?: string | ""
): { data: T; message: string } => {
	return {
		data,
		message: message || ""
	};
};

export const expired = +process.env.JWT_EXPIRY;
