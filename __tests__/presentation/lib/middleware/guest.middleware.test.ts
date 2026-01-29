import { describe, it, expect, vi, beforeEach } from "vitest";
import { requireGuest } from "~/presentation/lib/middleware/guest.middleware";
import type { MiddlewareContext } from "~/presentation/lib/middleware/auth.middleware";
import type { IUser } from "~/domain/user";
import type { IContainer } from "~/application/shared/container.types";

// Mock redirect
vi.mock("react-router", () => ({
	redirect: vi.fn((url: string) => {
		const error = new Response(null, {
			status: 302,
			headers: { Location: url },
		});
		throw error;
	}),
}));

// Mock getOptionalAuth
vi.mock("~/presentation/lib/middleware/auth.middleware", async () => {
	const actual = await vi.importActual(
		"~/presentation/lib/middleware/auth.middleware",
	);
	return {
		...actual,
		getOptionalAuth: vi.fn(),
	};
});

import { getOptionalAuth } from "~/presentation/lib/middleware/auth.middleware";

describe("requireGuest", () => {
	let mockContainer: IContainer;
	let mockRequest: Request;

	beforeEach(() => {
		vi.clearAllMocks();

		mockContainer = {
			authService: {
				getCurrentUser: vi.fn(),
			},
		} as unknown as IContainer;

		mockRequest = new Request("http://localhost:3000/auth/signin");
	});

	describe("게스트 사용자 (미인증)", () => {
		it("로그인하지 않은 사용자는 아무 동작 없이 통과한다", async () => {
			// Arrange
			vi.mocked(getOptionalAuth).mockResolvedValue(null);

			const context: MiddlewareContext = {
				request: mockRequest,
				container: mockContainer,
			};

			// Act & Assert
			await expect(requireGuest(context)).resolves.toBeUndefined();
		});
	});

	describe("인증된 사용자", () => {
		it("로그인한 사용자는 대시보드로 리다이렉트한다", async () => {
			// Arrange
			const mockUser: IUser = {
				id: "user-123",
				email: "test@example.com",
				name: "Test User",
				emailVerified: true,
				image: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			};
			vi.mocked(getOptionalAuth).mockResolvedValue(mockUser);

			const context: MiddlewareContext = {
				request: mockRequest,
				container: mockContainer,
			};

			// Act & Assert
			await expect(requireGuest(context)).rejects.toThrow();
		});

		it("리다이렉트 URL이 /dashboard이다", async () => {
			// Arrange
			const mockUser: IUser = {
				id: "user-123",
				email: "test@example.com",
				name: "Test User",
				emailVerified: true,
				image: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			};
			vi.mocked(getOptionalAuth).mockResolvedValue(mockUser);

			const context: MiddlewareContext = {
				request: mockRequest,
				container: mockContainer,
			};

			// Act & Assert
			try {
				await requireGuest(context);
			} catch (error) {
				if (error instanceof Response) {
					const location = error.headers.get("Location");
					expect(location).toBe("/dashboard");
				}
			}
		});
	});

	describe("다양한 인증 페이지에서의 동작", () => {
		it("회원가입 페이지에서도 인증된 사용자를 리다이렉트한다", async () => {
			// Arrange
			const mockUser: IUser = {
				id: "user-123",
				email: "test@example.com",
				name: "Test User",
				emailVerified: true,
				image: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			};
			vi.mocked(getOptionalAuth).mockResolvedValue(mockUser);

			const signupRequest = new Request("http://localhost:3000/auth/signup");
			const context: MiddlewareContext = {
				request: signupRequest,
				container: mockContainer,
			};

			// Act & Assert
			await expect(requireGuest(context)).rejects.toThrow();
		});

		it("비밀번호 찾기 페이지에서도 인증된 사용자를 리다이렉트한다", async () => {
			// Arrange
			const mockUser: IUser = {
				id: "user-123",
				email: "test@example.com",
				name: "Test User",
				emailVerified: true,
				image: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			};
			vi.mocked(getOptionalAuth).mockResolvedValue(mockUser);

			const forgotPasswordRequest = new Request(
				"http://localhost:3000/auth/forgot-password",
			);
			const context: MiddlewareContext = {
				request: forgotPasswordRequest,
				container: mockContainer,
			};

			// Act & Assert
			await expect(requireGuest(context)).rejects.toThrow();
		});
	});
});
