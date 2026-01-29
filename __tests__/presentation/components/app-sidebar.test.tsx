import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AppSidebar } from "~/presentation/components/app-sidebar";
import { SidebarProvider } from "~/presentation/components/ui/sidebar";

// 래퍼 컴포넌트 (SidebarProvider와 MemoryRouter 포함)
const renderWithProviders = (
	ui: React.ReactElement,
	{ route = "/my/dashboard" }: { route?: string } = {},
) => {
	return render(
		<MemoryRouter initialEntries={[route]}>
			<SidebarProvider>{ui}</SidebarProvider>
		</MemoryRouter>,
	);
};

describe("AppSidebar", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("기본 렌더링", () => {
		it("사이드바를 렌더링한다", () => {
			// Arrange & Act
			const { container } = renderWithProviders(<AppSidebar />);

			// Assert
			// Sidebar는 data-slot="sidebar" 속성을 가짐
			const sidebar = container.querySelector('[data-slot="sidebar"]');
			expect(sidebar).toBeInTheDocument();
		});

		it("애플리케이션 그룹 레이블을 표시한다", () => {
			// Arrange & Act
			renderWithProviders(<AppSidebar />);

			// Assert
			expect(screen.getByText("애플리케이션")).toBeInTheDocument();
		});
	});

	describe("메뉴 아이템", () => {
		it("대시보드 메뉴를 표시한다", () => {
			// Arrange & Act
			renderWithProviders(<AppSidebar />);

			// Assert
			expect(screen.getByText("대시보드")).toBeInTheDocument();
		});

		it("설정 메뉴를 표시한다", () => {
			// Arrange & Act
			renderWithProviders(<AppSidebar />);

			// Assert
			expect(screen.getByText("설정")).toBeInTheDocument();
		});

		it("대시보드 링크가 /my/dashboard로 연결된다", () => {
			// Arrange & Act
			renderWithProviders(<AppSidebar />);

			// Assert
			const dashboardLink = screen.getByRole("link", { name: /대시보드/i });
			expect(dashboardLink).toHaveAttribute("href", "/my/dashboard");
		});

		it("설정 링크가 /my/settings로 연결된다", () => {
			// Arrange & Act
			renderWithProviders(<AppSidebar />);

			// Assert
			const settingsLink = screen.getByRole("link", { name: /설정/i });
			expect(settingsLink).toHaveAttribute("href", "/my/settings");
		});
	});

	describe("활성 상태", () => {
		it("/my/dashboard 경로에서 대시보드가 활성화된다", () => {
			// Arrange & Act
			renderWithProviders(<AppSidebar />, { route: "/my/dashboard" });

			// Assert
			const dashboardLink = screen.getByRole("link", { name: /대시보드/i });
			expect(dashboardLink).toHaveAttribute("data-active", "true");
		});

		it("/my/settings 경로에서 설정이 활성화된다", () => {
			// Arrange & Act
			renderWithProviders(<AppSidebar />, { route: "/my/settings" });

			// Assert
			const settingsLink = screen.getByRole("link", { name: /설정/i });
			expect(settingsLink).toHaveAttribute("data-active", "true");
		});

		it("/my/dashboard 경로에서 설정은 비활성화된다", () => {
			// Arrange & Act
			renderWithProviders(<AppSidebar />, { route: "/my/dashboard" });

			// Assert
			const settingsLink = screen.getByRole("link", { name: /설정/i });
			expect(settingsLink).toHaveAttribute("data-active", "false");
		});
	});

	describe("로그아웃 메뉴", () => {
		it("로그아웃 링크를 표시한다", () => {
			// Arrange & Act
			renderWithProviders(<AppSidebar />);

			// Assert
			expect(screen.getByText("로그아웃")).toBeInTheDocument();
		});

		it("로그아웃 링크가 /auth/signout으로 연결된다", () => {
			// Arrange & Act
			renderWithProviders(<AppSidebar />);

			// Assert
			const logoutLink = screen.getByRole("link", { name: /로그아웃/i });
			expect(logoutLink).toHaveAttribute("href", "/auth/signout");
		});
	});
});
