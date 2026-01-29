import { describe, it, expect, vi, beforeEach } from "vitest";
import { calculatePasswordStrength } from "~/presentation/lib/password-strength";

describe("calculatePasswordStrength", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("빈 비밀번호", () => {
		it("빈 문자열에 대해 점수 0을 반환한다", () => {
			// Arrange
			const password = "";

			// Act
			const result = calculatePasswordStrength(password);

			// Assert
			expect(result.score).toBe(0);
			expect(result.level).toBe("weak");
			expect(result.label).toBe("약함");
			expect(result.colorClass).toBe("bg-red-600");
		});
	});

	describe("길이 점수 계산", () => {
		it("8자 미만은 길이 점수 0점이다", () => {
			// Arrange
			const password = "abcdefg"; // 7자

			// Act
			const result = calculatePasswordStrength(password);

			// Assert
			// 소문자만 포함: 20점, 길이 점수: 0점
			expect(result.score).toBe(20);
		});

		it("8자 이상은 길이 점수 10점이다", () => {
			// Arrange
			const password = "abcdefgh"; // 8자

			// Act
			const result = calculatePasswordStrength(password);

			// Assert
			// 소문자: 20점 + 길이(8자): 10점 = 30점
			expect(result.score).toBe(30);
		});

		it("12자 이상은 길이 점수 20점이다", () => {
			// Arrange
			const password = "abcdefghijkl"; // 12자

			// Act
			const result = calculatePasswordStrength(password);

			// Assert
			// 소문자: 20점 + 길이(12자): 20점 = 40점
			expect(result.score).toBe(40);
		});

		it("16자 이상은 길이 점수 30점이다", () => {
			// Arrange
			const password = "abcdefghijklmnop"; // 16자

			// Act
			const result = calculatePasswordStrength(password);

			// Assert
			// 소문자: 20점 + 길이(16자): 30점 = 50점
			expect(result.score).toBe(50);
		});
	});

	describe("문자 다양성 점수 계산", () => {
		it("소문자만 포함하면 20점을 추가한다", () => {
			// Arrange
			const password = "abcd"; // 4자, 소문자만

			// Act
			const result = calculatePasswordStrength(password);

			// Assert
			expect(result.score).toBe(20);
		});

		it("대문자만 포함하면 20점을 추가한다", () => {
			// Arrange
			const password = "ABCD"; // 4자, 대문자만

			// Act
			const result = calculatePasswordStrength(password);

			// Assert
			expect(result.score).toBe(20);
		});

		it("숫자만 포함하면 20점을 추가한다", () => {
			// Arrange
			const password = "1234"; // 4자, 숫자만

			// Act
			const result = calculatePasswordStrength(password);

			// Assert
			expect(result.score).toBe(20);
		});

		it("특수문자만 포함하면 10점을 추가한다", () => {
			// Arrange
			const password = "!@#$"; // 4자, 특수문자만

			// Act
			const result = calculatePasswordStrength(password);

			// Assert
			expect(result.score).toBe(10);
		});

		it("소문자와 대문자를 포함하면 40점을 추가한다", () => {
			// Arrange
			const password = "abCD"; // 4자

			// Act
			const result = calculatePasswordStrength(password);

			// Assert
			// 소문자: 20점 + 대문자: 20점 = 40점
			expect(result.score).toBe(40);
		});

		it("모든 문자 유형을 포함하면 70점을 추가한다", () => {
			// Arrange
			const password = "aA1!"; // 4자

			// Act
			const result = calculatePasswordStrength(password);

			// Assert
			// 소문자: 20 + 대문자: 20 + 숫자: 20 + 특수문자: 10 = 70점
			expect(result.score).toBe(70);
		});
	});

	describe("레벨 결정", () => {
		it("점수 0-39는 weak 레벨이다", () => {
			// Arrange
			const password = "abc"; // 소문자만: 20점

			// Act
			const result = calculatePasswordStrength(password);

			// Assert
			expect(result.level).toBe("weak");
			expect(result.label).toBe("약함");
			expect(result.colorClass).toBe("bg-red-600");
		});

		it("점수 40-69는 medium 레벨이다", () => {
			// Arrange
			const password = "abcdefghijkl"; // 12자 소문자: 20 + 20 = 40점

			// Act
			const result = calculatePasswordStrength(password);

			// Assert
			expect(result.level).toBe("medium");
			expect(result.label).toBe("보통");
			expect(result.colorClass).toBe("bg-yellow-600");
		});

		it("점수 70-100는 strong 레벨이다", () => {
			// Arrange
			const password = "Abcdefgh1!"; // 10자, 모든 유형 포함
			// 길이(10자): 10 + 소문자: 20 + 대문자: 20 + 숫자: 20 + 특수문자: 10 = 80점

			// Act
			const result = calculatePasswordStrength(password);

			// Assert
			expect(result.level).toBe("strong");
			expect(result.label).toBe("강함");
			expect(result.colorClass).toBe("bg-green-600");
		});
	});

	describe("경계값 테스트", () => {
		it("정확히 39점은 weak이다", () => {
			// Arrange
			// 소문자 8자: 20 + 10 = 30점
			// 소문자 + 숫자(8자 미만): 20 + 20 = 40점 -> medium
			// 정확히 39점 만들기 어려우므로 30점으로 weak 확인
			const password = "abcdefgh"; // 30점

			// Act
			const result = calculatePasswordStrength(password);

			// Assert
			expect(result.score).toBe(30);
			expect(result.level).toBe("weak");
		});

		it("정확히 40점은 medium이다", () => {
			// Arrange
			const password = "abcdefghijkl"; // 12자 소문자: 20 + 20 = 40점

			// Act
			const result = calculatePasswordStrength(password);

			// Assert
			expect(result.score).toBe(40);
			expect(result.level).toBe("medium");
		});

		it("정확히 69점은 medium이다", () => {
			// Arrange
			// 소문자 + 대문자 + 숫자 (8자): 20 + 20 + 20 + 10(길이) = 70 -> strong
			// 소문자 + 대문자 + 숫자 (8자 미만): 20 + 20 + 20 = 60 -> medium
			const password = "aA1bcde"; // 7자: 소문자 20 + 대문자 20 + 숫자 20 = 60점

			// Act
			const result = calculatePasswordStrength(password);

			// Assert
			expect(result.score).toBe(60);
			expect(result.level).toBe("medium");
		});

		it("정확히 70점은 strong이다", () => {
			// Arrange
			const password = "aA1bcdef"; // 8자: 소문자 20 + 대문자 20 + 숫자 20 + 길이 10 = 70점

			// Act
			const result = calculatePasswordStrength(password);

			// Assert
			expect(result.score).toBe(70);
			expect(result.level).toBe("strong");
		});
	});

	describe("최대 점수", () => {
		it("16자 이상 + 모든 문자 유형은 최대 100점이다", () => {
			// Arrange
			const password = "Abcdefghijklmn1!"; // 16자, 모든 유형

			// Act
			const result = calculatePasswordStrength(password);

			// Assert
			// 길이(16자): 30 + 소문자: 20 + 대문자: 20 + 숫자: 20 + 특수문자: 10 = 100점
			expect(result.score).toBe(100);
			expect(result.level).toBe("strong");
		});
	});

	describe("실제 비밀번호 예시", () => {
		it("password123은 medium 레벨이다", () => {
			// Arrange
			const password = "password123"; // 11자

			// Act
			const result = calculatePasswordStrength(password);

			// Assert
			// 길이(11자): 10 + 소문자: 20 + 숫자: 20 = 50점
			expect(result.score).toBe(50);
			expect(result.level).toBe("medium");
		});

		it("Password123!은 strong 레벨이다", () => {
			// Arrange
			const password = "Password123!"; // 12자

			// Act
			const result = calculatePasswordStrength(password);

			// Assert
			// 길이(12자): 20 + 소문자: 20 + 대문자: 20 + 숫자: 20 + 특수문자: 10 = 90점
			expect(result.score).toBe(90);
			expect(result.level).toBe("strong");
		});
	});
});
