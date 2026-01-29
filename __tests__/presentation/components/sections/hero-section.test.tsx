import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import HeroSection from "~/presentation/components/sections/hero-section";

// 래퍼 컴포넌트 (MemoryRouter 포함)
const renderWithRouter = (ui: React.ReactElement) => {
	return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe("HeroSection", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("기본 렌더링", () => {
		it("메인 타이틀을 렌더링한다", () => {
			// Arrange & Act
			renderWithRouter(<HeroSection />);

			// Assert
			expect(screen.getByText(/빠르고 현대적인/i)).toBeInTheDocument();
			expect(screen.getByText(/풀스택 웹 개발/i)).toBeInTheDocument();
		});

		it("서브타이틀을 렌더링한다", () => {
			// Arrange & Act
			renderWithRouter(<HeroSection />);

			// Assert
			expect(
				screen.getByText(/프로덕션 레디 스타터킷으로/i),
			).toBeInTheDocument();
		});

		it("기술 스택 배지를 렌더링한다", () => {
			// Arrange & Act
			renderWithRouter(<HeroSection />);

			// Assert
			expect(
				screen.getByText(/React Router v7 \+ Supabase \+ Drizzle ORM/i),
			).toBeInTheDocument();
		});
	});

	describe("CTA 버튼", () => {
		it("시작하기 버튼을 표시한다", () => {
			// Arrange & Act
			renderWithRouter(<HeroSection />);

			// Assert
			expect(screen.getByRole("link", { name: /시작하기/i })).toBeInTheDocument();
		});

		it("로그인 버튼을 표시한다", () => {
			// Arrange & Act
			renderWithRouter(<HeroSection />);

			// Assert
			expect(screen.getByRole("link", { name: /로그인/i })).toBeInTheDocument();
		});

		it("시작하기 링크가 /auth/signup으로 연결된다", () => {
			// Arrange & Act
			renderWithRouter(<HeroSection />);

			// Assert
			const signupLink = screen.getByRole("link", { name: /시작하기/i });
			expect(signupLink).toHaveAttribute("href", "/auth/signup");
		});

		it("로그인 링크가 /auth/signin으로 연결된다", () => {
			// Arrange & Act
			renderWithRouter(<HeroSection />);

			// Assert
			const signinLink = screen.getByRole("link", { name: /로그인/i });
			expect(signinLink).toHaveAttribute("href", "/auth/signin");
		});
	});

	describe("기술 스택 태그", () => {
		it("TypeScript 태그를 표시한다", () => {
			// Arrange & Act
			renderWithRouter(<HeroSection />);

			// Assert
			expect(screen.getByText("TypeScript")).toBeInTheDocument();
		});

		it("React 19 태그를 표시한다", () => {
			// Arrange & Act
			renderWithRouter(<HeroSection />);

			// Assert
			expect(screen.getByText("React 19")).toBeInTheDocument();
		});

		it("Tailwind CSS v4 태그를 표시한다", () => {
			// Arrange & Act
			renderWithRouter(<HeroSection />);

			// Assert
			expect(screen.getByText("Tailwind CSS v4")).toBeInTheDocument();
		});

		it("shadcn/ui v3 태그를 표시한다", () => {
			// Arrange & Act
			renderWithRouter(<HeroSection />);

			// Assert
			expect(screen.getByText("shadcn/ui v3")).toBeInTheDocument();
		});

		it("Cloudflare Workers 태그를 표시한다", () => {
			// Arrange & Act
			renderWithRouter(<HeroSection />);

			// Assert
			expect(screen.getByText("Cloudflare Workers")).toBeInTheDocument();
		});
	});
});
