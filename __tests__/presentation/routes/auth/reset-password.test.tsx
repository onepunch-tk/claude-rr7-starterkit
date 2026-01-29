import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";

// react-router 훅 모킹
const mockUseSearchParams = vi.fn();
const mockUseActionData = vi.fn();

vi.mock("react-router", async () => {
	const actual = await vi.importActual("react-router");
	return {
		...actual,
		useSearchParams: () => mockUseSearchParams(),
		useActionData: () => mockUseActionData(),
	};
});

// 컴포넌트는 모킹 이후에 import
const { default: ResetPassword } = await import(
	"~/presentation/routes/auth/reset-password"
);

describe("ResetPassword", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// 기본값 설정: 토큰 있음
		mockUseSearchParams.mockReturnValue([
			new URLSearchParams("token=abc123"),
		]);
		mockUseActionData.mockReturnValue(null);
	});

	describe("토큰이 없는 경우", () => {
		beforeEach(() => {
			mockUseSearchParams.mockReturnValue([new URLSearchParams()]);
		});

		it("잘못된 접근 메시지를 표시한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/auth/reset-password",
					Component: ResetPassword,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/auth/reset-password"]} />);

			// Assert
			expect(await screen.findByText(/잘못된 접근/i)).toBeInTheDocument();
		});

		it("비밀번호 찾기 링크를 표시한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/auth/reset-password",
					Component: ResetPassword,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/auth/reset-password"]} />);

			// Assert
			expect(
				await screen.findByRole("link", { name: /비밀번호 찾기/i }),
			).toBeInTheDocument();
		});

		it("로그인 링크를 표시한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/auth/reset-password",
					Component: ResetPassword,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/auth/reset-password"]} />);

			// Assert
			expect(await screen.findByText("로그인")).toBeInTheDocument();
		});
	});

	describe("토큰이 있는 경우", () => {
		it("새 비밀번호 설정 폼을 표시한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/auth/reset-password",
					Component: ResetPassword,
				},
			]);

			// Act
			render(
				<RoutesStub initialEntries={["/auth/reset-password?token=abc123"]} />,
			);

			// Assert
			expect(await screen.findByText(/새 비밀번호 설정/i)).toBeInTheDocument();
		});

		it("새 비밀번호 입력 필드를 표시한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/auth/reset-password",
					Component: ResetPassword,
				},
			]);

			// Act
			render(
				<RoutesStub initialEntries={["/auth/reset-password?token=abc123"]} />,
			);

			// Assert
			// 페이지 로딩 대기 후 새 비밀번호 input 확인
			await screen.findByText(/새 비밀번호 설정/i);
			const newPasswordInput = document.querySelector('input[name="newPassword"]');
			expect(newPasswordInput).toBeInTheDocument();
		});

		it("새 비밀번호 확인 입력 필드를 표시한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/auth/reset-password",
					Component: ResetPassword,
				},
			]);

			// Act
			render(
				<RoutesStub initialEntries={["/auth/reset-password?token=abc123"]} />,
			);

			// Assert
			expect(
				await screen.findByLabelText(/새 비밀번호 확인/i),
			).toBeInTheDocument();
		});

		it("비밀번호 변경 버튼을 표시한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/auth/reset-password",
					Component: ResetPassword,
				},
			]);

			// Act
			render(
				<RoutesStub initialEntries={["/auth/reset-password?token=abc123"]} />,
			);

			// Assert
			expect(
				await screen.findByRole("button", { name: /비밀번호 변경/i }),
			).toBeInTheDocument();
		});
	});

	describe("에러 상태", () => {
		it("에러 메시지를 표시한다", async () => {
			// Arrange
			mockUseActionData.mockReturnValue({ error: "유효하지 않은 토큰입니다." });

			const RoutesStub = createRoutesStub([
				{
					path: "/auth/reset-password",
					Component: ResetPassword,
				},
			]);

			// Act
			render(
				<RoutesStub initialEntries={["/auth/reset-password?token=abc123"]} />,
			);

			// Assert
			expect(
				await screen.findByText(/유효하지 않은 토큰입니다/i),
			).toBeInTheDocument();
		});
	});

	describe("링크", () => {
		it("로그인으로 돌아가기 링크를 표시한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/auth/reset-password",
					Component: ResetPassword,
				},
			]);

			// Act
			render(
				<RoutesStub initialEntries={["/auth/reset-password?token=abc123"]} />,
			);

			// Assert
			expect(
				await screen.findByText(/로그인으로 돌아가기/i),
			).toBeInTheDocument();
		});
	});
});
