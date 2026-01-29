import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import type { IUser } from "~/domain/user";
import NavigationBar from "~/presentation/components/navigation-bar";
import { SidebarProvider } from "~/presentation/components/ui/sidebar";

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

// 래퍼 컴포넌트 (MemoryRouter 포함)
const renderWithRouter = (
	ui: React.ReactElement,
	{ route = "/" }: { route?: string } = {},
) => {
	return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
};

describe("NavigationBar", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("기본 렌더링", () => {
		it("로고와 사이트 이름을 렌더링한다", () => {
			// Arrange & Act
			renderWithRouter(<NavigationBar />);

			// Assert
			expect(screen.getByText("C")).toBeInTheDocument();
			expect(screen.getByText("Claude RR7 Starterkit")).toBeInTheDocument();
		});

		it("로고 클릭 시 홈으로 이동하는 링크가 있다", () => {
			// Arrange & Act
			renderWithRouter(<NavigationBar />);

			// Assert
			const homeLink = screen.getByRole("link", {
				name: /Claude RR7 Starterkit/i,
			});
			expect(homeLink).toHaveAttribute("href", "/");
		});
	});

	describe("미인증 상태", () => {
		it("로그인 버튼을 표시한다", () => {
			// Arrange & Act
			renderWithRouter(<NavigationBar />);

			// Assert
			expect(screen.getByRole("link", { name: "로그인" })).toBeInTheDocument();
		});

		it("시작하기 버튼을 표시한다", () => {
			// Arrange & Act
			renderWithRouter(<NavigationBar />);

			// Assert
			expect(screen.getByRole("link", { name: "시작하기" })).toBeInTheDocument();
		});

		it("로그인 링크가 /auth/signin으로 연결된다", () => {
			// Arrange & Act
			renderWithRouter(<NavigationBar />);

			// Assert
			const loginLink = screen.getByRole("link", { name: "로그인" });
			expect(loginLink).toHaveAttribute("href", "/auth/signin");
		});

		it("시작하기 링크가 /auth/signup으로 연결된다", () => {
			// Arrange & Act
			renderWithRouter(<NavigationBar />);

			// Assert
			const signupLink = screen.getByRole("link", { name: "시작하기" });
			expect(signupLink).toHaveAttribute("href", "/auth/signup");
		});
	});

	describe("인증된 상태", () => {
		it("사용자 메뉴 버튼을 표시한다", () => {
			// Arrange
			const user = createMockUser();

			// Act
			renderWithRouter(<NavigationBar user={user} />);

			// Assert
			// 사용자 아이콘 버튼이 있어야 함
			const userButton = screen.getByRole("button");
			expect(userButton).toBeInTheDocument();
		});

		it("로그인/시작하기 버튼을 숨긴다", () => {
			// Arrange
			const user = createMockUser();

			// Act
			renderWithRouter(<NavigationBar user={user} />);

			// Assert
			expect(screen.queryByRole("link", { name: "로그인" })).not.toBeInTheDocument();
			expect(
				screen.queryByRole("link", { name: "시작하기" }),
			).not.toBeInTheDocument();
		});
	});

	describe("로딩 상태", () => {
		it("로딩 중일 때 스켈레톤을 표시한다", () => {
			// Arrange & Act
			const { container } = renderWithRouter(<NavigationBar loading />);

			// Assert
			const skeleton = container.querySelector(".animate-pulse");
			expect(skeleton).toBeInTheDocument();
		});

		it("로딩 중일 때 로그인/시작하기 버튼을 숨긴다", () => {
			// Arrange & Act
			renderWithRouter(<NavigationBar loading />);

			// Assert
			expect(
				screen.queryByRole("link", { name: "로그인" }),
			).not.toBeInTheDocument();
			expect(
				screen.queryByRole("link", { name: "시작하기" }),
			).not.toBeInTheDocument();
		});
	});

	describe("앱 페이지에서의 동작", () => {
		it("/my/ 경로에서 인증된 사용자에게 사이드바 트리거를 표시한다", () => {
			// Arrange
			const user = createMockUser();

			// Act
			// SidebarTrigger는 SidebarProvider 내에서만 동작함
			const { container } = render(
				<MemoryRouter initialEntries={["/my/dashboard"]}>
					<SidebarProvider>
						<NavigationBar user={user} />
					</SidebarProvider>
				</MemoryRouter>,
			);

			// Assert
			// SidebarTrigger가 렌더링되는지 확인
			// md:hidden 클래스를 가진 버튼이 있어야 함
			const sidebarTrigger = container.querySelector(".md\\:hidden");
			expect(sidebarTrigger).toBeInTheDocument();
		});

		it("/ 경로에서는 사이드바 트리거를 표시하지 않는다", () => {
			// Arrange
			const user = createMockUser();

			// Act
			const { container } = renderWithRouter(<NavigationBar user={user} />, {
				route: "/",
			});

			// Assert
			// md:hidden 클래스를 가진 SidebarTrigger 버튼이 없어야 함
			const buttons = container.querySelectorAll("button.md\\:hidden");
			// 첫 번째 버튼은 사용자 메뉴이므로 SidebarTrigger가 아님
			expect(buttons.length).toBe(0);
		});
	});
});
