/**
 * Node.js (Express/Fastify)용 Vite 설정
 *
 * Cloudflare 플러그인 없이 표준 SSR 빌드를 수행합니다.
 * server/app.ts를 SSR 빌드에 포함하여 프로덕션에서 tsx 없이 실행 가능합니다.
 */
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ isSsrBuild }) => ({
	plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
	build: {
		target: "node20",
		rollupOptions: isSsrBuild ? { input: "./server/app.ts" } : undefined,
	},
}));
