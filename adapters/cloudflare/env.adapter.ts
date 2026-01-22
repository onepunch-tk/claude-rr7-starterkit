import type { AppEnv } from "adapters/shared/env.interface";
import { validateRequiredEnv } from "adapters/shared/env.interface";

/**
 * Cloudflare 환경 변수에서 AppEnv 추출
 *
 * Cloudflare Workers의 Env 객체에서 필요한 환경 변수를 추출합니다.
 *
 * @param cloudflareEnv - Cloudflare Workers Env 객체
 * @returns AppEnv 환경 변수 객체
 * @throws Error 필수 환경 변수가 없을 경우
 */
export const extractCloudflareEnv = (
	cloudflareEnv: Record<string, unknown>,
): AppEnv => {
	const env: Partial<AppEnv> = {
		DATABASE_URL: cloudflareEnv.DATABASE_URL as string | undefined,
		BASE_URL: cloudflareEnv.BASE_URL as string | undefined,
		BETTER_AUTH_SECRET: cloudflareEnv.BETTER_AUTH_SECRET as string | undefined,

		// OAuth: GitHub
		GITHUB_CLIENT_ID: cloudflareEnv.GITHUB_CLIENT_ID as string | undefined,
		GITHUB_CLIENT_SECRET: cloudflareEnv.GITHUB_CLIENT_SECRET as
			| string
			| undefined,

		// OAuth: Google
		GOOGLE_CLIENT_ID: cloudflareEnv.GOOGLE_CLIENT_ID as string | undefined,
		GOOGLE_CLIENT_SECRET: cloudflareEnv.GOOGLE_CLIENT_SECRET as
			| string
			| undefined,

		// OAuth: Kakao
		KAKAO_CLIENT_ID: cloudflareEnv.KAKAO_CLIENT_ID as string | undefined,
		KAKAO_CLIENT_SECRET: cloudflareEnv.KAKAO_CLIENT_SECRET as
			| string
			| undefined,

		// Email: Resend
		RESEND_API_KEY: cloudflareEnv.RESEND_API_KEY as string | undefined,
		RESEND_FROM_EMAIL: cloudflareEnv.RESEND_FROM_EMAIL as string | undefined,
	};

	validateRequiredEnv(env);

	return env as AppEnv;
};
