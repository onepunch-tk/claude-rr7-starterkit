import type { IContainer } from "~/application/shared/container.types";
import type { AppEnv } from "./env.interface";

/**
 * 플랫폼 타입 정의
 */
export type Platform = "cloudflare" | "node";

/**
 * Cloudflare 전용 컨텍스트
 */
export interface CloudflareContext {
	env: AppEnv & Record<string, unknown>;
	ctx: ExecutionContext;
}

/**
 * 범용 AppLoadContext 인터페이스
 *
 * 모든 플랫폼에서 loader/action에서 접근 가능한 컨텍스트입니다.
 * - Cloudflare: cloudflare 속성이 존재
 * - Node.js (Express/Fastify): cloudflare 속성이 undefined
 */
export interface AppContext {
	/** DI 컨테이너 - 모든 플랫폼 공통 */
	container: IContainer;

	/** 환경 변수 - 모든 플랫폼 공통 */
	env: AppEnv;

	/** 현재 플랫폼 */
	platform: Platform;

	/** Cloudflare 전용 컨텍스트 (Node.js에서는 undefined) */
	cloudflare?: CloudflareContext;
}
