import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";

// 공통 환경 변수 인터페이스 re-export
export type { AppEnv } from "adapters/shared/env.interface";
export { validateRequiredEnv } from "adapters/shared/env.interface";

// 하위 호환성을 위한 별칭 (Deprecated)
export type { AppEnv as CloudflareAuthEnv } from "adapters/shared/env.interface";

import type { AppEnv } from "adapters/shared/env.interface";
import { validateRequiredEnv } from "adapters/shared/env.interface";

/**
 * 환경 변수 추출 헬퍼
 *
 * Context에서 환경 변수를 추출하고 필수 값을 검증합니다.
 * Cloudflare와 Node.js 모두 지원합니다.
 *
 * @param context - Loader 또는 Action 컨텍스트
 * @returns 환경 변수
 * @throws Error 필수 환경 변수가 없을 경우
 */
export const extractEnv = (
	context: LoaderFunctionArgs["context"] | ActionFunctionArgs["context"],
): AppEnv => {
	// 새 구조: context.env (모든 플랫폼 공통)
	if ("env" in context && context.env) {
		const env = context.env as AppEnv;
		validateRequiredEnv(env);
		return env;
	}

	// 기존 Cloudflare 구조 (하위 호환성)
	if ("cloudflare" in context && context.cloudflare?.env) {
		const env = context.cloudflare.env as AppEnv;
		validateRequiredEnv(env);
		return env;
	}

	throw new Error(
		"환경 변수를 찾을 수 없습니다. context.env 또는 context.cloudflare.env를 확인하세요.",
	);
};
