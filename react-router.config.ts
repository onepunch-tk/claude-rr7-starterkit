import type { Config } from "@react-router/dev/config";

export default {
	ssr: true,
	future: {
		v8_viteEnvironmentApi: true, // Cloudflare Workers 지원
	},
	async prerender() {
		return ["/sitemap.xml", "/robots.txt"];
	},
} satisfies Config;
