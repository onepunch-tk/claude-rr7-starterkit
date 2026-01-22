import type { AppEnv } from "./env.interface";
import { validateRequiredEnv } from "./env.interface";

/**
 * Node.js process.env에서 AppEnv 추출
 *
 * Express와 Fastify에서 공용으로 사용됩니다.
 *
 * @returns AppEnv 환경 변수 객체
 * @throws Error 필수 환경 변수가 없을 경우
 */
export const extractNodeEnv = (): AppEnv => {
	const env: Partial<AppEnv> = {
		DATABASE_URL: process.env.DATABASE_URL,
		BASE_URL: process.env.BASE_URL,
		BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,

		// OAuth: GitHub
		GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
		GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,

		// OAuth: Google
		GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

		// OAuth: Kakao
		KAKAO_CLIENT_ID: process.env.KAKAO_CLIENT_ID,
		KAKAO_CLIENT_SECRET: process.env.KAKAO_CLIENT_SECRET,

		// Email: Resend
		RESEND_API_KEY: process.env.RESEND_API_KEY,
		RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
	};

	validateRequiredEnv(env);

	return env as AppEnv;
};
