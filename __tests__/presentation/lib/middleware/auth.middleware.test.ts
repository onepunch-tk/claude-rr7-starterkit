import { describe, it, expect, vi, beforeEach } from "vitest";
import {
	requireAuth,
	getOptionalAuth,
	type MiddlewareContext,
} from "~/presentation/lib/middleware/auth.middleware";
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

describe("requireAuth", () => {
	let mockContainer: IContainer;
	let mockRequest: Request;

	beforeEach(() => {
		vi.clearAllMocks();

		mockContainer = {
			authService: {
				getCurrentUser: vi.fn(),
			},
		} as unknown as IContainer;

		mockRequest = new Request("http://localhost:3000/dashboard");
	});

	describe("인증된 사용자", () => {
		it("인증된 사용자의 정보를 반환한다", async () => {
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
			vi.mocked(mockContainer.authService.getCurrentUser).mockResolvedValue(
				mockUser,
			);

			const context: MiddlewareContext = {
				request: mockRequest,
				container: mockContainer,
			};

			// Act
			const result = await requireAuth(context);

			// Assert
			expect(result).toEqual(mockUser);
			expect(mockContainer.authService.getCurrentUser).toHaveBeenCalledWith(
				mockRequest.headers,
			);
		});
	});

	describe("인증되지 않은 사용자", () => {
		it("로그인 페이지로 리다이렉트한다", async () => {
			// Arrange
			vi.mocked(mockContainer.authService.getCurrentUser).mockResolvedValue(
				null,
			);

			const context: MiddlewareContext = {
				request: mockRequest,
				container: mockContainer,
			};

			// Act & Assert
			await expect(requireAuth(context)).rejects.toThrow();
		});

		it("redirectTo 파라미터에 현재 경로를 포함한다", async () => {
			// Arrange
			vi.mocked(mockContainer.authService.getCurrentUser).mockResolvedValue(
				null,
			);
			const requestWithPath = new Request(
				"http://localhost:3000/settings/profile",
			);

			const context: MiddlewareContext = {
				request: requestWithPath,
				container: mockContainer,
			};

			// Act & Assert
			try {
				await requireAuth(context);
			} catch (error) {
				if (error instanceof Response) {
					const location = error.headers.get("Location");
					expect(location).toContain("/auth/signin");
					expect(location).toContain(
						`redirectTo=${encodeURIComponent("/settings/profile")}`,
					);
				}
			}
		});

		it("쿼리 파라미터도 redirectTo에 포함한다", async () => {
			// Arrange
			vi.mocked(mockContainer.authService.getCurrentUser).mockResolvedValue(
				null,
			);
			const requestWithQuery = new Request(
				"http://localhost:3000/dashboard?tab=settings",
			);

			const context: MiddlewareContext = {
				request: requestWithQuery,
				container: mockContainer,
			};

			// Act & Assert
			try {
				await requireAuth(context);
			} catch (error) {
				if (error instanceof Response) {
					const location = error.headers.get("Location");
					expect(location).toContain(
						encodeURIComponent("/dashboard?tab=settings"),
					);
				}
			}
		});
	});
});

describe("getOptionalAuth", () => {
	let mockContainer: IContainer;
	let mockRequest: Request;

	beforeEach(() => {
		vi.clearAllMocks();

		mockContainer = {
			authService: {
				getCurrentUser: vi.fn(),
			},
		} as unknown as IContainer;

		mockRequest = new Request("http://localhost:3000/");
	});

	describe("인증된 사용자", () => {
		it("사용자 정보를 반환한다", async () => {
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
			vi.mocked(mockContainer.authService.getCurrentUser).mockResolvedValue(
				mockUser,
			);

			const context: MiddlewareContext = {
				request: mockRequest,
				container: mockContainer,
			};

			// Act
			const result = await getOptionalAuth(context);

			// Assert
			expect(result).toEqual(mockUser);
		});
	});

	describe("인증되지 않은 사용자", () => {
		it("null을 반환한다", async () => {
			// Arrange
			vi.mocked(mockContainer.authService.getCurrentUser).mockResolvedValue(
				null,
			);

			const context: MiddlewareContext = {
				request: mockRequest,
				container: mockContainer,
			};

			// Act
			const result = await getOptionalAuth(context);

			// Assert
			expect(result).toBeNull();
		});
	});

	describe("에러 발생 시", () => {
		it("에러 발생 시 null을 반환한다", async () => {
			// Arrange
			vi.mocked(mockContainer.authService.getCurrentUser).mockRejectedValue(
				new Error("Auth error"),
			);

			const context: MiddlewareContext = {
				request: mockRequest,
				container: mockContainer,
			};

			// Act
			const result = await getOptionalAuth(context);

			// Assert
			expect(result).toBeNull();
		});
	});
});
