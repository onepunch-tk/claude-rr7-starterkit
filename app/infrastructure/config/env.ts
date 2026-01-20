import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";

/**
 * Cloudflare Workers 환경 변수 타입
 */
export interface CloudflareAuthEnv {
	DATABASE_URL: string;
	BASE_URL: string;
	BETTER_AUTH_SECRET: string;
	GITHUB_CLIENT_ID?: string;
	GITHUB_CLIENT_SECRET?: string;
	GOOGLE_CLIENT_ID?: string;
	GOOGLE_CLIENT_SECRET?: string;
	KAKAO_CLIENT_ID?: string;
	KAKAO_CLIENT_SECRET?: string;
	RESEND_API_KEY?: string;
	RESEND_FROM_EMAIL?: string;
}

/**
 * 환경 변수 추출 헬퍼
 *
 * Context에서 Cloudflare 환경 변수를 추출하고 필수 값을 검증합니다.
 *
 * @param context - Loader 또는 Action 컨텍스트
 * @returns Cloudflare 환경 변수
 * @throws Error 필수 환경 변수가 없을 경우
 */
export const extractEnv = (
	context: LoaderFunctionArgs["context"] | ActionFunctionArgs["context"],
): CloudflareAuthEnv => {
	const env = context.cloudflare?.env as CloudflareAuthEnv | undefined;

	if (!env?.DATABASE_URL || !env?.BASE_URL || !env?.BETTER_AUTH_SECRET) {
		throw new Error(
			"필수 환경 변수가 설정되지 않았습니다. " +
				"DATABASE_URL, BASE_URL, BETTER_AUTH_SECRET를 확인하세요.",
		);
	}

	return env;
};
