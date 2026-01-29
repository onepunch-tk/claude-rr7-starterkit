import { describe, it, expect, vi, beforeEach } from "vitest";
import { z } from "zod";
import { parseFormData, validateFormData } from "~/presentation/lib/form-helpers";

describe("parseFormData", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("기본 변환", () => {
		it("FormData를 객체로 변환한다", () => {
			// Arrange
			const formData = new FormData();
			formData.append("email", "test@example.com");
			formData.append("password", "password123");

			// Act
			const result = parseFormData(formData);

			// Assert
			expect(result).toEqual({
				email: "test@example.com",
				password: "password123",
			});
		});

		it("빈 FormData를 빈 객체로 변환한다", () => {
			// Arrange
			const formData = new FormData();

			// Act
			const result = parseFormData(formData);

			// Assert
			expect(result).toEqual({});
		});

		it("빈 문자열 값을 유지한다", () => {
			// Arrange
			const formData = new FormData();
			formData.append("name", "");

			// Act
			const result = parseFormData(formData);

			// Assert
			expect(result).toEqual({ name: "" });
		});
	});

	describe("checkbox 처리", () => {
		it("'on' 값을 true로 변환한다", () => {
			// Arrange
			const formData = new FormData();
			formData.append("rememberMe", "on");

			// Act
			const result = parseFormData(formData);

			// Assert
			expect(result).toEqual({ rememberMe: true });
		});

		it("일반 문자열 값은 그대로 유지한다", () => {
			// Arrange
			const formData = new FormData();
			formData.append("status", "active");

			// Act
			const result = parseFormData(formData);

			// Assert
			expect(result).toEqual({ status: "active" });
		});

		it("여러 checkbox와 일반 필드를 함께 처리한다", () => {
			// Arrange
			const formData = new FormData();
			formData.append("email", "test@example.com");
			formData.append("newsletter", "on");
			formData.append("terms", "on");

			// Act
			const result = parseFormData(formData);

			// Assert
			expect(result).toEqual({
				email: "test@example.com",
				newsletter: true,
				terms: true,
			});
		});
	});

	describe("다양한 데이터 타입", () => {
		it("숫자 문자열을 문자열로 유지한다", () => {
			// Arrange
			const formData = new FormData();
			formData.append("age", "25");

			// Act
			const result = parseFormData(formData);

			// Assert
			expect(result).toEqual({ age: "25" });
			expect(typeof result.age).toBe("string");
		});
	});
});

describe("validateFormData", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("유효한 데이터", () => {
		it("스키마에 맞는 데이터를 성공으로 반환한다", () => {
			// Arrange
			const schema = z.object({
				email: z.string().email(),
				password: z.string().min(8),
			});
			const formData = new FormData();
			formData.append("email", "test@example.com");
			formData.append("password", "password123");

			// Act
			const result = validateFormData(schema, formData);

			// Assert
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toEqual({
					email: "test@example.com",
					password: "password123",
				});
			}
		});

		it("checkbox 값을 boolean으로 검증한다", () => {
			// Arrange
			const schema = z.object({
				terms: z.boolean(),
			});
			const formData = new FormData();
			formData.append("terms", "on");

			// Act
			const result = validateFormData(schema, formData);

			// Assert
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toEqual({ terms: true });
			}
		});

		it("선택적 필드가 없어도 성공한다", () => {
			// Arrange
			const schema = z.object({
				email: z.string().email(),
				nickname: z.string().optional(),
			});
			const formData = new FormData();
			formData.append("email", "test@example.com");

			// Act
			const result = validateFormData(schema, formData);

			// Assert
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toEqual({ email: "test@example.com" });
			}
		});
	});

	describe("유효하지 않은 데이터", () => {
		it("잘못된 이메일 형식에 대해 에러를 반환한다", () => {
			// Arrange
			const schema = z.object({
				email: z.string().email(),
			});
			const formData = new FormData();
			formData.append("email", "invalid-email");

			// Act
			const result = validateFormData(schema, formData);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.errors).toBeDefined();
			}
		});

		it("최소 길이 미달 시 에러를 반환한다", () => {
			// Arrange
			const schema = z.object({
				password: z.string().min(8),
			});
			const formData = new FormData();
			formData.append("password", "short");

			// Act
			const result = validateFormData(schema, formData);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.errors).toBeDefined();
			}
		});

		it("필수 필드가 없으면 에러를 반환한다", () => {
			// Arrange
			const schema = z.object({
				email: z.string().email(),
				password: z.string().min(8),
			});
			const formData = new FormData();
			formData.append("email", "test@example.com");
			// password 누락

			// Act
			const result = validateFormData(schema, formData);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.errors).toBeDefined();
			}
		});

		it("여러 필드 에러를 포함한 응답을 반환한다", () => {
			// Arrange
			const schema = z.object({
				email: z.string().email(),
				password: z.string().min(8),
			});
			const formData = new FormData();
			formData.append("email", "invalid");
			formData.append("password", "short");

			// Act
			const result = validateFormData(schema, formData);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.errors).toBeDefined();
			}
		});
	});

	describe("타입 변환", () => {
		it("coerce를 사용하여 숫자로 변환한다", () => {
			// Arrange
			const schema = z.object({
				age: z.coerce.number().min(0),
			});
			const formData = new FormData();
			formData.append("age", "25");

			// Act
			const result = validateFormData(schema, formData);

			// Assert
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toEqual({ age: 25 });
				expect(typeof result.data.age).toBe("number");
			}
		});
	});
});
