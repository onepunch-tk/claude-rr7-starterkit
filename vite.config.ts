import { cloudflare } from "@cloudflare/vite-plugin"; // 👈 추가
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ isSsrBuild }) => ({
	build: {
		rollupOptions: isSsrBuild ? { input: "./workers/app.ts" } : undefined,
	},
	plugins: [cloudflare(), tailwindcss(), reactRouter(), tsconfigPaths()],
}));
