/**
 * Better-auth CLI 전용 설정
 *
 * 이 파일은 better-auth CLI에서 스키마를 생성할 때만 사용됩니다.
 * 실제 런타임에서는 auth.config.ts의 createBetterAuth를 사용합니다.
 *
 * @example
 * bunx @better-auth/cli generate --config app/infrastructure/external/better-auth/auth.cli.ts
 */
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "~/infrastructure/persistence/schema";

/**
 * CLI 전용 auth 인스턴스
 *
 * 스키마 생성에 필요한 최소 설정만 포함합니다.
 * 실제 DB 연결은 하지 않으며, 타입 생성 목적으로만 사용됩니다.
 */
export const auth = betterAuth({
	secret: "cli-only-secret",
	baseURL: "http://localhost:5173",
	basePath: "/auth/api",

	// CLI는 실제 DB 연결 없이 스키마 구조만 분석
	database: drizzleAdapter(null as never, {
		provider: "pg",
		schema: {
			user: schema.userTable,
			session: schema.sessionTable,
			account: schema.accountTable,
			verification: schema.verificationTable,
		},
	}),

	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
	},

	socialProviders: {
		github: {
			clientId: "cli-placeholder",
			clientSecret: "cli-placeholder",
		},
		google: {
			clientId: "cli-placeholder",
			clientSecret: "cli-placeholder",
		},
	},
});

export default auth;
