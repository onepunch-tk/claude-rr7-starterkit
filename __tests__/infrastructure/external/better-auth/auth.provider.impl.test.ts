import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IUser } from "~/domain/user";

/**
 * infrastructure/external/better-auth/auth.provider.impl.ts 유닛 테스트
 *
 * 테스트 대상: createAuthProviderImpl 함수
 * - getSession: 현재 세션에서 사용자 정보 조회
 * - signInWithCredentials: 이메일/비밀번호 로그인
 * - signUpWithCredentials: 이메일/비밀번호 회원가입
 * - signInWithOAuth: OAuth 로그인
 * - signOut: 로그아웃
 * - changePassword: 비밀번호 변경
 * - requestPasswordReset: 비밀번호 재설정 요청
 * - resetPassword: 비밀번호 재설정 실행
 *
 * Mock 전략: BetterAuthInstance를 Mock하여 API 호출을 시뮬레이션
 */

// isUser Mock - 항상 true 반환
vi.mock("~/domain/user", async (importOriginal) => {
	const original = await importOriginal<typeof import("~/domain/user")>();
	return {
		...original,
		isUser: vi.fn(() => true),
	};
});

describe("infrastructure/external/better-auth/auth.provider.impl", () => {
	// Mock 사용자 데이터
	const mockUser: IUser = {
		id: "user-123",
		name: "Test User",
		email: "test@example.com",
		emailVerified: true,
		image: null,
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
	};

	// Mock Headers
	const mockHeaders = new Headers({
		cookie: "session_token=abc123",
	});

	// Mock BetterAuth Instance
	let mockBetterAuth: {
		api: {
			getSession: ReturnType<typeof vi.fn>;
			signInEmail: ReturnType<typeof vi.fn>;
			signUpEmail: ReturnType<typeof vi.fn>;
			signInSocial: ReturnType<typeof vi.fn>;
			signOut: ReturnType<typeof vi.fn>;
			changePassword: ReturnType<typeof vi.fn>;
			requestPasswordReset: ReturnType<typeof vi.fn>;
			resetPassword: ReturnType<typeof vi.fn>;
		};
	};

	beforeEach(() => {
		vi.clearAllMocks();

		mockBetterAuth = {
			api: {
				getSession: vi.fn(),
				signInEmail: vi.fn(),
				signUpEmail: vi.fn(),
				signInSocial: vi.fn(),
				signOut: vi.fn(),
				changePassword: vi.fn(),
				requestPasswordReset: vi.fn(),
				resetPassword: vi.fn(),
			},
		};
	});

	describe("createAuthProviderImpl", () => {
		it("AuthProvider 객체를 생성한다", async () => {
			// Arrange
			const { createAuthProviderImpl } = await import(
				"~/infrastructure/external/better-auth/auth.provider.impl"
			);

			// Act
			const authProvider = createAuthProviderImpl(
				mockBetterAuth as unknown as Parameters<typeof createAuthProviderImpl>[0],
			);

			// Assert
			expect(authProvider).toBeDefined();
			expect(authProvider.getSession).toBeDefined();
			expect(authProvider.signInWithCredentials).toBeDefined();
			expect(authProvider.signUpWithCredentials).toBeDefined();
			expect(authProvider.signInWithOAuth).toBeDefined();
			expect(authProvider.signOut).toBeDefined();
			expect(authProvider.changePassword).toBeDefined();
			expect(authProvider.requestPasswordReset).toBeDefined();
			expect(authProvider.resetPassword).toBeDefined();
		});
	});

	describe("getSession", () => {
		it("세션이 있으면 사용자 정보를 반환한다", async () => {
			// Arrange
			mockBetterAuth.api.getSession.mockResolvedValue({ user: mockUser });
			const { createAuthProviderImpl } = await import(
				"~/infrastructure/external/better-auth/auth.provider.impl"
			);
			const authProvider = createAuthProviderImpl(
				mockBetterAuth as unknown as Parameters<typeof createAuthProviderImpl>[0],
			);

			// Act
			const result = await authProvider.getSession(mockHeaders);

			// Assert
			expect(mockBetterAuth.api.getSession).toHaveBeenCalledWith({
				headers: mockHeaders,
			});
			expect(result?.user).toEqual(mockUser);
		});

		it("세션이 없으면 null을 반환한다", async () => {
			// Arrange
			mockBetterAuth.api.getSession.mockResolvedValue(null);
			const { createAuthProviderImpl } = await import(
				"~/infrastructure/external/better-auth/auth.provider.impl"
			);
			const authProvider = createAuthProviderImpl(
				mockBetterAuth as unknown as Parameters<typeof createAuthProviderImpl>[0],
			);

			// Act
			const result = await authProvider.getSession(mockHeaders);

			// Assert
			expect(result).toBeNull();
		});

		it("세션에 user가 없으면 null을 반환한다", async () => {
			// Arrange
			mockBetterAuth.api.getSession.mockResolvedValue({ user: null });
			const { createAuthProviderImpl } = await import(
				"~/infrastructure/external/better-auth/auth.provider.impl"
			);
			const authProvider = createAuthProviderImpl(
				mockBetterAuth as unknown as Parameters<typeof createAuthProviderImpl>[0],
			);

			// Act
			const result = await authProvider.getSession(mockHeaders);

			// Assert
			expect(result).toBeNull();
		});
	});

	describe("signInWithCredentials", () => {
		it("로그인 성공 시 setCookie를 반환한다", async () => {
			// Arrange
			const responseHeaders = new Headers();
			responseHeaders.set("set-cookie", "session_token=xyz");
			mockBetterAuth.api.signInEmail.mockResolvedValue({
				headers: responseHeaders,
			});
			const { createAuthProviderImpl } = await import(
				"~/infrastructure/external/better-auth/auth.provider.impl"
			);
			const authProvider = createAuthProviderImpl(
				mockBetterAuth as unknown as Parameters<typeof createAuthProviderImpl>[0],
			);

			// Act
			const result = await authProvider.signInWithCredentials(
				"test@example.com",
				"password123",
				mockHeaders,
			);

			// Assert
			expect(mockBetterAuth.api.signInEmail).toHaveBeenCalledWith({
				body: { email: "test@example.com", password: "password123" },
				headers: mockHeaders,
				returnHeaders: true,
			});
			expect(result.setCookie).toBe("session_token=xyz");
		});

		it("로그인 시 setCookie가 없으면 null을 반환한다", async () => {
			// Arrange
			const responseHeaders = new Headers();
			mockBetterAuth.api.signInEmail.mockResolvedValue({
				headers: responseHeaders,
			});
			const { createAuthProviderImpl } = await import(
				"~/infrastructure/external/better-auth/auth.provider.impl"
			);
			const authProvider = createAuthProviderImpl(
				mockBetterAuth as unknown as Parameters<typeof createAuthProviderImpl>[0],
			);

			// Act
			const result = await authProvider.signInWithCredentials(
				"test@example.com",
				"password123",
				mockHeaders,
			);

			// Assert
			expect(result.setCookie).toBeNull();
		});
	});

	describe("signUpWithCredentials", () => {
		it("회원가입 성공 시 사용자 정보를 반환한다", async () => {
			// Arrange
			mockBetterAuth.api.signUpEmail.mockResolvedValue({});
			const { createAuthProviderImpl } = await import(
				"~/infrastructure/external/better-auth/auth.provider.impl"
			);
			const authProvider = createAuthProviderImpl(
				mockBetterAuth as unknown as Parameters<typeof createAuthProviderImpl>[0],
			);

			// Act
			const result = await authProvider.signUpWithCredentials(
				"new@example.com",
				"password123",
				"New User",
				mockHeaders,
			);

			// Assert
			expect(mockBetterAuth.api.signUpEmail).toHaveBeenCalledWith({
				body: { email: "new@example.com", password: "password123", name: "New User" },
				headers: mockHeaders,
			});
			expect(result.user.email).toBe("new@example.com");
			expect(result.user.name).toBe("New User");
			expect(result.user.emailVerified).toBe(false);
		});
	});

	describe("signInWithOAuth", () => {
		it("OAuth 로그인 시 redirectUrl과 setCookies를 반환한다", async () => {
			// Arrange
			const responseHeaders = new Headers();
			responseHeaders.append("set-cookie", "state=abc");
			responseHeaders.append("set-cookie", "pkce=xyz");

			// getSetCookie Mock
			const mockResponseHeaders = {
				getSetCookie: vi.fn().mockReturnValue(["state=abc", "pkce=xyz"]),
			};

			mockBetterAuth.api.signInSocial.mockResolvedValue({
				headers: mockResponseHeaders,
				response: { url: "https://github.com/login/oauth" },
			});
			const { createAuthProviderImpl } = await import(
				"~/infrastructure/external/better-auth/auth.provider.impl"
			);
			const authProvider = createAuthProviderImpl(
				mockBetterAuth as unknown as Parameters<typeof createAuthProviderImpl>[0],
			);

			// Act
			const result = await authProvider.signInWithOAuth(
				"github",
				"/callback",
				mockHeaders,
			);

			// Assert
			expect(mockBetterAuth.api.signInSocial).toHaveBeenCalledWith({
				body: { provider: "github", callbackURL: "/callback" },
				headers: mockHeaders,
				returnHeaders: true,
			});
			expect(result.redirectUrl).toBe("https://github.com/login/oauth");
			expect(result.setCookies).toEqual(["state=abc", "pkce=xyz"]);
		});

		it("OAuth URL이 없으면 빈 문자열을 반환한다", async () => {
			// Arrange
			const mockResponseHeaders = {
				getSetCookie: vi.fn().mockReturnValue([]),
			};
			mockBetterAuth.api.signInSocial.mockResolvedValue({
				headers: mockResponseHeaders,
				response: { url: undefined },
			});
			const { createAuthProviderImpl } = await import(
				"~/infrastructure/external/better-auth/auth.provider.impl"
			);
			const authProvider = createAuthProviderImpl(
				mockBetterAuth as unknown as Parameters<typeof createAuthProviderImpl>[0],
			);

			// Act
			const result = await authProvider.signInWithOAuth(
				"google",
				"/callback",
				mockHeaders,
			);

			// Assert
			expect(result.redirectUrl).toBe("");
		});
	});

	describe("signOut", () => {
		it("로그아웃을 수행한다", async () => {
			// Arrange
			mockBetterAuth.api.signOut.mockResolvedValue({});
			const { createAuthProviderImpl } = await import(
				"~/infrastructure/external/better-auth/auth.provider.impl"
			);
			const authProvider = createAuthProviderImpl(
				mockBetterAuth as unknown as Parameters<typeof createAuthProviderImpl>[0],
			);

			// Act
			await authProvider.signOut(mockHeaders);

			// Assert
			expect(mockBetterAuth.api.signOut).toHaveBeenCalledWith({
				headers: mockHeaders,
			});
		});
	});

	describe("changePassword", () => {
		it("비밀번호 변경을 수행한다", async () => {
			// Arrange
			mockBetterAuth.api.changePassword.mockResolvedValue({});
			const { createAuthProviderImpl } = await import(
				"~/infrastructure/external/better-auth/auth.provider.impl"
			);
			const authProvider = createAuthProviderImpl(
				mockBetterAuth as unknown as Parameters<typeof createAuthProviderImpl>[0],
			);

			// Act
			await authProvider.changePassword(
				"currentPassword",
				"newPassword",
				true,
				mockHeaders,
			);

			// Assert
			expect(mockBetterAuth.api.changePassword).toHaveBeenCalledWith({
				body: {
					currentPassword: "currentPassword",
					newPassword: "newPassword",
					revokeOtherSessions: true,
				},
				headers: mockHeaders,
			});
		});
	});

	describe("requestPasswordReset", () => {
		it("비밀번호 재설정 요청을 수행한다", async () => {
			// Arrange
			mockBetterAuth.api.requestPasswordReset.mockResolvedValue({});
			const { createAuthProviderImpl } = await import(
				"~/infrastructure/external/better-auth/auth.provider.impl"
			);
			const authProvider = createAuthProviderImpl(
				mockBetterAuth as unknown as Parameters<typeof createAuthProviderImpl>[0],
			);

			// Act
			await authProvider.requestPasswordReset("test@example.com", mockHeaders);

			// Assert
			expect(mockBetterAuth.api.requestPasswordReset).toHaveBeenCalledWith({
				body: { email: "test@example.com" },
				headers: mockHeaders,
			});
		});
	});

	describe("resetPassword", () => {
		it("비밀번호 재설정을 수행한다", async () => {
			// Arrange
			mockBetterAuth.api.resetPassword.mockResolvedValue({});
			const { createAuthProviderImpl } = await import(
				"~/infrastructure/external/better-auth/auth.provider.impl"
			);
			const authProvider = createAuthProviderImpl(
				mockBetterAuth as unknown as Parameters<typeof createAuthProviderImpl>[0],
			);

			// Act
			await authProvider.resetPassword("newPassword123", "reset-token", mockHeaders);

			// Assert
			expect(mockBetterAuth.api.resetPassword).toHaveBeenCalledWith({
				body: { newPassword: "newPassword123", token: "reset-token" },
				headers: mockHeaders,
			});
		});
	});
});
