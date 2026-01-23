/**
 * 플랫폼 타입 정의
 */
export type Platform = "cloudflare" | "node";

/**
 * Cloudflare 전용 컨텍스트
 *
 * Cloudflare Workers 환경에서 사용되는 컨텍스트입니다.
 * react-router.d.ts의 AppLoadContext에서 활용됩니다.
 *
 * @remarks Env 타입은 worker-configuration.d.ts에서 정의됩니다.
 */
export interface CloudflareContext {
	env: Env;
	ctx: ExecutionContext;
}
