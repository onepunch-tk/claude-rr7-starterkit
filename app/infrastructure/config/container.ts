import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { createAuthService } from "~/application/auth/auth.service";
import { createUserService } from "~/application/user/user.service";
import { createDrizzleClient } from "~/infrastructure/persistence/drizzle/drizzle.client";
import {
	createProfileRepositoryImpl,
	createUserRepositoryImpl,
} from "~/infrastructure/persistence/drizzle/user.repository.impl";
import { createBetterAuth } from "~/infrastructure/external/better-auth/auth.config";
import { createAuthProviderImpl } from "~/infrastructure/external/better-auth/auth.provider.impl";
import { createEmailServiceImpl } from "~/infrastructure/external/resend/email.provider.impl";
import { extractEnv, type CloudflareAuthEnv } from "./env";

/**
 * DI Container 타입
 */
export interface Container {
	// Repositories
	userRepository: ReturnType<typeof createUserRepositoryImpl>;
	profileRepository: ReturnType<typeof createProfileRepositoryImpl>;

	// Services
	userService: ReturnType<typeof createUserService>;
	authService: ReturnType<typeof createAuthService>;

	// External
	emailService: ReturnType<typeof createEmailServiceImpl>;

	// Better-auth 인스턴스 (API 핸들러용)
	betterAuth: ReturnType<typeof createBetterAuth>;
}

/**
 * DI Container 생성
 *
 * 모든 레이어의 인스턴스를 생성하고 의존성을 주입합니다.
 * Cloudflare Workers 환경에서는 매 요청마다 새로운 컨테이너가 생성됩니다.
 *
 * @param context - Loader 또는 Action 컨텍스트
 * @returns Container 인스턴스
 */
export const createContainer = (
	context: LoaderFunctionArgs["context"] | ActionFunctionArgs["context"],
): Container => {
	const env = extractEnv(context);

	// 1. Infrastructure: DB 클라이언트
	const db = createDrizzleClient(env.DATABASE_URL);

	// 2. Infrastructure: Email Service
	const emailService = createEmailServiceImpl(
		env.RESEND_API_KEY,
		env.RESEND_FROM_EMAIL,
	);

	// 3. Infrastructure: Better-auth 인스턴스
	const betterAuth = createBetterAuth(
		db,
		{
			databaseUrl: env.DATABASE_URL,
			baseURL: env.BASE_URL,
			secret: env.BETTER_AUTH_SECRET,
			githubClientId: env.GITHUB_CLIENT_ID,
			githubClientSecret: env.GITHUB_CLIENT_SECRET,
			googleClientId: env.GOOGLE_CLIENT_ID,
			googleClientSecret: env.GOOGLE_CLIENT_SECRET,
			kakaoClientId: env.KAKAO_CLIENT_ID,
			kakaoClientSecret: env.KAKAO_CLIENT_SECRET,
			resendApiKey: env.RESEND_API_KEY,
			resendFromEmail: env.RESEND_FROM_EMAIL,
		},
		emailService.sendVerificationEmail,
		emailService.sendPasswordResetEmail,
	);

	// 4. Infrastructure: Repositories
	const userRepository = createUserRepositoryImpl(db);
	const profileRepository = createProfileRepositoryImpl(db);

	// 5. Infrastructure: Auth Provider
	const authProvider = createAuthProviderImpl(betterAuth);

	// 6. Application: Services
	const userService = createUserService(userRepository, profileRepository);
	const authService = createAuthService(
		authProvider,
		userRepository,
		profileRepository,
	);

	return {
		userRepository,
		profileRepository,
		userService,
		authService,
		emailService,
		betterAuth,
	};
};

/**
 * CLI/스크립트용 정적 컨테이너 생성
 *
 * 환경 변수를 직접 받아 컨테이너를 생성합니다.
 * Cloudflare Workers 외부에서 사용됩니다.
 */
export const createContainerFromEnv = (env: CloudflareAuthEnv): Container => {
	const db = createDrizzleClient(env.DATABASE_URL);

	const emailService = createEmailServiceImpl(
		env.RESEND_API_KEY,
		env.RESEND_FROM_EMAIL,
	);

	const betterAuth = createBetterAuth(
		db,
		{
			databaseUrl: env.DATABASE_URL,
			baseURL: env.BASE_URL,
			secret: env.BETTER_AUTH_SECRET,
			githubClientId: env.GITHUB_CLIENT_ID,
			githubClientSecret: env.GITHUB_CLIENT_SECRET,
			googleClientId: env.GOOGLE_CLIENT_ID,
			googleClientSecret: env.GOOGLE_CLIENT_SECRET,
			kakaoClientId: env.KAKAO_CLIENT_ID,
			kakaoClientSecret: env.KAKAO_CLIENT_SECRET,
			resendApiKey: env.RESEND_API_KEY,
			resendFromEmail: env.RESEND_FROM_EMAIL,
		},
		emailService.sendVerificationEmail,
		emailService.sendPasswordResetEmail,
	);

	const userRepository = createUserRepositoryImpl(db);
	const profileRepository = createProfileRepositoryImpl(db);
	const authProvider = createAuthProviderImpl(betterAuth);

	const userService = createUserService(userRepository, profileRepository);
	const authService = createAuthService(
		authProvider,
		userRepository,
		profileRepository,
	);

	return {
		userRepository,
		profileRepository,
		userService,
		authService,
		emailService,
		betterAuth,
	};
};
