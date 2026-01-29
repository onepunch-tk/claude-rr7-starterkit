import { describe, it, expect, vi, beforeEach } from "vitest";
import type { AppEnv } from "adapters/shared/env";

/**
 * infrastructure/config/container.ts 유닛 테스트
 *
 * 테스트 대상: createContainer 함수의 환경 변수 검증 로직
 *
 * 참고: 실제 의존성 주입은 외부 라이브러리(Drizzle, Better-auth, Resend)에
 * 의존하므로 통합 테스트에서 다루어야 합니다.
 * 여기서는 환경 변수 검증 로직만 테스트합니다.
 */

// Mock 모듈들
vi.mock("~/infrastructure/persistence/drizzle/drizzle.server", () => ({
	createDrizzleClient: vi.fn(() => ({})),
}));

vi.mock("~/infrastructure/external/resend/email.service.impl", () => ({
	createEmailServiceImpl: vi.fn(() => ({
		send: vi.fn(),
		sendVerificationEmail: vi.fn(),
		sendPasswordResetEmail: vi.fn(),
	})),
}));

vi.mock("~/infrastructure/persistence/drizzle/user.repository.impl", () => ({
	createUserRepositoryImpl: vi.fn(() => ({})),
	createProfileRepositoryImpl: vi.fn(() => ({})),
}));

vi.mock("~/infrastructure/external/better-auth/auth.config", () => ({
	createBetterAuth: vi.fn(() => ({
		handler: vi.fn(),
	})),
}));

vi.mock("~/infrastructure/external/better-auth/auth.provider.impl", () => ({
	createAuthProviderImpl: vi.fn(() => ({})),
}));

vi.mock("~/application/user/user.service", () => ({
	createUserService: vi.fn(() => ({})),
}));

vi.mock("~/application/auth/auth.service", () => ({
	createAuthService: vi.fn(() => ({})),
}));

describe("infrastructure/config/container", () => {
	// 유효한 환경 변수 Mock
	const validEnv: AppEnv = {
		DATABASE_URL: "postgresql://localhost:5432/test",
		BASE_URL: "http://localhost:3000",
		BETTER_AUTH_SECRET: "test-secret-key-12345",
	};

	beforeEach(() => {
		vi.clearAllMocks();
		vi.resetModules();
	});

	describe("createContainer", () => {
		it("유효한 환경 변수로 컨테이너를 생성한다", async () => {
			// Arrange
			const { createContainer } = await import(
				"~/infrastructure/config/container"
			);

			// Act
			const container = createContainer(validEnv);

			// Assert
			expect(container).toBeDefined();
			expect(container.authService).toBeDefined();
			expect(container.userService).toBeDefined();
			expect(container.emailService).toBeDefined();
			expect(container.betterAuthHandler).toBeDefined();
		});

		it("DATABASE_URL이 없으면 에러를 던진다", async () => {
			// Arrange
			const { createContainer } = await import(
				"~/infrastructure/config/container"
			);
			const invalidEnv = {
				...validEnv,
				DATABASE_URL: undefined,
			} as unknown as AppEnv;

			// Act & Assert
			expect(() => createContainer(invalidEnv)).toThrow(
				"필수 환경 변수가 설정되지 않았습니다",
			);
		});

		it("BASE_URL이 없으면 에러를 던진다", async () => {
			// Arrange
			const { createContainer } = await import(
				"~/infrastructure/config/container"
			);
			const invalidEnv = {
				...validEnv,
				BASE_URL: undefined,
			} as unknown as AppEnv;

			// Act & Assert
			expect(() => createContainer(invalidEnv)).toThrow(
				"필수 환경 변수가 설정되지 않았습니다",
			);
		});

		it("BETTER_AUTH_SECRET이 없으면 에러를 던진다", async () => {
			// Arrange
			const { createContainer } = await import(
				"~/infrastructure/config/container"
			);
			const invalidEnv = {
				...validEnv,
				BETTER_AUTH_SECRET: undefined,
			} as unknown as AppEnv;

			// Act & Assert
			expect(() => createContainer(invalidEnv)).toThrow(
				"필수 환경 변수가 설정되지 않았습니다",
			);
		});

		it("env가 null이면 에러를 던진다", async () => {
			// Arrange
			const { createContainer } = await import(
				"~/infrastructure/config/container"
			);

			// Act & Assert
			expect(() => createContainer(null as unknown as AppEnv)).toThrow(
				"필수 환경 변수가 설정되지 않았습니다",
			);
		});

		it("env가 undefined이면 에러를 던진다", async () => {
			// Arrange
			const { createContainer } = await import(
				"~/infrastructure/config/container"
			);

			// Act & Assert
			expect(() => createContainer(undefined as unknown as AppEnv)).toThrow(
				"필수 환경 변수가 설정되지 않았습니다",
			);
		});

		it("선택적 환경 변수가 없어도 컨테이너를 생성한다", async () => {
			// Arrange
			const { createContainer } = await import(
				"~/infrastructure/config/container"
			);
			const envWithoutOptional: AppEnv = {
				DATABASE_URL: "postgresql://localhost:5432/test",
				BASE_URL: "http://localhost:3000",
				BETTER_AUTH_SECRET: "test-secret",
				// 선택적 환경 변수 없음
			};

			// Act
			const container = createContainer(envWithoutOptional);

			// Assert
			expect(container).toBeDefined();
		});

		it("모든 환경 변수가 있으면 컨테이너를 생성한다", async () => {
			// Arrange
			const { createContainer } = await import(
				"~/infrastructure/config/container"
			);
			const fullEnv: AppEnv = {
				DATABASE_URL: "postgresql://localhost:5432/test",
				BASE_URL: "http://localhost:3000",
				BETTER_AUTH_SECRET: "test-secret",
				GITHUB_CLIENT_ID: "github-id",
				GITHUB_CLIENT_SECRET: "github-secret",
				GOOGLE_CLIENT_ID: "google-id",
				GOOGLE_CLIENT_SECRET: "google-secret",
				KAKAO_CLIENT_ID: "kakao-id",
				KAKAO_CLIENT_SECRET: "kakao-secret",
				RESEND_API_KEY: "resend-key",
				RESEND_FROM_EMAIL: "noreply@example.com",
			};

			// Act
			const container = createContainer(fullEnv);

			// Assert
			expect(container).toBeDefined();
		});

		it("betterAuthHandler가 함수이다", async () => {
			// Arrange
			const { createContainer } = await import(
				"~/infrastructure/config/container"
			);

			// Act
			const container = createContainer(validEnv);

			// Assert
			expect(typeof container.betterAuthHandler).toBe("function");
		});
	});
});
