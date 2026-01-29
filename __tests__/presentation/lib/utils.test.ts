import { describe, it, expect } from "vitest";
import { cn } from "~/presentation/lib/utils";

describe("cn", () => {
	describe("기본 동작", () => {
		it("단일 클래스명을 반환한다", () => {
			// Arrange & Act
			const result = cn("px-4");

			// Assert
			expect(result).toBe("px-4");
		});

		it("여러 클래스명을 공백으로 병합한다", () => {
			// Arrange & Act
			const result = cn("px-4", "py-2", "bg-white");

			// Assert
			expect(result).toBe("px-4 py-2 bg-white");
		});

		it("빈 입력에 대해 빈 문자열을 반환한다", () => {
			// Arrange & Act
			const result = cn();

			// Assert
			expect(result).toBe("");
		});
	});

	describe("조건부 클래스", () => {
		it("true 조건의 클래스만 포함한다", () => {
			// Arrange
			const isActive = true;
			const isDisabled = false;

			// Act
			const result = cn("base", isActive && "active", isDisabled && "disabled");

			// Assert
			expect(result).toBe("base active");
		});

		it("객체 형태의 조건부 클래스를 처리한다", () => {
			// Arrange & Act
			const result = cn("base", {
				active: true,
				disabled: false,
				highlighted: true,
			});

			// Assert
			expect(result).toBe("base active highlighted");
		});

		it("undefined와 null 값을 무시한다", () => {
			// Arrange & Act
			const result = cn("base", undefined, null, "end");

			// Assert
			expect(result).toBe("base end");
		});
	});

	describe("Tailwind 클래스 병합", () => {
		it("충돌하는 padding 클래스를 마지막 값으로 병합한다", () => {
			// Arrange & Act
			const result = cn("px-4", "px-6");

			// Assert
			expect(result).toBe("px-6");
		});

		it("충돌하는 margin 클래스를 마지막 값으로 병합한다", () => {
			// Arrange & Act
			const result = cn("mt-2", "mt-4");

			// Assert
			expect(result).toBe("mt-4");
		});

		it("충돌하는 배경색 클래스를 마지막 값으로 병합한다", () => {
			// Arrange & Act
			const result = cn("bg-red-500", "bg-blue-500");

			// Assert
			expect(result).toBe("bg-blue-500");
		});

		it("충돌하는 텍스트 색상 클래스를 마지막 값으로 병합한다", () => {
			// Arrange & Act
			const result = cn("text-red-500", "text-blue-500");

			// Assert
			expect(result).toBe("text-blue-500");
		});

		it("서로 다른 속성의 클래스는 모두 유지한다", () => {
			// Arrange & Act
			const result = cn("px-4", "py-2", "bg-white", "text-black");

			// Assert
			expect(result).toBe("px-4 py-2 bg-white text-black");
		});

		it("반응형 접두사가 있는 클래스를 올바르게 병합한다", () => {
			// Arrange & Act
			const result = cn("md:px-4", "md:px-6");

			// Assert
			expect(result).toBe("md:px-6");
		});

		it("hover 상태 클래스를 올바르게 병합한다", () => {
			// Arrange & Act
			const result = cn("hover:bg-red-500", "hover:bg-blue-500");

			// Assert
			expect(result).toBe("hover:bg-blue-500");
		});
	});

	describe("배열 입력", () => {
		it("배열 형태의 클래스를 처리한다", () => {
			// Arrange & Act
			const result = cn(["px-4", "py-2"]);

			// Assert
			expect(result).toBe("px-4 py-2");
		});

		it("중첩 배열을 처리한다", () => {
			// Arrange & Act
			const result = cn(["px-4", ["py-2", "bg-white"]]);

			// Assert
			expect(result).toBe("px-4 py-2 bg-white");
		});
	});
});
