import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "~/infrastructure/persistence/schema";
import type { DrizzleClient } from "~/infrastructure/persistence/drizzle/drizzle.client";
import { COOKIE_PREFIX } from "./auth.const";

/**
 * Better-auth 환경 설정 타입
 */
export interface BetterAuthConfig {
	databaseUrl: string;
	baseURL: string;
	secret: string;
	githubClientId?: string;
	githubClientSecret?: string;
	googleClientId?: string;
	googleClientSecret?: string;
	kakaoClientId?: string;
	kakaoClientSecret?: string;
	resendApiKey?: string;
	resendFromEmail?: string;
}

/**
 * Better-auth 인스턴스 생성
 *
 * @param db - Drizzle 클라이언트
 * @param config - Better-auth 설정
 * @param sendVerificationEmail - 이메일 인증 발송 함수
 * @param sendPasswordResetEmail - 비밀번호 재설정 이메일 발송 함수
 */
export const createBetterAuth = (
	db: DrizzleClient,
	config: BetterAuthConfig,
	sendVerificationEmail: (email: string, url: string) => Promise<void>,
	sendPasswordResetEmail: (email: string, url: string) => Promise<void>,
) => {
	return betterAuth({
		secret: config.secret,
		baseURL: config.baseURL,
		basePath: "/auth/api",

		database: drizzleAdapter(db, {
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
			sendResetPassword: async ({ user, url }) => {
				await sendPasswordResetEmail(user.email, url);
			},
		},

		emailVerification: {
			sendOnSignUp: true,
			autoSignInAfterVerification: true,
			sendVerificationEmail: async ({ user, url }) => {
				await sendVerificationEmail(user.email, url);
			},
		},

		socialProviders: {
			github:
				config.githubClientId && config.githubClientSecret
					? {
							clientId: config.githubClientId,
							clientSecret: config.githubClientSecret,
						}
					: undefined,
			google:
				config.googleClientId && config.googleClientSecret
					? {
							clientId: config.googleClientId,
							clientSecret: config.googleClientSecret,
						}
					: undefined,
		},

		session: {
			expiresIn: 60 * 60 * 24 * 7, // 7일
			updateAge: 60 * 60 * 24, // 1일마다 갱신
			cookieCache: {
				enabled: true,
				maxAge: 60 * 5, // 5분
			},
		},

		advanced: {
			cookiePrefix: COOKIE_PREFIX,
			crossSubDomainCookies: {
				enabled: false,
			},
			generateId: false,
			useSecureCookies: config.baseURL.startsWith("https://"),
		},

		trustedOrigins: [config.baseURL],

		account: {
			accountLinking: {
				enabled: true,
				trustedProviders: ["github", "google", "kakao"],
			},
		},
	});
};

export type BetterAuthInstance = ReturnType<typeof createBetterAuth>;
