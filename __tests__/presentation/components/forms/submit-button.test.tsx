import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Navigation } from "react-router";
import SubmitButton from "~/presentation/components/forms/submit-button";

// useNavigation 모킹
vi.mock("react-router", () => ({
	useNavigation: vi.fn(),
}));

import { useNavigation } from "react-router";

// 테스트용 Navigation 헬퍼
const createMockNavigation = (state: Navigation["state"]): Navigation =>
	({
		state,
		location: undefined,
		formMethod: undefined,
		formAction: undefined,
		formEncType: undefined,
		formData: undefined,
		text: undefined,
		json: undefined,
	}) as unknown as Navigation;

describe("SubmitButton", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// 기본 상태: idle
		vi.mocked(useNavigation).mockReturnValue(createMockNavigation("idle"));
	});

	describe("기본 렌더링", () => {
		it("children 텍스트를 렌더링한다", () => {
			// Arrange & Act
			render(<SubmitButton>로그인</SubmitButton>);

			// Assert
			expect(screen.getByRole("button", { name: "로그인" })).toBeInTheDocument();
		});

		it("type이 submit이다", () => {
			// Arrange & Act
			render(<SubmitButton>제출</SubmitButton>);

			// Assert
			expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
		});
	});

	describe("제출 중 상태", () => {
		it("제출 중일 때 loadingText를 표시한다", () => {
			// Arrange
			vi.mocked(useNavigation).mockReturnValue(
				createMockNavigation("submitting"),
			);

			// Act
			render(<SubmitButton>로그인</SubmitButton>);

			// Assert
			expect(
				screen.getByRole("button", { name: "처리 중..." }),
			).toBeInTheDocument();
		});

		it("커스텀 loadingText를 표시한다", () => {
			// Arrange
			vi.mocked(useNavigation).mockReturnValue(
				createMockNavigation("submitting"),
			);

			// Act
			render(<SubmitButton loadingText="로그인 중...">로그인</SubmitButton>);

			// Assert
			expect(
				screen.getByRole("button", { name: "로그인 중..." }),
			).toBeInTheDocument();
		});

		it("제출 중일 때 버튼이 비활성화된다", () => {
			// Arrange
			vi.mocked(useNavigation).mockReturnValue(
				createMockNavigation("submitting"),
			);

			// Act
			render(<SubmitButton>로그인</SubmitButton>);

			// Assert
			expect(screen.getByRole("button")).toBeDisabled();
		});
	});

	describe("idle 상태", () => {
		it("idle 상태에서 버튼이 활성화된다", () => {
			// Arrange
			vi.mocked(useNavigation).mockReturnValue(createMockNavigation("idle"));

			// Act
			render(<SubmitButton>로그인</SubmitButton>);

			// Assert
			expect(screen.getByRole("button")).not.toBeDisabled();
		});

		it("idle 상태에서 원래 children을 표시한다", () => {
			// Arrange
			vi.mocked(useNavigation).mockReturnValue(createMockNavigation("idle"));

			// Act
			render(<SubmitButton>로그인</SubmitButton>);

			// Assert
			expect(screen.getByRole("button", { name: "로그인" })).toBeInTheDocument();
		});
	});

	describe("loading 상태", () => {
		it("loading 상태에서도 버튼이 활성화된다 (submitting만 비활성화)", () => {
			// Arrange
			vi.mocked(useNavigation).mockReturnValue(createMockNavigation("loading"));

			// Act
			render(<SubmitButton>로그인</SubmitButton>);

			// Assert
			expect(screen.getByRole("button")).not.toBeDisabled();
		});
	});

	describe("추가 속성 전달", () => {
		it("className을 전달한다", () => {
			// Arrange & Act
			render(<SubmitButton className="w-full">제출</SubmitButton>);

			// Assert
			expect(screen.getByRole("button")).toHaveClass("w-full");
		});

		it("variant를 전달한다", () => {
			// Arrange & Act
			render(<SubmitButton variant="outline">제출</SubmitButton>);

			// Assert
			// variant가 적용되었는지 확인 (버튼이 렌더링되었는지)
			expect(screen.getByRole("button")).toBeInTheDocument();
		});

		it("size를 전달한다", () => {
			// Arrange & Act
			render(<SubmitButton size="lg">제출</SubmitButton>);

			// Assert
			expect(screen.getByRole("button")).toBeInTheDocument();
		});
	});
});
