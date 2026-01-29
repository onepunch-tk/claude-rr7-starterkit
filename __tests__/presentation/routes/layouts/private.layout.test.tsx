import { describe, it, expect, vi, beforeEach } from "vitest";
import { loader } from "~/presentation/routes/layouts/private.layout";
import type { IUser } from "~/domain/user";
import type { IContainer } from "~/application/shared/container.types";

// requireAuth 모킹
vi.mock("~/presentation/lib/middleware", () => ({
	requireAuth: vi.fn(),
}));

import { requireAuth } from "~/presentation/lib/middleware";

// 테스트용 사용자 생성 헬퍼
const createMockUser = (overrides: Partial<IUser> = {}): IUser => ({
	id: "user-123",
	email: "test@example.com",
	name: "Test User",
	emailVerified: true,
	image: null,
	createdAt: new Date(),
	updatedAt: new Date(),
	...overrides,
});

describe("PrivateLayout", () => {
	let mockContainer: IContainer;

	beforeEach(() => {
		vi.clearAllMocks();

		mockContainer = {
			authService: {
				getCurrentUser: vi.fn(),
			},
		} as unknown as IContainer;
	});

	// 테스트용 loader args 생성 헬퍼
	const createLoaderArgs = (request: Request) =>
		({
			request,
			context: {
				env: {},
				platform: "node",
				container: mockContainer,
			},
			params: {},
		}) as unknown as Parameters<typeof loader>[0];

	describe("loader", () => {
		it("requireAuth를 호출한다", async () => {
			// Arrange
			const mockUser = createMockUser();
			vi.mocked(requireAuth).mockResolvedValue(mockUser);

			const request = new Request("http://localhost/my/dashboard");

			// Act
			await loader(createLoaderArgs(request));

			// Assert
			expect(requireAuth).toHaveBeenCalledWith({
				request,
				container: mockContainer,
			});
		});

		it("인증된 사용자 정보를 반환한다", async () => {
			// Arrange
			const mockUser = createMockUser();
			vi.mocked(requireAuth).mockResolvedValue(mockUser);

			const request = new Request("http://localhost/my/dashboard");

			// Act
			const result = await loader(createLoaderArgs(request));

			// Assert
			expect(result).toEqual({ user: mockUser });
		});

		it("인증되지 않은 사용자는 리다이렉트된다", async () => {
			// Arrange
			vi.mocked(requireAuth).mockImplementation(() => {
				throw new Response(null, {
					status: 302,
					headers: { Location: "/auth/signin" },
				});
			});

			const request = new Request("http://localhost/my/dashboard");

			// Act & Assert
			await expect(loader(createLoaderArgs(request))).rejects.toThrow();
		});
	});
});
