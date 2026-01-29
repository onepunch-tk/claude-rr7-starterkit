import { describe, it, expect, vi, beforeEach } from "vitest";
import { EmailSendError, EmailServiceNotConfiguredError } from "~/domain/auth";
import type { SendEmailOptions } from "~/application/shared/email.port";
import { createElement } from "react";

/**
 * infrastructure/external/resend/email.service.impl.ts 유닛 테스트
 *
 * 테스트 대상: createEmailServiceImpl 함수
 * - send: 이메일 전송
 * - sendVerificationEmail: 이메일 인증 링크 전송
 * - sendPasswordResetEmail: 비밀번호 재설정 링크 전송
 *
 * Mock 전략: Resend 클라이언트를 Mock하여 API 호출을 시뮬레이션
 */

// Resend Mock - 클래스 형태로 Mock
const mockSend = vi.fn();

class MockResend {
	emails = {
		send: mockSend,
	};
}

vi.mock("resend", () => ({
	Resend: MockResend,
}));

// Email 컴포넌트 Mock
vi.mock("~/presentation/components/email/verification-email", () => ({
	default: vi.fn(() => createElement("div", null, "Verification Email")),
}));

vi.mock("~/presentation/components/email/password-reset-email", () => ({
	default: vi.fn(() => createElement("div", null, "Password Reset Email")),
}));

