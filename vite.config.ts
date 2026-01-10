import { cloudflare } from "@cloudflare/vite-plugin"; // 👈 추가
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [
		cloudflare({ viteEnvironment: { name: "ssr" } }),
		tailwindcss(),
		reactRouter(),
		tsconfigPaths(),
	],
	server: {
		host: "0.0.0.0", // 모든 네트워크 인터페이스에서 접근 허용 (모바일 접속 가능)
		port: 5173, // 기본 포트 (필요시 변경 가능)
		strictPort: false, // 포트가 사용 중이면 다른 포트 자동 선택
		allowedHosts: true, // 모든 호스트 허용
		watch: {
			ignored: [
				"**/*.spec.ts",
				"**/*.test.ts",
				"**/tests/**",
				"**/playwright-report/**",
				"**/test-results/**",
			],
		},
	},
});
