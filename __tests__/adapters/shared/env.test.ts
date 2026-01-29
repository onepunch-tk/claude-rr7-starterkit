import { ZodError } from "zod";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
	extractEnvFromSource,
	parseEnv,
	extractNodeEnv,
	ENV_KEYS,
} from "adapters/shared/env";

/**
 * adapters/shared/env.ts 유닛 테스트
 *
 * 테스트 대상:
 * - extractEnvFromSource: 환경 변수 소스에서 AppEnv 추출
 * - parseEnv: 환경 변수 검증 및 파싱
 * - extractNodeEnv: Node.js process.env에서 AppEnv 추출
 */

describe("adapters/shared/env", () => {
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

	describe("extractEnvFromSource", () => {
		it("유효한 환경 변수만 추출한다", () => {
			// Arrange
			const source = {
				...requiredEnvVars,
				UNKNOWN_VAR: "should-be-ignored",
			};

			// Act
			const result = extractEnvFromSource(source);

			// Assert
			expect(result).toEqual(requiredEnvVars);
			expect(result).not.toHaveProperty("UNKNOWN_VAR");
		});

		it("스키마에 정의된 키만 추출한다", () => {
			// Arrange
			const source = {
				...requiredEnvVars,
				...optionalEnvVars,
				EXTRA_KEY: "extra-value",
				ANOTHER_EXTRA: "another-value",
			};

			// Act
			const result = extractEnvFromSource(source);

			// Assert
			const resultKeys = Object.keys(result);
			for (const key of resultKeys) {
				expect(ENV_KEYS).toContain(key);
			}
			expect(result).not.toHaveProperty("EXTRA_KEY");
			expect(result).not.toHaveProperty("ANOTHER_EXTRA");
		});

		it("문자열이 아닌 값은 무시한다", () => {
			// Arrange
			const source = {
				DATABASE_URL: "postgresql://localhost:5432/test",
				BASE_URL: 12345, // number
				BETTER_AUTH_SECRET: null, // null
				GITHUB_CLIENT_ID: undefined, // undefined
				GOOGLE_CLIENT_ID: { nested: "object" }, // object
				KAKAO_CLIENT_ID: ["array"], // array
			};

			// Act
			const result = extractEnvFromSource(source);

			// Assert
			expect(result).toEqual({
				DATABASE_URL: "postgresql://localhost:5432/test",
			});
		});

		it("빈 소스에서 빈 객체를 반환한다", () => {
			// Arrange
			const source = {};

			// Act
			const result = extractEnvFromSource(source);

			// Assert
			expect(result).toEqual({});
		});

		it("모든 환경 변수가 있으면 모두 추출한다", () => {
			// Arrange
			const source = {
				...requiredEnvVars,
				...optionalEnvVars,
			};

			// Act
			const result = extractEnvFromSource(source);

			// Assert
			expect(result).toEqual({
				...requiredEnvVars,
				...optionalEnvVars,
			});
		});
	});

	describe("parseEnv", () => {
		it("필수 환경 변수가 모두 있으면 성공한다", () => {
			// Arrange
			const source = { ...requiredEnvVars };

			// Act
			const result = parseEnv(source);

			// Assert
			expect(result.DATABASE_URL).toBe(requiredEnvVars.DATABASE_URL);
			expect(result.BASE_URL).toBe(requiredEnvVars.BASE_URL);
			expect(result.BETTER_AUTH_SECRET).toBe(requiredEnvVars.BETTER_AUTH_SECRET);
		});

		it("선택적 환경 변수는 없어도 성공한다", () => {
			// Arrange
			const source = { ...requiredEnvVars };

			// Act
			const result = parseEnv(source);

			// Assert
			expect(result.GITHUB_CLIENT_ID).toBeUndefined();
			expect(result.GOOGLE_CLIENT_ID).toBeUndefined();
			expect(result.RESEND_API_KEY).toBeUndefined();
		});

		it("선택적 환경 변수가 있으면 포함한다", () => {
			// Arrange
			const source = {
				...requiredEnvVars,
				GITHUB_CLIENT_ID: "github-id",
				RESEND_API_KEY: "resend-key",
			};

			// Act
			const result = parseEnv(source);

			// Assert
			expect(result.GITHUB_CLIENT_ID).toBe("github-id");
			expect(result.RESEND_API_KEY).toBe("resend-key");
		});

		it("필수 환경 변수가 없으면 ZodError를 던진다", () => {
			// Arrange
			const source = {
				DATABASE_URL: "postgresql://localhost:5432/test",
				// BASE_URL 누락
				// BETTER_AUTH_SECRET 누락
			};

			// Act & Assert
			expect(() => parseEnv(source)).toThrow(ZodError);
		});

		it("DATABASE_URL이 없으면 ZodError를 던진다", () => {
			// Arrange
			const source = {
				BASE_URL: "http://localhost:3000",
				BETTER_AUTH_SECRET: "secret",
			};

			// Act & Assert
			expect(() => parseEnv(source)).toThrow(ZodError);
		});

		it("BASE_URL이 없으면 ZodError를 던진다", () => {
			// Arrange
			const source = {
				DATABASE_URL: "postgresql://localhost:5432/test",
				BETTER_AUTH_SECRET: "secret",
			};

			// Act & Assert
			expect(() => parseEnv(source)).toThrow(ZodError);
		});

		it("BETTER_AUTH_SECRET이 없으면 ZodError를 던진다", () => {
			// Arrange
			const source = {
				DATABASE_URL: "postgresql://localhost:5432/test",
				BASE_URL: "http://localhost:3000",
			};

			// Act & Assert
			expect(() => parseEnv(source)).toThrow(ZodError);
		});
	});

	describe("extractNodeEnv", () => {
		beforeEach(() => {
			// 필수 환경 변수 설정
			vi.stubEnv("DATABASE_URL", requiredEnvVars.DATABASE_URL);
			vi.stubEnv("BASE_URL", requiredEnvVars.BASE_URL);
			vi.stubEnv("BETTER_AUTH_SECRET", requiredEnvVars.BETTER_AUTH_SECRET);
		});

		afterEach(() => {
			vi.unstubAllEnvs();
		});

		it("process.env에서 환경 변수를 추출한다", () => {
			// Act
			const result = extractNodeEnv();

			// Assert
			expect(result.DATABASE_URL).toBe(requiredEnvVars.DATABASE_URL);
			expect(result.BASE_URL).toBe(requiredEnvVars.BASE_URL);
			expect(result.BETTER_AUTH_SECRET).toBe(requiredEnvVars.BETTER_AUTH_SECRET);
		});

		it("선택적 환경 변수도 추출한다", () => {
			// Arrange
			vi.stubEnv("GITHUB_CLIENT_ID", "github-id");
			vi.stubEnv("RESEND_API_KEY", "resend-key");

			// Act
			const result = extractNodeEnv();

			// Assert
			expect(result.GITHUB_CLIENT_ID).toBe("github-id");
			expect(result.RESEND_API_KEY).toBe("resend-key");
		});

		it("필수 환경 변수 누락 시 ZodError를 던진다", () => {
			// Arrange
			vi.unstubAllEnvs(); // 모든 환경 변수 제거

			// Act & Assert
			expect(() => extractNodeEnv()).toThrow(ZodError);
		});

		it("DATABASE_URL 누락 시 ZodError를 던진다", () => {
			// Arrange
			vi.unstubAllEnvs();
			vi.stubEnv("BASE_URL", requiredEnvVars.BASE_URL);
			vi.stubEnv("BETTER_AUTH_SECRET", requiredEnvVars.BETTER_AUTH_SECRET);

			// Act & Assert
			expect(() => extractNodeEnv()).toThrow(ZodError);
		});
	});
});
