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
 * @remarks
 * - ctx: Workers의 ExecutionContext (waitUntil, passThroughOnException 등)
 * - env는 AppEnv로 통합되어 별도로 제공하지 않습니다.
 * - KV/D1 등 바인딩 접근은 loader에서 직접 처리하세요.
 */
export interface CloudflareContext {
	ctx: ExecutionContext;
}
