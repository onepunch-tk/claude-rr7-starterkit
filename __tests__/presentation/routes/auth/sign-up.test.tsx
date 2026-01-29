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

vi.mock("react-router", async () => {
	const actual = await vi.importActual("react-router");
	return {
		...actual,
		useOutletContext: () => mockUseOutletContext(),
		useActionData: () => mockUseActionData(),
	};
});

// 컴포넌트는 모킹 이후에 import
const { default: SignUp } = await import("~/presentation/routes/auth/sign-up");

describe("SignUp", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// 기본값 설정
		mockUseOutletContext.mockReturnValue({ user: null });
		mockUseActionData.mockReturnValue(null);
	});

	describe("미인증 상태 렌더링", () => {
		it("회원가입 폼을 렌더링한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/auth/signup",
					Component: SignUp,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/auth/signup"]} />);

			// Assert
			// "회원가입" 텍스트가 페이지에 존재하는지 확인 (제목 또는 버튼)
			const elements = await screen.findAllByText(/회원가입/i);
			expect(elements.length).toBeGreaterThan(0);
		});

		it("이름 입력 필드를 표시한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/auth/signup",
					Component: SignUp,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/auth/signup"]} />);

			// Assert
			expect(await screen.findByLabelText(/이름/i)).toBeInTheDocument();
		});

		it("이메일 입력 필드를 표시한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/auth/signup",
					Component: SignUp,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/auth/signup"]} />);

			// Assert
			expect(await screen.findByLabelText(/이메일/i)).toBeInTheDocument();
		});

		it("비밀번호 입력 필드를 표시한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/auth/signup",
					Component: SignUp,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/auth/signup"]} />);

			// Assert
			// 비밀번호 입력 필드가 존재하는지 확인 (input[name="password"])
			await screen.findByText(/새로운 계정을 만들어/i); // 페이지 로딩 대기
			const passwordInput = document.querySelector('input[name="password"]');
			expect(passwordInput).toBeInTheDocument();
		});

		it("회원가입 버튼을 표시한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/auth/signup",
					Component: SignUp,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/auth/signup"]} />);

			// Assert
			expect(
				await screen.findByRole("button", { name: /회원가입/i }),
			).toBeInTheDocument();
		});
	});

	describe("인증된 상태 렌더링", () => {
		it("이미 로그인됨 메시지를 표시한다", async () => {
			// Arrange
			const mockUser = createMockUser();
			mockUseOutletContext.mockReturnValue({ user: mockUser });

			const RoutesStub = createRoutesStub([
				{
					path: "/auth/signup",
					Component: SignUp,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/auth/signup"]} />);

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
					path: "/auth/signup",
					Component: SignUp,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/auth/signup"]} />);

			// Assert
			expect(
				await screen.findByRole("link", { name: /대시보드로 이동/i }),
			).toBeInTheDocument();
		});
	});

	describe("회원가입 성공 상태", () => {
		it("회원가입 완료 메시지를 표시한다", async () => {
			// Arrange
			mockUseActionData.mockReturnValue({
				success: true,
				message: "회원가입이 완료되었습니다.",
			});

			const RoutesStub = createRoutesStub([
				{
					path: "/auth/signup",
					Component: SignUp,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/auth/signup"]} />);

			// Assert
			expect(await screen.findByText(/회원가입 완료/i)).toBeInTheDocument();
		});

		it("이메일 인증 안내를 표시한다", async () => {
			// Arrange
			mockUseActionData.mockReturnValue({
				success: true,
				message: "회원가입이 완료되었습니다.",
			});

			const RoutesStub = createRoutesStub([
				{
					path: "/auth/signup",
					Component: SignUp,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/auth/signup"]} />);

			// Assert
			expect(
				await screen.findByText(/이메일을 확인하여 계정을 활성화해주세요/i),
			).toBeInTheDocument();
		});
	});

	describe("약관 동의", () => {
		it("이용약관 링크를 표시한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/auth/signup",
					Component: SignUp,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/auth/signup"]} />);

			// Assert
			expect(await screen.findByText(/이용약관/i)).toBeInTheDocument();
		});

		it("개인정보 처리방침 링크를 표시한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/auth/signup",
					Component: SignUp,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/auth/signup"]} />);

			// Assert
			expect(await screen.findByText(/개인정보 처리방침/i)).toBeInTheDocument();
		});
	});

	describe("링크", () => {
		it("로그인 링크를 표시한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/auth/signup",
					Component: SignUp,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/auth/signup"]} />);

			// Assert
			expect(
				await screen.findByRole("link", { name: "로그인" }),
			).toBeInTheDocument();
		});
	});

	describe("에러 상태", () => {
		it("에러 메시지를 표시한다", async () => {
			// Arrange
			mockUseActionData.mockReturnValue({
				error: "이미 등록된 이메일입니다.",
			});

			const RoutesStub = createRoutesStub([
				{
					path: "/auth/signup",
					Component: SignUp,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/auth/signup"]} />);

			// Assert
			expect(
				await screen.findByText(/이미 등록된 이메일입니다/i),
			).toBeInTheDocument();
		});
	});
});
