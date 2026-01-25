import path from "node:path";
import fastifyStatic from "@fastify/static";
import middie from "@fastify/middie";
import { extractNodeEnv } from "adapters/shared/env";
import Fastify from "fastify";
import type { ViteDevServer } from "vite";
import {
	type AppLoadContext,
	createRequestHandler,
	type ServerBuild,
} from "react-router";
import { createContainer } from "~/infrastructure/config/container";

const PORT = Number(process.env.PORT) || 3000;
const isDev = process.env.NODE_ENV !== "production";

/**
 * Web Request를 Fastify 응답으로 변환
 */
const handleReactRouterRequest = async (
	request: Request,
	build: ServerBuild,
	loadContext: AppLoadContext,
): Promise<Response> => {
	const handler = createRequestHandler(
		build,
		isDev ? "development" : "production",
	);
	return handler(request, loadContext);
};

/**
 * Fastify 서버 시작
 */
export const startFastifyServer = async () => {
	// 환경 변수 추출
	const env = extractNodeEnv();

	const fastify = Fastify({
		logger: true,
	});

	let viteServer: ViteDevServer | undefined;
	let getBuild: () => Promise<ServerBuild>;

	if (isDev) {
		// 개발 모드: Vite 미들웨어 사용
		const vite = await import("vite");
		viteServer = await vite.createServer({
			server: { middlewareMode: true },
		});

		// Vite 미들웨어 등록 (Express 스타일)
		await fastify.register(middie);
		await fastify.use(viteServer.middlewares);

		getBuild = async () => {
			const mod = await viteServer!.ssrLoadModule(
				"virtual:react-router/server-build",
			);
			// Vite의 virtual:react-router/server-build 모듈은 ServerBuild 구조를 직접 export
			// ssrLoadModule 반환 타입이 Record<string, any>이므로 명시적 캐스팅 필요
			// React Router Vite 플러그인이 올바른 구조를 보장함
			return mod as ServerBuild;
		};
	} else {
		// 프로덕션 모드: 빌드 파일 사용
		// 정적 파일 서빙 (assets - 불변)
		await fastify.register(fastifyStatic, {
			root: path.join(process.cwd(), "build/client/assets"),
			prefix: "/assets/",
			immutable: true,
			maxAge: "1y",
		});

		// 정적 파일 서빙 (client - 1시간 캐시)
		await fastify.register(fastifyStatic, {
			root: path.join(process.cwd(), "build/client"),
			prefix: "/",
			decorateReply: false,
			maxAge: "1h",
			wildcard: false,
		});

		// 빌드 시 Vite가 이 import를 resolve하여 ServerBuild를 인라인
		// 개발 모드에서는 이 코드가 실행되지 않으므로 tsx에서도 오류 없음
		const serverBuild = await import("virtual:react-router/server-build");
		// 이중 캐스팅 이유: Vite 가상 모듈의 타입 정의(ImportMeta)가
		// 실제 런타임 ServerBuild 구조와 일치하지 않아 unknown 경유 필요
		getBuild = async () => serverBuild as unknown as ServerBuild;
	}

	// 모든 Content-Type에 대해 원시 바디를 수집 (React Router가 직접 처리)
	fastify.addContentTypeParser("*", (request, payload, done) => {
		const chunks: Buffer[] = [];
		payload.on("data", (chunk: Buffer) => chunks.push(chunk));
		payload.on("end", () => {
			done(null, Buffer.concat(chunks));
		});
		payload.on("error", done);
	});

	// React Router 요청 핸들러
	fastify.all("*", async (request, reply) => {
		// Fastify 요청을 Web Request로 변환
		const url = new URL(
			request.url,
			`http://${request.headers.host || "localhost"}`,
		);

		const headers = new Headers();
		for (const [key, value] of Object.entries(request.headers)) {
			if (value) {
				headers.set(key, Array.isArray(value) ? value.join(", ") : value);
			}
		}

		// 원시 바디 처리
		let body: BodyInit | undefined;
		if (request.method !== "GET" && request.method !== "HEAD") {
			const rawBody = request.body as Buffer | undefined;
			if (rawBody && rawBody.length > 0) {
				// Buffer를 Uint8Array로 변환 (BodyInit 호환)
				body = new Uint8Array(rawBody);
			}
		}

		const webRequest = new Request(url.toString(), {
			method: request.method,
			headers,
			body,
		});

		// 빌드 로드
		const build = await getBuild();

		// 매 요청마다 새 컨테이너 생성
		const container = createContainer(env);

		const loadContext: AppLoadContext = {
			env,
			platform: "node",
			container,
			cloudflare: undefined,
		};

		// React Router 요청 처리
		const response = await handleReactRouterRequest(
			webRequest,
			build,
			loadContext,
		);

		// Web Response를 Fastify 응답으로 변환
		reply.status(response.status);

		for (const [key, value] of response.headers) {
			reply.header(key, value);
		}

		const responseBody = await response.arrayBuffer();
		return reply.send(Buffer.from(responseBody));
	});

	try {
		await fastify.listen({ port: PORT, host: "0.0.0.0" });
		console.log(
			`[Fastify] 서버가 http://localhost:${PORT} 에서 실행 중입니다 (${isDev ? "개발" : "프로덕션"} 모드)`,
		);
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

// 직접 실행 시 서버 시작
if (import.meta.url === `file://${process.argv[1]}`) {
	startFastifyServer();
}
