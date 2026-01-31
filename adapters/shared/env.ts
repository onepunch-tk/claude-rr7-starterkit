import { z } from "zod";

/**
 * 환경 변수 스키마 (Single Source of Truth)
 *
 * 새 환경 변수 추가 시 이 스키마만 수정하면 됩니다:
 * - 필수: z.string()
 * - 선택: z.string().optional()
 */
export const envSchema = z.object({
	// 필수 환경 변수
	DATABASE_URL: z.string(),
	BASE_URL: z.string(),
	BETTER_AUTH_SECRET: z.string(),

	// OAuth: GitHub
	GITHUB_CLIENT_ID: z.string().optional(),
	GITHUB_CLIENT_SECRET: z.string().optional(),

	// OAuth: Google
	GOOGLE_CLIENT_ID: z.string().optional(),
	GOOGLE_CLIENT_SECRET: z.string().optional(),

	// OAuth: Kakao
	KAKAO_CLIENT_ID: z.string().optional(),
	KAKAO_CLIENT_SECRET: z.string().optional(),

	// Email: Resend
	RESEND_API_KEY: z.string().optional(),
	RESEND_FROM_EMAIL: z.string().optional(),
});

/** 환경 변수 타입 (스키마에서 자동 추론) */
export type AppEnv = z.infer<typeof envSchema>;

/** 환경 변수 키 목록 (스키마에서 자동 추출) */
export const ENV_KEYS = Object.keys(envSchema.shape) as (keyof AppEnv)[];

/**
 * 환경 변수 소스에서 AppEnv 추출
 *
 * Cloudflare 환경(Record 객체)과 Node.js 환경(process.env) 모두에서
 * 동일한 로직으로 환경 변수를 추출합니다.
 *
 * @param source - 환경 변수 소스 (Cloudflare Env 또는 process.env)
 * @returns Partial<AppEnv> 환경 변수 객체
 */
export const extractEnvFromSource = (
	source: Record<string, unknown>,
): Partial<AppEnv> => {
	if (ENV_KEYS.length === 0) {
		return {} as unknown as Partial<AppEnv>;
	}

	const result: Record<string, string> = {};
	for (const key of ENV_KEYS) {
		const value = source[key as string];
		if (typeof value === "string") {
			result[key as string] = value;
		}
	}
	return result as unknown as Partial<AppEnv>;
};

/**
 * 환경 변수 검증 및 파싱
 *
 * Zod 스키마로 필수/선택 환경 변수를 자동 검증합니다.
 *
 * @param source - 환경 변수 소스 (Cloudflare Env 또는 process.env)
 * @returns AppEnv 검증된 환경 변수 객체
 * @throws ZodError 필수 환경 변수 누락 또는 타입 오류 시
 */
export const parseEnv = (source: Record<string, unknown>): AppEnv => {
	const partialEnv = extractEnvFromSource(source);
	return envSchema.parse(partialEnv);
};

/**
 * Node.js process.env에서 AppEnv 추출
 *
 * Express와 Fastify에서 공용으로 사용됩니다.
 *
 * @returns AppEnv 환경 변수 객체
 * @throws ZodError 필수 환경 변수가 없을 경우
 */
export const extractNodeEnv = (): AppEnv => {
	// process.env 타입(NodeJS.ProcessEnv)은 string | undefined 값을 가지므로
	// Record<string, unknown>으로 캐스팅 필요. parseEnv 내부에서 Zod 스키마로 검증됨
	return parseEnv(process.env as Record<string, unknown>);
};
