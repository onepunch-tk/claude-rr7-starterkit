import type { AppEnv } from "adapters/shared/env";
import { createAuthService } from "~/application/auth/auth.service";
import type { IContainer } from "~/application/shared/container.types";
import { createUserService } from "~/application/user/user.service";
import { createBetterAuth } from "~/infrastructure/external/better-auth/auth.config";
import { createAuthProviderImpl } from "~/infrastructure/external/better-auth/auth.provider.impl";
import { createEmailServiceImpl } from "~/infrastructure/external/resend/email.service.impl";
import { createDrizzleClient } from "~/infrastructure/persistence/drizzle/drizzle.server";
import {
	createProfileRepositoryImpl,
	createUserRepositoryImpl,
} from "~/infrastructure/persistence/drizzle/user.repository.impl";

/**
 * DI Container 생성
 *
 * Composition Root에서 호출되어 모든 의존성을 생성하고 주입합니다.
 * 모든 플랫폼(Cloudflare, Express, Fastify)에서 사용됩니다.
 *
 * @param env - 애플리케이션 환경 변수
 * @returns IContainer 인터페이스를 구현하는 컨테이너
 */
export const createContainer = (env: AppEnv): IContainer => {
	// 필수 환경 변수 검증
	if (!env?.DATABASE_URL || !env?.BASE_URL || !env?.BETTER_AUTH_SECRET) {
		throw new Error(
			"필수 환경 변수가 설정되지 않았습니다. " +
				"DATABASE_URL, BASE_URL, BETTER_AUTH_SECRET를 확인하세요.",
		);
	}

	// 1. Infrastructure: DB 클라이언트
	const db = createDrizzleClient(env.DATABASE_URL);

	// 2. Infrastructure: Email Service
	const emailService = createEmailServiceImpl(
		env.RESEND_API_KEY,
		env.RESEND_FROM_EMAIL,
	);

	// 3. Infrastructure: Repositories (Better-auth보다 먼저 생성)
	const userRepository = createUserRepositoryImpl(db);
	const profileRepository = createProfileRepositoryImpl(db);

	// 4. Infrastructure: Better-auth 인스턴스 (profileRepository 주입)
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
		profileRepository,
	);

	// 5. Infrastructure: Auth Provider
	const authProvider = createAuthProviderImpl(betterAuth);

	// 6. Application: Services
	const userService = createUserService(userRepository, profileRepository);
	const authService = createAuthService(authProvider, userRepository);

	return {
		authService,
		userService,
		emailService,
		betterAuthHandler: (request: Request) => betterAuth.handler(request),
	};
};
