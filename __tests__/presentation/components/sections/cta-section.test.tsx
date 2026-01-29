import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CtaSection from "~/presentation/components/sections/cta-section";

// toast 모킹
vi.mock("sonner", () => ({
	toast: {
		success: vi.fn(),
	},
}));

import { toast } from "sonner";

describe("CtaSection", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// navigator.clipboard 모킹
		Object.assign(navigator, {
			clipboard: {
				writeText: vi.fn().mockResolvedValue(undefined),
			},
		});
	});

	describe("기본 렌더링", () => {
		it("제목을 렌더링한다", () => {
			// Arrange & Act
			render(<CtaSection />);

			// Assert
			expect(screen.getByText(/지금 바로 시작하세요/i)).toBeInTheDocument();
		});

		it("설명을 렌더링한다", () => {
			// Arrange & Act
			render(<CtaSection />);

			// Assert
			expect(
				screen.getByText(/단 하나의 명령어로 프로젝트를 시작/i),
			).toBeInTheDocument();
		});

		it("git clone 명령어를 표시한다", () => {
			// Arrange & Act
			render(<CtaSection />);

			// Assert
			expect(
				screen.getByText(
					/git clone https:\/\/github.com\/onepunch-tk\/claude-rr7-starterkit.git/i,
				),
			).toBeInTheDocument();
		});
	});

	describe("클립보드 복사", () => {
		it("복사 버튼이 존재한다", () => {
			// Arrange & Act
			render(<CtaSection />);

			// Assert
			expect(
				screen.getByRole("button", { name: /클립보드에 복사/i }),
			).toBeInTheDocument();
		});

		it("복사 버튼 클릭 시 클립보드에 복사한다", async () => {
			// Arrange
			render(<CtaSection />);

			// Act
			const copyButton = screen.getByRole("button", { name: /클립보드에 복사/i });
			fireEvent.click(copyButton);

			// Assert
			expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
				"git clone https://github.com/onepunch-tk/claude-rr7-starterkit.git",
			);
		});

		it("복사 성공 시 토스트 메시지를 표시한다", async () => {
			// Arrange
			render(<CtaSection />);

			// Act
			const copyButton = screen.getByRole("button", { name: /클립보드에 복사/i });
			fireEvent.click(copyButton);

			// Assert
			expect(toast.success).toHaveBeenCalledWith("클립보드에 복사되었습니다!");
		});
	});

	describe("빠른 시작 가이드", () => {
		it("빠른 시작 가이드 제목을 표시한다", () => {
			// Arrange & Act
			render(<CtaSection />);

			// Assert
			expect(screen.getByText("빠른 시작 가이드")).toBeInTheDocument();
		});

		it("1단계: 프로젝트 클론 안내를 표시한다", () => {
			// Arrange & Act
			render(<CtaSection />);

			// Assert
			expect(screen.getByText(/프로젝트를 클론합니다/i)).toBeInTheDocument();
		});

		it("2단계: bun install 안내를 표시한다", () => {
			// Arrange & Act
			render(<CtaSection />);

			// Assert
			expect(screen.getByText("bun install")).toBeInTheDocument();
		});

		it("3단계: bun run dev 안내를 표시한다", () => {
			// Arrange & Act
			render(<CtaSection />);

			// Assert
			expect(screen.getByText("bun run dev")).toBeInTheDocument();
		});
	});

	describe("외부 링크", () => {
		it("GitHub 링크를 표시한다", () => {
			// Arrange & Act
			render(<CtaSection />);

			// Assert
			const githubLink = screen.getByRole("link", { name: /GitHub에서 보기/i });
			expect(githubLink).toHaveAttribute(
				"href",
				"https://github.com/onepunch-tk/claude-rr7-starterkit",
			);
		});

		it("문서 링크를 표시한다", () => {
			// Arrange & Act
			render(<CtaSection />);

			// Assert
			const docsLink = screen.getByRole("link", { name: /문서 읽기/i });
			expect(docsLink).toHaveAttribute(
				"href",
				"https://github.com/onepunch-tk/claude-rr7-starterkit#readme",
			);
		});

		it("외부 링크가 새 탭에서 열린다", () => {
			// Arrange & Act
			render(<CtaSection />);

			// Assert
			const githubLink = screen.getByRole("link", { name: /GitHub에서 보기/i });
			expect(githubLink).toHaveAttribute("target", "_blank");
			expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
		});
	});
});
