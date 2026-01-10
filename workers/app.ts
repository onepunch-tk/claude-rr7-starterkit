import { createRequestHandler } from "react-router";

/**
 * React Router의 AppLoadContext에 Cloudflare 환경 정보 추가
 * loader/action에서 context.cloudflare.env로 접근 가능
 */
declare module "react-router" {
	export interface AppLoadContext {
		cloudflare: {
			env: Env;
			ctx: ExecutionContext;
		};
	}
}

const requestHandler = createRequestHandler(
	() => import("virtual:react-router/server-build"),
	import.meta.env.MODE,
);

export default {
	async fetch(request, env, ctx): Promise<Response> {
		try {
			return await requestHandler(request, { cloudflare: { env, ctx } });
		} catch (error) {
			console.error("Worker fetch error:", error);
			return new Response("Internal Server Error", { status: 500 });
		}
	},
} satisfies ExportedHandler<Env>;
