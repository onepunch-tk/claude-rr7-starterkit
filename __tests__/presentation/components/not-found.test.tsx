import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { NotFound } from "~/presentation/components/not-found";

// 래퍼 컴포넌트 (MemoryRouter 포함)
const renderWithRouter = (ui: React.ReactElement) => {
	return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe("NotFound", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("기본 렌더링", () => {
		it("404 텍스트를 렌더링한다", () => {
			// Arrange & Act
			renderWithRouter(<NotFound />);

			// Assert
			expect(screen.getByText("404")).toBeInTheDocument();
		});

		it("페이지를 찾을 수 없습니다 제목을 표시한다", () => {
			// Arrange & Act
			renderWithRouter(<NotFound />);

			// Assert
			expect(
				screen.getByRole("heading", { name: /페이지를 찾을 수 없습니다/i }),
			).toBeInTheDocument();
		});

		it("안내 메시지를 표시한다", () => {
			// Arrange & Act
			renderWithRouter(<NotFound />);

			// Assert
			expect(
				screen.getByText(/요청하신 페이지가 삭제되었거나/i),
			).toBeInTheDocument();
		});
	});

	describe("홈으로 돌아가기 링크", () => {
		it("홈으로 돌아가기 링크를 표시한다", () => {
			// Arrange & Act
			renderWithRouter(<NotFound />);

			// Assert
			expect(
				screen.getByRole("link", { name: /홈으로 돌아가기/i }),
			).toBeInTheDocument();
		});

		it("홈으로 돌아가기 링크가 /로 연결된다", () => {
			// Arrange & Act
			renderWithRouter(<NotFound />);

			// Assert
			const homeLink = screen.getByRole("link", { name: /홈으로 돌아가기/i });
			expect(homeLink).toHaveAttribute("href", "/");
		});
	});

	describe("스타일 적용", () => {
		it("404 텍스트가 큰 글꼴로 표시된다", () => {
			// Arrange & Act
			renderWithRouter(<NotFound />);

			// Assert
			const notFoundText = screen.getByText("404");
			expect(notFoundText).toHaveClass("text-9xl");
		});

		it("컨테이너가 중앙 정렬된다", () => {
			// Arrange & Act
			const { container } = renderWithRouter(<NotFound />);

			// Assert
			const containerDiv = container.firstChild;
			expect(containerDiv).toHaveClass("flex", "items-center", "justify-center");
		});
	});
});
