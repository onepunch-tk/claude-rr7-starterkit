import { createRequestHandler } from "react-router";
import { createContainer } from "~/infrastructure/config/container";
import { extractCloudflareEnv } from "./env.adapter";

// 타입 선언은 adapters/shared/react-router.d.ts에서 관리
import "adapters/shared/react-router.d.ts";

const requestHandler = createRequestHandler(
	() => import("virtual:react-router/server-build"),
	import.meta.env.MODE,
);

/**
 * Cloudflare Workers 진입점
 */
export default {
	async fetch(request, cloudflareEnv, ctx) {
		// 환경 변수 추출
		const env = extractCloudflareEnv(cloudflareEnv as unknown as Record<string, unknown>);

		// Composition Root: Container 생성 및 주입
		const container = createContainer(env);

		return requestHandler(request, {
			env,
			platform: "cloudflare",
			cloudflare: { env: cloudflareEnv, ctx },
			container,
		});
	},
} satisfies ExportedHandler<Env>;
