/**
 * 공통 환경 변수 인터페이스
 *
 * 모든 배포 플랫폼(Cloudflare, Express, Fastify)에서 사용되는 환경 변수를 정의합니다.
 * 플랫폼별 어댑터에서 이 인터페이스로 환경 변수를 변환합니다.
 */
export interface AppEnv {
	// 필수 환경 변수
	DATABASE_URL: string;
	BASE_URL: string;
	BETTER_AUTH_SECRET: string;

	// OAuth: GitHub
	GITHUB_CLIENT_ID?: string;
	GITHUB_CLIENT_SECRET?: string;

	// OAuth: Google
	GOOGLE_CLIENT_ID?: string;
	GOOGLE_CLIENT_SECRET?: string;

	// OAuth: Kakao
	KAKAO_CLIENT_ID?: string;
	KAKAO_CLIENT_SECRET?: string;

	// Email: Resend
	RESEND_API_KEY?: string;
	RESEND_FROM_EMAIL?: string;
}

/**
 * 필수 환경 변수 검증
 *
 * @param env - 환경 변수 객체
 * @throws Error 필수 환경 변수가 누락된 경우
 */
export const validateRequiredEnv = (
	env: Partial<AppEnv>,
): env is AppEnv & { DATABASE_URL: string; BASE_URL: string; BETTER_AUTH_SECRET: string } => {
	const required = ["DATABASE_URL", "BASE_URL", "BETTER_AUTH_SECRET"] as const;
	const missing = required.filter((key) => !env[key]);

	if (missing.length > 0) {
		throw new Error(
			`필수 환경 변수가 설정되지 않았습니다: ${missing.join(", ")}`,
		);
	}

	return true;
};
