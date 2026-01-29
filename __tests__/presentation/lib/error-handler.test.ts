import { describe, it, expect, vi, beforeEach } from "vitest";
import { BASE_ERROR_CODES } from "@better-auth/core/error";
import { getAuthErrorMessage } from "~/presentation/lib/error-handler";

describe("getAuthErrorMessage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("Error 객체가 아닌 경우", () => {
		it("문자열 에러에 대해 기본 메시지를 반환한다", () => {
			// Arrange
			const error = "string error";

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("처리 중 오류가 발생했습니다.");
		});

		it("null에 대해 기본 메시지를 반환한다", () => {
			// Arrange
			const error = null;

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("처리 중 오류가 발생했습니다.");
		});

		it("undefined에 대해 기본 메시지를 반환한다", () => {
			// Arrange
			const error = undefined;

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("처리 중 오류가 발생했습니다.");
		});

		it("커스텀 기본 메시지를 반환한다", () => {
			// Arrange
			const error = "not an error object";
			const defaultMessage = "커스텀 에러 메시지";

			// Act
			const result = getAuthErrorMessage(error, defaultMessage);

			// Assert
			expect(result).toBe("커스텀 에러 메시지");
		});
	});

	describe("Better-auth 에러 코드 매칭", () => {
		it("INVALID_EMAIL_OR_PASSWORD 에러를 한글 메시지로 변환한다", () => {
			// Arrange
			const error = new Error(BASE_ERROR_CODES.INVALID_EMAIL_OR_PASSWORD);

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("이메일 또는 비밀번호가 올바르지 않습니다.");
		});

		it("EMAIL_NOT_VERIFIED 에러를 한글 메시지로 변환한다", () => {
			// Arrange
			const error = new Error(BASE_ERROR_CODES.EMAIL_NOT_VERIFIED);

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("이메일 인증을 완료해주세요.");
		});

		it("USER_NOT_FOUND 에러를 한글 메시지로 변환한다", () => {
			// Arrange
			const error = new Error(BASE_ERROR_CODES.USER_NOT_FOUND);

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("사용자를 찾을 수 없습니다.");
		});

		it("INVALID_PASSWORD 에러를 한글 메시지로 변환한다", () => {
			// Arrange
			const error = new Error(BASE_ERROR_CODES.INVALID_PASSWORD);

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("비밀번호가 올바르지 않습니다.");
		});

		it("INVALID_EMAIL 에러를 한글 메시지로 변환한다", () => {
			// Arrange
			const error = new Error(BASE_ERROR_CODES.INVALID_EMAIL);

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("올바르지 않은 이메일 형식입니다.");
		});

		it("INVALID_TOKEN 에러를 한글 메시지로 변환한다", () => {
			// Arrange
			const error = new Error(BASE_ERROR_CODES.INVALID_TOKEN);

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("유효하지 않거나 만료된 링크입니다.");
		});

		it("SESSION_EXPIRED 에러를 한글 메시지로 변환한다", () => {
			// Arrange
			const error = new Error(BASE_ERROR_CODES.SESSION_EXPIRED);

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("세션이 만료되었습니다. 다시 로그인해주세요.");
		});

		it("USER_ALREADY_EXISTS 에러를 한글 메시지로 변환한다", () => {
			// Arrange
			const error = new Error(BASE_ERROR_CODES.USER_ALREADY_EXISTS);

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("이미 등록된 이메일입니다.");
		});

		it("PASSWORD_TOO_SHORT 에러를 한글 메시지로 변환한다", () => {
			// Arrange
			const error = new Error(BASE_ERROR_CODES.PASSWORD_TOO_SHORT);

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("비밀번호가 너무 짧습니다.");
		});

		it("PASSWORD_TOO_LONG 에러를 한글 메시지로 변환한다", () => {
			// Arrange
			const error = new Error(BASE_ERROR_CODES.PASSWORD_TOO_LONG);

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("비밀번호가 너무 깁니다.");
		});
	});

	describe("OAuth 에러 코드 매칭", () => {
		it("state_not_found 에러를 한글 메시지로 변환한다", () => {
			// Arrange
			const error = new Error("state_not_found");

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("OAuth 인증 세션이 만료되었습니다. 다시 시도해주세요.");
		});

		it("state_mismatch 에러를 한글 메시지로 변환한다", () => {
			// Arrange
			const error = new Error("state_mismatch");

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe(
				"OAuth 인증 상태가 일치하지 않습니다. 다시 시도해주세요.",
			);
		});

		it("invalid_state 에러를 한글 메시지로 변환한다", () => {
			// Arrange
			const error = new Error("invalid_state");

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("유효하지 않은 인증 상태입니다. 다시 시도해주세요.");
		});

		it("oauth_error 에러를 한글 메시지로 변환한다", () => {
			// Arrange
			const error = new Error("oauth_error occurred");

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("OAuth 인증 중 오류가 발생했습니다.");
		});

		it("access_denied 에러를 한글 메시지로 변환한다", () => {
			// Arrange
			const error = new Error("access_denied by user");

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("접근이 거부되었습니다.");
		});

		it("server_error 에러를 한글 메시지로 변환한다", () => {
			// Arrange
			const error = new Error("server_error");

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
		});

		it("언더스코어가 공백으로 대체된 에러 메시지도 매칭한다", () => {
			// Arrange
			const error = new Error("state not found in session");

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("OAuth 인증 세션이 만료되었습니다. 다시 시도해주세요.");
		});
	});

	describe("매칭되지 않는 에러", () => {
		it("알 수 없는 에러 메시지에 대해 기본 메시지를 반환한다", () => {
			// Arrange
			const error = new Error("Unknown error occurred");

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("처리 중 오류가 발생했습니다.");
		});

		it("알 수 없는 에러에 대해 커스텀 기본 메시지를 반환한다", () => {
			// Arrange
			const error = new Error("Unknown error");
			const defaultMessage = "로그인에 실패했습니다.";

			// Act
			const result = getAuthErrorMessage(error, defaultMessage);

			// Assert
			expect(result).toBe("로그인에 실패했습니다.");
		});
	});
});
