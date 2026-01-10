import type { Config } from "@react-router/dev/config";
import { cloudflarePreset as preset } from "@react-router/dev/presets/cloudflare";

const deployEnv = process.env.DEPLOY_ENV || "production";

export default {
	ssr: true,
	future: {
		v8_viteEnvironmentApi: true, // Cloudflare Workers 지원
	},
	presets: [
		preset({
			workerName:
				deployEnv === "staging"
					? "claude-rr7-starterkit-staging"
					: "claude-rr7-starterkit-production",
		}),
	],
} satisfies Config;
