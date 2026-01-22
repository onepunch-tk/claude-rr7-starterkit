/**
 * Vite 설정 - 플랫폼별 조건부 로드
 *
 * PLATFORM 환경 변수에 따라 적절한 설정을 로드합니다.
 * - PLATFORM=cloudflare (기본값): Cloudflare Workers 설정
 * - PLATFORM=node: Node.js (Express/Fastify) 설정
 */
const platform = process.env.PLATFORM || "cloudflare";

const config =
	platform === "node"
		? (await import("./vite.config.node")).default
		: (await import("./vite.config.cloudflare")).default;

export default config;
