import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import FeaturesSection from "~/presentation/components/sections/features-section";

describe("FeaturesSection", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("기본 렌더링", () => {
		it("섹션 제목을 렌더링한다", () => {
			// Arrange & Act
			render(<FeaturesSection />);

			// Assert
			expect(
				screen.getByRole("heading", { name: /포함된 주요 기능/i }),
			).toBeInTheDocument();
		});

		it("섹션 설명을 렌더링한다", () => {
			// Arrange & Act
			render(<FeaturesSection />);

			// Assert
			expect(
				screen.getByText(/프로덕션 레디 기능들이 이미 구현되어 있습니다/i),
			).toBeInTheDocument();
		});
	});

	describe("기능 카드", () => {
		it("Supabase 인증 카드를 표시한다", () => {
			// Arrange & Act
			render(<FeaturesSection />);

			// Assert
			expect(screen.getByText("Supabase 인증")).toBeInTheDocument();
			expect(
				screen.getByText(/이메일 기반 회원가입/i),
			).toBeInTheDocument();
		});

		it("대시보드 카드를 표시한다", () => {
			// Arrange & Act
			render(<FeaturesSection />);

			// Assert
			expect(screen.getByText("대시보드")).toBeInTheDocument();
			expect(
				screen.getByText(/인증된 사용자를 위한 대시보드/i),
			).toBeInTheDocument();
		});

		it("설정 페이지 카드를 표시한다", () => {
			// Arrange & Act
			render(<FeaturesSection />);

			// Assert
			expect(screen.getByText("설정 페이지")).toBeInTheDocument();
			expect(
				screen.getByText(/프로필 설정, 이메일 변경/i),
			).toBeInTheDocument();
		});

		it("Drizzle ORM 카드를 표시한다", () => {
			// Arrange & Act
			render(<FeaturesSection />);

			// Assert
			expect(screen.getByText("Drizzle ORM")).toBeInTheDocument();
			expect(
				screen.getByText(/타입 안전한 데이터베이스 ORM/i),
			).toBeInTheDocument();
		});

		it("4개의 기능 카드가 모두 표시된다", () => {
			// Arrange & Act
			render(<FeaturesSection />);

			// Assert
			const titles = [
				"Supabase 인증",
				"대시보드",
				"설정 페이지",
				"Drizzle ORM",
			];
			for (const title of titles) {
				expect(screen.getByText(title)).toBeInTheDocument();
			}
		});
	});
});
