import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import FooterSection from "~/presentation/components/sections/footer-section";

// 래퍼 컴포넌트 (MemoryRouter 포함)
const renderWithRouter = (ui: React.ReactElement) => {
	return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe("FooterSection", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("기본 렌더링", () => {
		it("footer 요소를 렌더링한다", () => {
			// Arrange & Act
			renderWithRouter(<FooterSection />);

			// Assert
			expect(screen.getByRole("contentinfo")).toBeInTheDocument();
		});
	});

	describe("저작권", () => {
		it("저작권 텍스트를 표시한다", () => {
			// Arrange & Act
			renderWithRouter(<FooterSection />);

			// Assert
			expect(
				screen.getByText(/Claude RR7 Starterkit\. All rights reserved\./i),
			).toBeInTheDocument();
		});

		it("현재 연도를 표시한다", () => {
			// Arrange
			const currentYear = new Date().getFullYear();

			// Act
			renderWithRouter(<FooterSection />);

			// Assert
			expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeInTheDocument();
		});
	});

	describe("링크", () => {
		it("개인정보처리방침 링크를 표시한다", () => {
			// Arrange & Act
			renderWithRouter(<FooterSection />);

			// Assert
			const link = screen.getByRole("link", { name: /개인정보처리방침/i });
			expect(link).toBeInTheDocument();
			expect(link).toHaveAttribute("href", "/privacy-policy");
		});

		it("이용약관 링크를 표시한다", () => {
			// Arrange & Act
			renderWithRouter(<FooterSection />);

			// Assert
			const link = screen.getByRole("link", { name: /이용약관/i });
			expect(link).toBeInTheDocument();
			expect(link).toHaveAttribute("href", "/terms");
		});

		it("고객지원 링크를 표시한다", () => {
			// Arrange & Act
			renderWithRouter(<FooterSection />);

			// Assert
			const link = screen.getByRole("link", { name: /고객지원/i });
			expect(link).toBeInTheDocument();
			expect(link).toHaveAttribute("href", "/support");
		});

		it("사용법 링크를 표시한다", () => {
			// Arrange & Act
			renderWithRouter(<FooterSection />);

			// Assert
			const link = screen.getByRole("link", { name: /사용법/i });
			expect(link).toBeInTheDocument();
			expect(link).toHaveAttribute("href", "/usage");
		});

		it("네비게이션 영역이 존재한다", () => {
			// Arrange & Act
			renderWithRouter(<FooterSection />);

			// Assert
			expect(screen.getByRole("navigation")).toBeInTheDocument();
		});
	});
});
