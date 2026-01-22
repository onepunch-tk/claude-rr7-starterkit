/**
 * Node.js 서버 애플리케이션
 *
 * Vite SSR 빌드 시 진입점으로 사용됩니다.
 * 빌드 후 build/server/index.js에 포함되어 tsx 없이 실행 가능합니다.
 *
 * SERVER 환경 변수로 Express 또는 Fastify 서버를 선택합니다.
 * - SERVER=express (기본값): Express 서버 시작
 * - SERVER=fastify: Fastify 서버 시작
 */

// .env 파일 로드
import "dotenv/config";

// 정적 import로 두 어댑터를 번들에 포함
import { startExpressServer } from "adapters/express/server";
import { startFastifyServer } from "adapters/fastify/server";

const server = process.env.SERVER || "express";

const startServer = async () => {
	console.log(`[Server] ${server.toUpperCase()} 서버를 시작합니다...`);

	if (server === "fastify") {
		await startFastifyServer();
	} else {
		await startExpressServer();
	}
};

// 서버 시작
startServer().catch((error) => {
	console.error("[Server] 서버 시작 실패:", error);
	process.exit(1);
});

// server.js에서 import할 수 있도록 export
export { startServer };