describe("infrastructure/external/resend/email.service.impl", () => {
	const validApiKey = "re_test_api_key";
	const validFromEmail = "noreply@example.com";

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("createEmailServiceImpl", () => {
		it("EmailService 객체를 생성한다", async () => {
			// Arrange
			const { createEmailServiceImpl } = await import(
				"~/infrastructure/external/resend/email.service.impl"
			);

			// Act
			const emailService = createEmailServiceImpl(validApiKey, validFromEmail);

			// Assert
			expect(emailService).toBeDefined();
			expect(emailService.send).toBeDefined();
			expect(emailService.sendVerificationEmail).toBeDefined();
			expect(emailService.sendPasswordResetEmail).toBeDefined();
		});
	});

	describe("send", () => {
		it("API 키가 없으면 EmailServiceNotConfiguredError를 던진다", async () => {
			// Arrange
			const { createEmailServiceImpl } = await import(
				"~/infrastructure/external/resend/email.service.impl"
			);
			const emailService = createEmailServiceImpl(undefined, validFromEmail);

			const options: SendEmailOptions = {
				to: "user@example.com",
				subject: "Test Subject",
				react: createElement("div", null, "Test Content"),
			};

			// Act & Assert
			await expect(emailService.send(options)).rejects.toThrow(
				EmailServiceNotConfiguredError,
			);
		});

		it("이메일 전송 성공 시 에러를 던지지 않는다", async () => {
			// Arrange
			mockSend.mockResolvedValue({ data: { id: "email-123" }, error: null });
			const { createEmailServiceImpl } = await import(
				"~/infrastructure/external/resend/email.service.impl"
			);
			const emailService = createEmailServiceImpl(validApiKey, validFromEmail);

			const options: SendEmailOptions = {
				to: "user@example.com",
				subject: "Test Subject",
				react: createElement("div", null, "Test Content"),
			};

			// Act & Assert
			await expect(emailService.send(options)).resolves.not.toThrow();
		});

		it("Resend API 에러 응답 시 EmailSendError를 던진다", async () => {
			// Arrange
			mockSend.mockResolvedValue({
				data: null,
				error: { message: "Invalid API key" },
			});
			const { createEmailServiceImpl } = await import(
				"~/infrastructure/external/resend/email.service.impl"
			);
			const emailService = createEmailServiceImpl(validApiKey, validFromEmail);

			const options: SendEmailOptions = {
				to: "user@example.com",
				subject: "Test Subject",
				react: createElement("div", null, "Test Content"),
			};

			// Act & Assert
			await expect(emailService.send(options)).rejects.toThrow(EmailSendError);
		});

		it("Resend API 예외 발생 시 EmailSendError를 던진다", async () => {
			// Arrange
			mockSend.mockRejectedValue(new Error("Network error"));
			const { createEmailServiceImpl } = await import(
				"~/infrastructure/external/resend/email.service.impl"
			);
			const emailService = createEmailServiceImpl(validApiKey, validFromEmail);

			const options: SendEmailOptions = {
				to: "user@example.com",
				subject: "Test Subject",
				react: createElement("div", null, "Test Content"),
			};

			// Act & Assert
			await expect(emailService.send(options)).rejects.toThrow(EmailSendError);
		});

		it("이미 EmailSendError인 예외는 그대로 전파한다", async () => {
			// Arrange
			const originalError = new EmailSendError("Original error");
			mockSend.mockRejectedValue(originalError);
			const { createEmailServiceImpl } = await import(
				"~/infrastructure/external/resend/email.service.impl"
			);
			const emailService = createEmailServiceImpl(validApiKey, validFromEmail);

			const options: SendEmailOptions = {
				to: "user@example.com",
				subject: "Test Subject",
				react: createElement("div", null, "Test Content"),
			};

			// Act & Assert
			await expect(emailService.send(options)).rejects.toThrow(originalError);
		});

		it("from이 지정되지 않으면 기본 fromEmail을 사용한다", async () => {
			// Arrange
			mockSend.mockResolvedValue({ data: { id: "email-123" }, error: null });
			const { createEmailServiceImpl } = await import(
				"~/infrastructure/external/resend/email.service.impl"
			);
			const emailService = createEmailServiceImpl(validApiKey, validFromEmail);

			const options: SendEmailOptions = {
				to: "user@example.com",
				subject: "Test Subject",
				react: createElement("div", null, "Test Content"),
			};

			// Act
			await emailService.send(options);

			// Assert
			expect(mockSend).toHaveBeenCalledWith(
				expect.objectContaining({
					from: validFromEmail,
				}),
			);
		});

		it("from이 지정되면 해당 값을 사용한다", async () => {
			// Arrange
			mockSend.mockResolvedValue({ data: { id: "email-123" }, error: null });
			const { createEmailServiceImpl } = await import(
				"~/infrastructure/external/resend/email.service.impl"
			);
			const emailService = createEmailServiceImpl(validApiKey, validFromEmail);

			const options: SendEmailOptions = {
				to: "user@example.com",
				subject: "Test Subject",
				react: createElement("div", null, "Test Content"),
				from: "custom@example.com",
			};

			// Act
			await emailService.send(options);

			// Assert
			expect(mockSend).toHaveBeenCalledWith(
				expect.objectContaining({
					from: "custom@example.com",
				}),
			);
		});

		it("fromEmail이 없으면 기본값을 사용한다", async () => {
			// Arrange
			mockSend.mockResolvedValue({ data: { id: "email-123" }, error: null });
			const { createEmailServiceImpl } = await import(
				"~/infrastructure/external/resend/email.service.impl"
			);
			const emailService = createEmailServiceImpl(validApiKey, undefined);

			const options: SendEmailOptions = {
				to: "user@example.com",
				subject: "Test Subject",
				react: createElement("div", null, "Test Content"),
			};

			// Act
			await emailService.send(options);

			// Assert
			expect(mockSend).toHaveBeenCalledWith(
				expect.objectContaining({
					from: "onboarding@resend.dev",
				}),
			);
		});

		it("알 수 없는 예외 발생 시 기본 EmailSendError를 던진다", async () => {
			// Arrange
			mockSend.mockRejectedValue("Unknown error");
			const { createEmailServiceImpl } = await import(
				"~/infrastructure/external/resend/email.service.impl"
			);
			const emailService = createEmailServiceImpl(validApiKey, validFromEmail);

			const options: SendEmailOptions = {
				to: "user@example.com",
				subject: "Test Subject",
				react: createElement("div", null, "Test Content"),
			};

			// Act & Assert
			await expect(emailService.send(options)).rejects.toThrow(EmailSendError);
		});
	});

	describe("sendVerificationEmail", () => {
		it("인증 이메일을 전송한다", async () => {
			// Arrange
			mockSend.mockResolvedValue({ data: { id: "email-123" }, error: null });
			const { createEmailServiceImpl } = await import(
				"~/infrastructure/external/resend/email.service.impl"
			);
			const emailService = createEmailServiceImpl(validApiKey, validFromEmail);

			// Act
			await emailService.sendVerificationEmail(
				"user@example.com",
				"https://example.com/verify?token=abc",
			);

			// Assert
			expect(mockSend).toHaveBeenCalledWith(
				expect.objectContaining({
					to: ["user@example.com"],
					subject: "이메일 인증을 완료해주세요",
				}),
			);
		});

		it("API 키가 없으면 EmailServiceNotConfiguredError를 던진다", async () => {
			// Arrange
			const { createEmailServiceImpl } = await import(
				"~/infrastructure/external/resend/email.service.impl"
			);
			const emailService = createEmailServiceImpl(undefined, validFromEmail);

			// Act & Assert
			await expect(
				emailService.sendVerificationEmail(
					"user@example.com",
					"https://example.com/verify",
				),
			).rejects.toThrow(EmailServiceNotConfiguredError);
		});
	});

	describe("sendPasswordResetEmail", () => {
		it("비밀번호 재설정 이메일을 전송한다", async () => {
			// Arrange
			mockSend.mockResolvedValue({ data: { id: "email-123" }, error: null });
			const { createEmailServiceImpl } = await import(
				"~/infrastructure/external/resend/email.service.impl"
			);
			const emailService = createEmailServiceImpl(validApiKey, validFromEmail);

			// Act
			await emailService.sendPasswordResetEmail(
				"user@example.com",
				"https://example.com/reset?token=xyz",
			);

			// Assert
			expect(mockSend).toHaveBeenCalledWith(
				expect.objectContaining({
					to: ["user@example.com"],
					subject: "비밀번호 재설정 요청",
				}),
			);
		});

		it("API 키가 없으면 EmailServiceNotConfiguredError를 던진다", async () => {
			// Arrange
			const { createEmailServiceImpl } = await import(
				"~/infrastructure/external/resend/email.service.impl"
			);
			const emailService = createEmailServiceImpl(undefined, validFromEmail);

			// Act & Assert
			await expect(
				emailService.sendPasswordResetEmail(
					"user@example.com",
					"https://example.com/reset",
				),
			).rejects.toThrow(EmailServiceNotConfiguredError);
		});
	});
});
