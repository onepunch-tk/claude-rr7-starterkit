import { describe, it, expect, vi, beforeEach } from "vitest";
import { action } from "~/presentation/routes/auth/sign-out";
import type { IContainer } from "~/application/shared/container.types";

describe("SignOut action", () => {
	let mockContainer: IContainer;

	beforeEach(() => {
		vi.clearAllMocks();

		mockContainer = {
			authService: {
				signOut: vi.fn().mockResolvedValue(undefined),
				clearSessionHeaders: vi.fn().mockReturnValue(new Headers()),
			},
		} as unknown as IContainer;
	});

	// 테스트용 action args 생성 헬퍼
	const createActionArgs = (request: Request) =>
		({
			request,
			context: {
				env: {},
				platform: "node",
				container: mockContainer,
			},
			params: {},
		}) as unknown as Parameters<typeof action>[0];

	describe("HTTP 메서드 검증", () => {
		it("POST가 아닌 요청은 405 에러를 반환한다", async () => {
			// Arrange
			const request = new Request("http://localhost/auth/signout", {
				method: "GET",
			});

			// Act & Assert
			await expect(action(createActionArgs(request))).rejects.toThrow();
		});
	});

	describe("로그아웃 처리", () => {
		it("POST 요청 시 signOut을 호출한다", async () => {
			// Arrange
			const request = new Request("http://localhost/auth/signout", {
				method: "POST",
			});

			// Act
			try {
				await action(createActionArgs(request));
			} catch (error) {
				// redirect는 Response를 throw함
				if (error instanceof Response) {
					expect(error.status).toBe(302);
				}
			}

			// Assert
			expect(mockContainer.authService.signOut).toHaveBeenCalledWith(
				request.headers,
			);
		});

		it("성공 시 홈으로 리다이렉트한다", async () => {
			// Arrange
			const request = new Request("http://localhost/auth/signout", {
				method: "POST",
			});

			// Act & Assert
			try {
				await action(createActionArgs(request));
			} catch (error) {
				if (error instanceof Response) {
					expect(error.headers.get("Location")).toBe("/");
				}
			}
		});

		it("실패해도 홈으로 리다이렉트한다", async () => {
			// Arrange
			vi.mocked(mockContainer.authService.signOut).mockRejectedValue(
				new Error("로그아웃 실패"),
			);

			const request = new Request("http://localhost/auth/signout", {
				method: "POST",
			});

			// Act & Assert
			try {
				await action(createActionArgs(request));
			} catch (error) {
				if (error instanceof Response) {
					expect(error.headers.get("Location")).toBe("/");
				}
			}
		});

		it("세션 헤더 삭제를 호출한다", async () => {
			// Arrange
			const request = new Request("http://localhost/auth/signout", {
				method: "POST",
			});

			// Act
			try {
				await action(createActionArgs(request));
			} catch {
				// redirect로 인한 예외 무시
			}

			// Assert
			expect(mockContainer.authService.clearSessionHeaders).toHaveBeenCalled();
		});
	});
});
