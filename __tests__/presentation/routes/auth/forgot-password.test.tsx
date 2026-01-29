import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";

// react-router 훅 모킹
const mockUseActionData = vi.fn();

vi.mock("react-router", async () => {
	const actual = await vi.importActual("react-router");
	return {
		...actual,
		useActionData: () => mockUseActionData(),
	};
});

// 컴포넌트는 모킹 이후에 import
const { default: ForgotPassword } = await import(
	"~/presentation/routes/auth/forgot-password"
);

describe("ForgotPassword", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// 기본값 설정
		mockUseActionData.mockReturnValue(null);
	});

	describe("기본 렌더링", () => {
		it("비밀번호 찾기 폼을 렌더링한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/auth/forgot-password",
					Component: ForgotPassword,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/auth/forgot-password"]} />);

			// Assert
			expect(await screen.findByText("비밀번호 찾기")).toBeInTheDocument();
		});

		it("이메일 입력 필드를 표시한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/auth/forgot-password",
					Component: ForgotPassword,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/auth/forgot-password"]} />);

			// Assert
			expect(await screen.findByLabelText(/이메일/i)).toBeInTheDocument();
		});

		it("재설정 링크 전송 버튼을 표시한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/auth/forgot-password",
					Component: ForgotPassword,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/auth/forgot-password"]} />);

			// Assert
			expect(
				await screen.findByRole("button", { name: /재설정 링크 전송/i }),
			).toBeInTheDocument();
		});
	});

	describe("성공 상태", () => {
		it("이메일 전송 완료 메시지를 표시한다", async () => {
			// Arrange
			mockUseActionData.mockReturnValue({ success: true });

			const RoutesStub = createRoutesStub([
				{
					path: "/auth/forgot-password",
					Component: ForgotPassword,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/auth/forgot-password"]} />);

			// Assert
			expect(await screen.findByText(/이메일 전송 완료/i)).toBeInTheDocument();
		});

		it("성공 메시지에 안내 텍스트를 표시한다", async () => {
			// Arrange
			mockUseActionData.mockReturnValue({ success: true });

			const RoutesStub = createRoutesStub([
				{
					path: "/auth/forgot-password",
					Component: ForgotPassword,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/auth/forgot-password"]} />);

			// Assert
			expect(
				await screen.findByText(/링크를 클릭하여 새로운 비밀번호/i),
			).toBeInTheDocument();
		});
	});

	describe("에러 상태", () => {
		it("에러 메시지를 표시한다", async () => {
			// Arrange
			mockUseActionData.mockReturnValue({
				error: "이메일을 찾을 수 없습니다.",
			});

			const RoutesStub = createRoutesStub([
				{
					path: "/auth/forgot-password",
					Component: ForgotPassword,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/auth/forgot-password"]} />);

			// Assert
			expect(
				await screen.findByText(/이메일을 찾을 수 없습니다/i),
			).toBeInTheDocument();
		});
	});

	describe("링크", () => {
		it("로그인으로 돌아가기 링크를 표시한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/auth/forgot-password",
					Component: ForgotPassword,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/auth/forgot-password"]} />);

			// Assert
			expect(
				await screen.findByText(/로그인으로 돌아가기/i),
			).toBeInTheDocument();
		});
	});
});
