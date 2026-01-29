import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import type { IUser } from "~/domain/user";

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

// react-router 훅 모킹
const mockUseOutletContext = vi.fn();
const mockUseActionData = vi.fn();
const mockUseSearchParams = vi.fn();

vi.mock("react-router", async () => {
	const actual = await vi.importActual("react-router");
	return {
		...actual,
		useOutletContext: () => mockUseOutletContext(),
		useActionData: () => mockUseActionData(),
		useSearchParams: () => mockUseSearchParams(),
	};
});

// 컴포넌트는 모킹 이후에 import
const { default: SignIn } = await import(
	"~/presentation/routes/auth/sign-in"
);

describe("SignIn", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// 기본값 설정
		mockUseOutletContext.mockReturnValue({ user: null });
		mockUseActionData.mockReturnValue(null);
		mockUseSearchParams.mockReturnValue([new URLSearchParams()]);
	});

	describe("미인증 상태 렌더링", () => {
		it("로그인 폼을 렌더링한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/auth/signin",
					Component: SignIn,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/auth/signin"]} />);

			// Assert
			// CardTitle에 있는 "로그인" 텍스트 확인
			const titles = await screen.findAllByText("로그인");
			expect(titles.length).toBeGreaterThan(0);
		});

		it("이메일 입력 필드를 표시한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/auth/signin",
					Component: SignIn,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/auth/signin"]} />);

			// Assert
			expect(await screen.findByLabelText(/이메일/i)).toBeInTheDocument();
		});

		it("비밀번호 입력 필드를 표시한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/auth/signin",
					Component: SignIn,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/auth/signin"]} />);

			// Assert
			expect(await screen.findByLabelText(/비밀번호/i)).toBeInTheDocument();
		});

		it("로그인 버튼을 표시한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/auth/signin",
					Component: SignIn,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/auth/signin"]} />);

			// Assert
			// 제출 버튼들 중 "로그인" 텍스트가 있는 버튼 확인
			const buttons = await screen.findAllByRole("button");
			const loginButton = buttons.find(
				(btn) => btn.textContent?.trim() === "로그인",
			);
			expect(loginButton).toBeInTheDocument();
		});
	});

	describe("인증된 상태 렌더링", () => {
		it("이미 로그인됨 메시지를 표시한다", async () => {
			// Arrange
			const mockUser = createMockUser();
			mockUseOutletContext.mockReturnValue({ user: mockUser });

			const RoutesStub = createRoutesStub([
				{
					path: "/auth/signin",
					Component: SignIn,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/auth/signin"]} />);

			// Assert
			expect(
				await screen.findByText(/이미 로그인되어 있습니다/i),
			).toBeInTheDocument();
		});

		it("대시보드로 이동 버튼을 표시한다", async () => {
			// Arrange
			const mockUser = createMockUser();
			mockUseOutletContext.mockReturnValue({ user: mockUser });

			const RoutesStub = createRoutesStub([
				{
					path: "/auth/signin",
					Component: SignIn,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/auth/signin"]} />);

			// Assert
			expect(
				await screen.findByRole("link", { name: /대시보드로 이동/i }),
			).toBeInTheDocument();
		});
	});

	describe("링크", () => {
		it("비밀번호 찾기 링크를 표시한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/auth/signin",
					Component: SignIn,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/auth/signin"]} />);

			// Assert
			expect(
				await screen.findByText(/비밀번호를 잊으셨나요/i),
			).toBeInTheDocument();
		});

		it("회원가입 링크를 표시한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/auth/signin",
					Component: SignIn,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/auth/signin"]} />);

			// Assert
			expect(
				await screen.findByRole("link", { name: "회원가입" }),
			).toBeInTheDocument();
		});
	});

	describe("OAuth 로그인", () => {
		it("GitHub 로그인 버튼을 표시한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/auth/signin",
					Component: SignIn,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/auth/signin"]} />);

			// Assert
			expect(
				await screen.findByRole("button", { name: /GitHub로 로그인/i }),
			).toBeInTheDocument();
		});
	});

	describe("에러 상태", () => {
		it("에러 메시지를 표시한다", async () => {
			// Arrange
			mockUseActionData.mockReturnValue({ error: "로그인에 실패했습니다." });

			const RoutesStub = createRoutesStub([
				{
					path: "/auth/signin",
					Component: SignIn,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/auth/signin"]} />);

			// Assert
			expect(
				await screen.findByText(/로그인에 실패했습니다/i),
			).toBeInTheDocument();
		});
	});

	describe("회원가입 완료 메시지", () => {
		it("이메일 인증 메시지를 표시한다", async () => {
			// Arrange
			mockUseSearchParams.mockReturnValue([
				new URLSearchParams("message=email-verification-sent"),
			]);

			const RoutesStub = createRoutesStub([
				{
					path: "/auth/signin",
					Component: SignIn,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/auth/signin"]} />);

			// Assert
			expect(
				await screen.findByText(/이메일을 확인하여 인증을 완료해주세요/i),
			).toBeInTheDocument();
		});
	});
});
