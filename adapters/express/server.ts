import path from "node:path";
import { createRequestHandler } from "@react-router/express";
import { extractNodeEnv } from "adapters/shared/node.env.adapter";
import express from "express";
import type { ServerBuild } from "react-router";
import type { ViteDevServer } from "vite";
import { createContainer } from "~/infrastructure/config/container";

// 타입 선언은 adapters/shared/react-router.d.ts에서 관리
import "adapters/shared/react-router.d.ts";

const PORT = Number(process.env.PORT) || 3000;
const isDev = process.env.NODE_ENV !== "production";

/**
 * Express 서버 시작
 */
export const startExpressServer = async () => {
	// 환경 변수 추출
	const env = extractNodeEnv();

	const app = express();

	let viteServer: ViteDevServer | undefined;
	let build: ServerBuild | (() => Promise<ServerBuild>);

	if (isDev) {
		// 개발 모드: Vite 미들웨어 사용
		const vite = await import("vite");
		viteServer = await vite.createServer({
			server: { middlewareMode: true },
		});
		app.use(viteServer.middlewares);

		build = async () => {
			const mod = await viteServer!.ssrLoadModule(
				"virtual:react-router/server-build",
			);
			return mod as ServerBuild;
		};
	} else {
		// 프로덕션 모드: 동적 import로 ServerBuild 로드
		const clientPath = path.join(process.cwd(), "build/client");
		app.use(
			"/assets",
			express.static(path.join(clientPath, "assets"), {
				immutable: true,
				maxAge: "1y",
			}),
		);
		app.use(express.static(clientPath, { maxAge: "1h" }));

		// 빌드 시 Vite가 이 import를 resolve하여 ServerBuild를 인라인
		// 개발 모드에서는 이 코드가 실행되지 않으므로 tsx에서도 오류 없음
		const serverBuild = await import("virtual:react-router/server-build");
		build = serverBuild as unknown as ServerBuild;
	}

	// React Router 요청 핸들러 (Express 5 호환)
	app.all(
		"/{*path}",
		createRequestHandler({
			build,
			getLoadContext: () => {
				// 매 요청마다 새 컨테이너 생성
				const container = createContainer(env);

				return {
					env,
					platform: "node" as const,
					container,
					cloudflare: undefined,
				};
			},
		}),
	);

	app.listen(PORT, () => {
		console.log(
			`[Express] 서버가 http://localhost:${PORT} 에서 실행 중입니다 (${isDev ? "개발" : "프로덕션"} 모드)`,
		);
	});
};

// 직접 실행 시 서버 시작
if (import.meta.url === `file://${process.argv[1]}`) {
	startExpressServer();
}

export default startExpressServer;
