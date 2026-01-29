import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useIsMobile } from "~/presentation/hooks/use-mobile";

// useMediaQuery 모킹
vi.mock("usehooks-ts", () => ({
	useMediaQuery: vi.fn(),
}));

import { useMediaQuery } from "usehooks-ts";

describe("useIsMobile", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("브레이크포인트 감지", () => {
		it("모바일 화면 (768px 미만)에서 true를 반환한다", () => {
			// Arrange
			vi.mocked(useMediaQuery).mockReturnValue(true);

			// Act
			const { result } = renderHook(() => useIsMobile());

			// Assert
			expect(result.current).toBe(true);
			expect(useMediaQuery).toHaveBeenCalledWith("(max-width: 767px)");
		});

		it("데스크탑 화면 (768px 이상)에서 false를 반환한다", () => {
			// Arrange
			vi.mocked(useMediaQuery).mockReturnValue(false);

			// Act
			const { result } = renderHook(() => useIsMobile());

			// Assert
			expect(result.current).toBe(false);
			expect(useMediaQuery).toHaveBeenCalledWith("(max-width: 767px)");
		});
	});

	describe("미디어 쿼리", () => {
		it("767px (MOBILE_BREAKPOINT - 1) max-width로 미디어 쿼리를 호출한다", () => {
			// Arrange
			vi.mocked(useMediaQuery).mockReturnValue(false);

			// Act
			renderHook(() => useIsMobile());

			// Assert
			expect(useMediaQuery).toHaveBeenCalledWith("(max-width: 767px)");
		});
	});
});
