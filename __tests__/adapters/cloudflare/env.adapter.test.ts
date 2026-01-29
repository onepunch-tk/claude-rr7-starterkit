import { ZodError } from "zod";
import { describe, it, expect } from "vitest";
import { extractCloudflareEnv } from "adapters/cloudflare/env.adapter";

/**
 * adapters/cloudflare/env.adapter.ts 유닛 테스트
 *
 * 테스트 대상:
 * - extractCloudflareEnv: Cloudflare 환경 변수에서 AppEnv 추출
 */

describe("adapters/cloudflare/env.adapter", () => {
	// 필수 환경 변수 Mock 데이터
	const requiredEnvVars = {
		DATABASE_URL: "postgresql://localhost:5432/test",
		BASE_URL: "http://localhost:3000",
		BETTER_AUTH_SECRET: "test-secret-key-12345",
	};

	// 선택적 환경 변수 Mock 데이터
	const optionalEnvVars = {
		GITHUB_CLIENT_ID: "github-client-id",
		GITHUB_CLIENT_SECRET: "github-client-secret",
		GOOGLE_CLIENT_ID: "google-client-id",
		GOOGLE_CLIENT_SECRET: "google-client-secret",
		KAKAO_CLIENT_ID: "kakao-client-id",
		KAKAO_CLIENT_SECRET: "kakao-client-secret",
		RESEND_API_KEY: "resend-api-key",
		RESEND_FROM_EMAIL: "noreply@example.com",
	};

	/**
	 * Cloudflare Env 타입 Mock 생성 헬퍼
	 * worker-configuration.d.ts의 Env 타입을 모방
	 */
	const createMockCloudflareEnv = (
		overrides: Record<string, string | undefined> = {},
	): Env => {
		return {
			...requiredEnvVars,
			...overrides,
		} as unknown as Env;
	};

	describe("extractCloudflareEnv", () => {
		it("Cloudflare Env 객체에서 AppEnv를 추출한다", () => {
			// Arrange
			const cloudflareEnv = createMockCloudflareEnv();

			// Act
			const result = extractCloudflareEnv(cloudflareEnv);

			// Assert
			expect(result.DATABASE_URL).toBe(requiredEnvVars.DATABASE_URL);
			expect(result.BASE_URL).toBe(requiredEnvVars.BASE_URL);
			expect(result.BETTER_AUTH_SECRET).toBe(requiredEnvVars.BETTER_AUTH_SECRET);
		});

		it("필수 환경 변수 누락 시 ZodError를 던진다", () => {
			// Arrange - DATABASE_URL 누락
			const cloudflareEnv = {
				BASE_URL: requiredEnvVars.BASE_URL,
				BETTER_AUTH_SECRET: requiredEnvVars.BETTER_AUTH_SECRET,
			} as unknown as Env;

			// Act & Assert
			expect(() => extractCloudflareEnv(cloudflareEnv)).toThrow(ZodError);
		});

		it("BASE_URL 누락 시 ZodError를 던진다", () => {
			// Arrange
			const cloudflareEnv = {
				DATABASE_URL: requiredEnvVars.DATABASE_URL,
				BETTER_AUTH_SECRET: requiredEnvVars.BETTER_AUTH_SECRET,
			} as unknown as Env;

			// Act & Assert
			expect(() => extractCloudflareEnv(cloudflareEnv)).toThrow(ZodError);
		});

		it("BETTER_AUTH_SECRET 누락 시 ZodError를 던진다", () => {
			// Arrange
			const cloudflareEnv = {
				DATABASE_URL: requiredEnvVars.DATABASE_URL,
				BASE_URL: requiredEnvVars.BASE_URL,
			} as unknown as Env;

			// Act & Assert
			expect(() => extractCloudflareEnv(cloudflareEnv)).toThrow(ZodError);
		});

		it("선택적 환경 변수가 있으면 포함한다", () => {
			// Arrange
			const cloudflareEnv = createMockCloudflareEnv({
				...optionalEnvVars,
			});

			// Act
			const result = extractCloudflareEnv(cloudflareEnv);

			// Assert
			expect(result.GITHUB_CLIENT_ID).toBe(optionalEnvVars.GITHUB_CLIENT_ID);
			expect(result.GITHUB_CLIENT_SECRET).toBe(optionalEnvVars.GITHUB_CLIENT_SECRET);
			expect(result.GOOGLE_CLIENT_ID).toBe(optionalEnvVars.GOOGLE_CLIENT_ID);
			expect(result.GOOGLE_CLIENT_SECRET).toBe(optionalEnvVars.GOOGLE_CLIENT_SECRET);
			expect(result.KAKAO_CLIENT_ID).toBe(optionalEnvVars.KAKAO_CLIENT_ID);
			expect(result.KAKAO_CLIENT_SECRET).toBe(optionalEnvVars.KAKAO_CLIENT_SECRET);
			expect(result.RESEND_API_KEY).toBe(optionalEnvVars.RESEND_API_KEY);
			expect(result.RESEND_FROM_EMAIL).toBe(optionalEnvVars.RESEND_FROM_EMAIL);
		});

		it("선택적 환경 변수가 없어도 성공한다", () => {
			// Arrange
			const cloudflareEnv = createMockCloudflareEnv();

			// Act
			const result = extractCloudflareEnv(cloudflareEnv);

			// Assert
			expect(result.GITHUB_CLIENT_ID).toBeUndefined();
			expect(result.GOOGLE_CLIENT_ID).toBeUndefined();
			expect(result.RESEND_API_KEY).toBeUndefined();
		});

		it("일부 선택적 환경 변수만 있어도 성공한다", () => {
			// Arrange
			const cloudflareEnv = createMockCloudflareEnv({
				GITHUB_CLIENT_ID: "github-id",
				RESEND_API_KEY: "resend-key",
			});

			// Act
			const result = extractCloudflareEnv(cloudflareEnv);

			// Assert
			expect(result.GITHUB_CLIENT_ID).toBe("github-id");
			expect(result.RESEND_API_KEY).toBe("resend-key");
			expect(result.GOOGLE_CLIENT_ID).toBeUndefined();
			expect(result.KAKAO_CLIENT_ID).toBeUndefined();
		});
	});
});
