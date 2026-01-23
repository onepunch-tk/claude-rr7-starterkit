import type { IContainer } from "~/application/shared/container.types";
import type { CloudflareContext, Platform } from "./context";
import type { AppEnv } from "./env";

/**
 * React Router의 AppLoadContext 타입 확장
 *
 * 모든 플랫폼(Cloudflare, Express, Fastify)에서 공통으로 사용됩니다.
 * - cloudflare: Cloudflare Workers 환경에서만 존재, Node.js에서는 undefined
 */
declare module "react-router" {
	export interface AppLoadContext {
		/** 환경 변수 */
		env: AppEnv;

		/** 현재 플랫폼 */
		platform: Platform;

		/** DI 컨테이너 */
		container: IContainer;

		/** Cloudflare 전용 컨텍스트 (Node.js에서는 undefined) */
		cloudflare?: CloudflareContext;
	}
}

/**
 * virtual:react-router/server-build 모듈 타입 선언
 *
 * Vite 빌드 시 React Router가 제공하는 가상 모듈입니다.
 * 프로덕션 빌드에서 ServerBuild가 번들에 인라인됩니다.
 */
declare module "virtual:react-router/server-build" {
	import type { ServerBuild } from "react-router";
	const serverBuild: ServerBuild;
	export default serverBuild;
	export * from "react-router";
}
