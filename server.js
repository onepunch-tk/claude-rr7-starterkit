/**
 * Node.js 프로덕션 서버 진입점 (JavaScript)
 *
 * 빌드된 서버 코드를 로드하여 실행합니다.
 * tsx 없이 순수 Node.js로 실행 가능합니다.
 *
 * 사용법:
 *   node server.js                      # Express 서버 (기본)
 *   SERVER=fastify node server.js       # Fastify 서버
 */

import("./build/server/index.js").catch((error) => {
	console.error("[Server] 서버 로드 실패:", error);
	console.error("[Server] 먼저 'bun run build:node' 명령으로 빌드하세요.");
	process.exit(1);
});
