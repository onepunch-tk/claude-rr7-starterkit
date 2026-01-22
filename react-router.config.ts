import type { Config } from "@react-router/dev/config";

/**
 * React Router 설정 - 플랫폼별 조건부 구성
 *
 * PLATFORM 환경 변수에 따라 적절한 설정을 적용합니다.
 * - PLATFORM=cloudflare (기본값): v8_viteEnvironmentApi 활성화
 * - PLATFORM=node: v8_viteEnvironmentApi 비활성화
 */
const platform = process.env.PLATFORM || "cloudflare";

export default {
	ssr: true,
	future: {
		// Cloudflare Workers는 Vite Environment API 필요
		v8_viteEnvironmentApi: platform === "cloudflare",
	},
} satisfies Config;
