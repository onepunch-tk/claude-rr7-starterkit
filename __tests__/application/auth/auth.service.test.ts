import { describe, it, expect, vi, beforeEach } from "vitest";
import { createAuthService } from "~/application/auth/auth.service";
import { SESSION_COOKIE_NAMES } from "~/application/auth/auth.const";
import type { IAuthProvider, SignInResult, SignUpResult, OAuthSignInResult } from "~/application/auth/auth.port";
import type { IUserRepository } from "~/application/user/user.port";
import type { IUser } from "~/domain/user";
import { DuplicateEmailError } from "~/domain/auth";

/**
 * application/auth/auth.service.ts 유닛 테스트
 *
 * 테스트 대상: createAuthService 팩토리 함수
 * - getCurrentUser: 현재 세션에서 사용자 정보 조회
 * - signIn: 이메일/비밀번호 로그인
 * - signUp: 이메일/비밀번호 회원가입
 * - signInWithOAuth: OAuth 로그인
 * - signOut: 로그아웃
 * - changePassword: 비밀번호 변경
 * - requestPasswordReset: 비밀번호 재설정 요청
 * - resetPassword: 비밀번호 재설정 실행
 * - clearSessionHeaders: 세션 쿠키 클리어 헤더 생성
 */

describe("application/auth/auth.service", () => {
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

	// Mock AuthProvider
	let mockAuthProvider: IAuthProvider;

	// Mock UserRepository
	let mockUserRepository: IUserRepository;

	beforeEach(() => {
		vi.clearAllMocks();

		// AuthProvider Mock 설정
		mockAuthProvider = {
			getSession: vi.fn(),
			signInWithCredentials: vi.fn(),
			signUpWithCredentials: vi.fn(),
			signInWithOAuth: vi.fn(),
			signOut: vi.fn(),
			changePassword: vi.fn(),
			requestPasswordReset: vi.fn(),
			resetPassword: vi.fn(),
		};

		// UserRepository Mock 설정
		mockUserRepository = {
			findById: vi.fn(),
			findByEmail: vi.fn(),
			findWithProfile: vi.fn(),
			update: vi.fn(),
		};
	});

	describe("createAuthService", () => {
		it("AuthService 객체를 생성한다", () => {
			// Act
			const authService = createAuthService(mockAuthProvider, mockUserRepository);

			// Assert
			expect(authService).toBeDefined();
			expect(authService.getCurrentUser).toBeDefined();
			expect(authService.signIn).toBeDefined();
			expect(authService.signUp).toBeDefined();
			expect(authService.signInWithOAuth).toBeDefined();
			expect(authService.signOut).toBeDefined();
			expect(authService.changePassword).toBeDefined();
			expect(authService.requestPasswordReset).toBeDefined();
			expect(authService.resetPassword).toBeDefined();
			expect(authService.clearSessionHeaders).toBeDefined();
		});
	});

	describe("getCurrentUser", () => {
		it("세션이 있으면 사용자 정보를 반환한다", async () => {
			// Arrange
			vi.mocked(mockAuthProvider.getSession).mockResolvedValue({ user: mockUser });
			const authService = createAuthService(mockAuthProvider, mockUserRepository);

			// Act
			const result = await authService.getCurrentUser(mockHeaders);

			// Assert
			expect(mockAuthProvider.getSession).toHaveBeenCalledWith(mockHeaders);
			expect(result).toEqual(mockUser);
		});

		it("세션이 없으면 null을 반환한다", async () => {
			// Arrange
			vi.mocked(mockAuthProvider.getSession).mockResolvedValue(null);
			const authService = createAuthService(mockAuthProvider, mockUserRepository);

			// Act
			const result = await authService.getCurrentUser(mockHeaders);

			// Assert
			expect(result).toBeNull();
		});
	});

	describe("signIn", () => {
		it("authProvider.signInWithCredentials를 호출한다", async () => {
			// Arrange
			const signInResult: SignInResult = { setCookie: "session_token=xyz" };
			vi.mocked(mockAuthProvider.signInWithCredentials).mockResolvedValue(signInResult);
			const authService = createAuthService(mockAuthProvider, mockUserRepository);

			// Act
			const result = await authService.signIn("test@example.com", "password123", mockHeaders);

			// Assert
			expect(mockAuthProvider.signInWithCredentials).toHaveBeenCalledWith(
				"test@example.com",
				"password123",
				mockHeaders,
			);
			expect(result).toEqual(signInResult);
		});
	});

	describe("signUp", () => {
		it("이메일 중복이 없으면 회원가입을 진행한다", async () => {
			// Arrange
			vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);
			const signUpResult: SignUpResult = {
				user: {
					id: "new-user-123",
					name: "New User",
					email: "new@example.com",
					emailVerified: false,
					image: null,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			};
			vi.mocked(mockAuthProvider.signUpWithCredentials).mockResolvedValue(signUpResult);
			const authService = createAuthService(mockAuthProvider, mockUserRepository);

			// Act
			const result = await authService.signUp(
				"new@example.com",
				"password123",
				"New User",
				mockHeaders,
			);

			// Assert
			expect(mockUserRepository.findByEmail).toHaveBeenCalledWith("new@example.com");
			expect(mockAuthProvider.signUpWithCredentials).toHaveBeenCalledWith(
				"new@example.com",
				"password123",
				"New User",
				mockHeaders,
			);
			expect(result).toEqual(signUpResult.user);
		});

		it("이메일 중복이면 DuplicateEmailError를 던진다", async () => {
			// Arrange
			vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(mockUser);
			const authService = createAuthService(mockAuthProvider, mockUserRepository);

			// Act & Assert
			await expect(
				authService.signUp("test@example.com", "password123", "Test User", mockHeaders),
			).rejects.toThrow(DuplicateEmailError);
			expect(mockAuthProvider.signUpWithCredentials).not.toHaveBeenCalled();
		});
	});

	describe("signInWithOAuth", () => {
		it("authProvider.signInWithOAuth를 호출한다", async () => {
			// Arrange
			const oauthResult: OAuthSignInResult = {
				redirectUrl: "https://github.com/login/oauth",
				setCookies: ["state=abc"],
			};
			vi.mocked(mockAuthProvider.signInWithOAuth).mockResolvedValue(oauthResult);
			const authService = createAuthService(mockAuthProvider, mockUserRepository);

			// Act
			const result = await authService.signInWithOAuth(
				"github",
				"/auth/callback",
				mockHeaders,
			);

			// Assert
			expect(mockAuthProvider.signInWithOAuth).toHaveBeenCalledWith(
				"github",
				"/auth/callback",
				mockHeaders,
			);
			expect(result).toEqual(oauthResult);
		});

		it("google OAuth를 지원한다", async () => {
			// Arrange
			const oauthResult: OAuthSignInResult = {
				redirectUrl: "https://accounts.google.com/oauth",
				setCookies: [],
			};
			vi.mocked(mockAuthProvider.signInWithOAuth).mockResolvedValue(oauthResult);
			const authService = createAuthService(mockAuthProvider, mockUserRepository);

			// Act
			await authService.signInWithOAuth("google", "/callback", mockHeaders);

			// Assert
			expect(mockAuthProvider.signInWithOAuth).toHaveBeenCalledWith(
				"google",
				"/callback",
				mockHeaders,
			);
		});

		it("kakao OAuth를 지원한다", async () => {
			// Arrange
			const oauthResult: OAuthSignInResult = {
				redirectUrl: "https://kauth.kakao.com/oauth",
				setCookies: [],
			};
			vi.mocked(mockAuthProvider.signInWithOAuth).mockResolvedValue(oauthResult);
			const authService = createAuthService(mockAuthProvider, mockUserRepository);

			// Act
			await authService.signInWithOAuth("kakao", "/callback", mockHeaders);

			// Assert
			expect(mockAuthProvider.signInWithOAuth).toHaveBeenCalledWith(
				"kakao",
				"/callback",
				mockHeaders,
			);
		});
	});

	describe("signOut", () => {
		it("authProvider.signOut을 호출한다", async () => {
			// Arrange
			vi.mocked(mockAuthProvider.signOut).mockResolvedValue(undefined);
			const authService = createAuthService(mockAuthProvider, mockUserRepository);

			// Act
			await authService.signOut(mockHeaders);

			// Assert
			expect(mockAuthProvider.signOut).toHaveBeenCalledWith(mockHeaders);
		});
	});

	describe("changePassword", () => {
		it("authProvider.changePassword를 호출한다", async () => {
			// Arrange
			vi.mocked(mockAuthProvider.changePassword).mockResolvedValue(undefined);
			const authService = createAuthService(mockAuthProvider, mockUserRepository);

			// Act
			await authService.changePassword(
				"currentPassword",
				"newPassword",
				true,
				mockHeaders,
			);

			// Assert
			expect(mockAuthProvider.changePassword).toHaveBeenCalledWith(
				"currentPassword",
				"newPassword",
				true,
				mockHeaders,
			);
		});

		it("revokeOtherSessions false로 호출할 수 있다", async () => {
			// Arrange
			vi.mocked(mockAuthProvider.changePassword).mockResolvedValue(undefined);
			const authService = createAuthService(mockAuthProvider, mockUserRepository);

			// Act
			await authService.changePassword(
				"currentPassword",
				"newPassword",
				false,
				mockHeaders,
			);

			// Assert
			expect(mockAuthProvider.changePassword).toHaveBeenCalledWith(
				"currentPassword",
				"newPassword",
				false,
				mockHeaders,
			);
		});
	});

	describe("requestPasswordReset", () => {
		it("authProvider.requestPasswordReset을 호출한다", async () => {
			// Arrange
			vi.mocked(mockAuthProvider.requestPasswordReset).mockResolvedValue(undefined);
			const authService = createAuthService(mockAuthProvider, mockUserRepository);

			// Act
			await authService.requestPasswordReset("test@example.com", mockHeaders);

			// Assert
			expect(mockAuthProvider.requestPasswordReset).toHaveBeenCalledWith(
				"test@example.com",
				mockHeaders,
			);
		});
	});

	describe("resetPassword", () => {
		it("authProvider.resetPassword를 호출한다", async () => {
			// Arrange
			vi.mocked(mockAuthProvider.resetPassword).mockResolvedValue(undefined);
			const authService = createAuthService(mockAuthProvider, mockUserRepository);

			// Act
			await authService.resetPassword("newPassword123", "reset-token-abc", mockHeaders);

			// Assert
			expect(mockAuthProvider.resetPassword).toHaveBeenCalledWith(
				"newPassword123",
				"reset-token-abc",
				mockHeaders,
			);
		});
	});

	describe("clearSessionHeaders", () => {
		it("세션 쿠키를 클리어하는 Headers를 반환한다", () => {
			// Arrange
			const authService = createAuthService(mockAuthProvider, mockUserRepository);

			// Act
			const headers = authService.clearSessionHeaders();

			// Assert
			expect(headers).toBeInstanceOf(Headers);
		});

		it("모든 세션 쿠키에 대해 Set-Cookie 헤더를 설정한다", () => {
			// Arrange
			const authService = createAuthService(mockAuthProvider, mockUserRepository);

			// Act
			const headers = authService.clearSessionHeaders();
			const setCookies = headers.getSetCookie();

			// Assert
			expect(setCookies).toHaveLength(SESSION_COOKIE_NAMES.length);
		});

		it("쿠키 만료 시간을 과거로 설정한다", () => {
			// Arrange
			const authService = createAuthService(mockAuthProvider, mockUserRepository);

			// Act
			const headers = authService.clearSessionHeaders();
			const setCookies = headers.getSetCookie();

			// Assert
			for (const cookie of setCookies) {
				expect(cookie).toContain("Expires=Thu, 01 Jan 1970 00:00:00 GMT");
			}
		});

		it("HttpOnly 속성을 포함한다", () => {
			// Arrange
			const authService = createAuthService(mockAuthProvider, mockUserRepository);

			// Act
			const headers = authService.clearSessionHeaders();
			const setCookies = headers.getSetCookie();

			// Assert
			for (const cookie of setCookies) {
				expect(cookie).toContain("HttpOnly");
			}
		});

		it("Path=/를 포함한다", () => {
			// Arrange
			const authService = createAuthService(mockAuthProvider, mockUserRepository);

			// Act
			const headers = authService.clearSessionHeaders();
			const setCookies = headers.getSetCookie();

			// Assert
			for (const cookie of setCookies) {
				expect(cookie).toContain("Path=/");
			}
		});
	});
});
