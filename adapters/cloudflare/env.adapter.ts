import type { AppEnv } from "adapters/shared/env";
import { parseEnv } from "adapters/shared/env";

/**
 * Cloudflare 환경 변수에서 AppEnv 추출
 *
 * Cloudflare Workers의 Env 객체에서 필요한 환경 변수를 추출합니다.
 *
 * @param cloudflareEnv - Cloudflare Workers Env 객체 (worker-configuration.d.ts의 Env 타입)
 * @returns AppEnv 환경 변수 객체
 * @throws ZodError 필수 환경 변수가 없을 경우
 */
export const extractCloudflareEnv = (cloudflareEnv: Env): AppEnv => {
	// Env 타입(wrangler types 생성)은 인덱스 시그니처가 없으므로
	// Record<string, unknown>으로 변환하려면 unknown을 경유해야 함
	// 이 캐스팅은 타입 안전성을 보장하는 parseEnv 내부에서만 사용됨
	const source = cloudflareEnv as unknown as Record<string, unknown>;
	return parseEnv(source);
};
