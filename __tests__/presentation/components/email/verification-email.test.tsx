import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@react-email/components";
import VerificationEmail from "~/presentation/components/email/verification-email";

describe("VerificationEmail", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("기본 렌더링", () => {
		it("이메일 인증 제목을 렌더링한다", async () => {
			// Arrange
			const verificationUrl = "https://example.com/verify?token=abc123";

			// Act
			const html = await render(
				<VerificationEmail verificationUrl={verificationUrl} />,
			);

			// Assert
			expect(html).toContain("이메일 인증");
		});

		it("미리보기 텍스트를 포함한다", async () => {
			// Arrange
			const verificationUrl = "https://example.com/verify?token=abc123";

			// Act
			const html = await render(
				<VerificationEmail verificationUrl={verificationUrl} />,
			);

			// Assert
			expect(html).toContain("이메일 인증을 완료해주세요");
		});

		it("안내 메시지를 렌더링한다", async () => {
			// Arrange
			const verificationUrl = "https://example.com/verify?token=abc123";

			// Act
			const html = await render(
				<VerificationEmail verificationUrl={verificationUrl} />,
			);

			// Assert
			expect(html).toContain("이메일 주소를 인증해주세요");
		});
	});

	describe("인증 URL", () => {
		it("인증 버튼의 href에 verificationUrl을 포함한다", async () => {
			// Arrange
			const verificationUrl = "https://example.com/verify?token=abc123";

			// Act
			const html = await render(
				<VerificationEmail verificationUrl={verificationUrl} />,
			);

			// Assert
			expect(html).toContain('href="https://example.com/verify?token=abc123"');
		});

		it("대체 링크 텍스트로 verificationUrl을 표시한다", async () => {
			// Arrange
			const verificationUrl = "https://example.com/verify?token=xyz789";

			// Act
			const html = await render(
				<VerificationEmail verificationUrl={verificationUrl} />,
			);

			// Assert
			expect(html).toContain("https://example.com/verify?token=xyz789");
		});

		it("이메일 인증하기 버튼 텍스트를 표시한다", async () => {
			// Arrange
			const verificationUrl = "https://example.com/verify";

			// Act
			const html = await render(
				<VerificationEmail verificationUrl={verificationUrl} />,
			);

			// Assert
			expect(html).toContain("이메일 인증하기");
		});
	});

	describe("푸터", () => {
		it("커스텀 푸터 메시지를 표시한다", async () => {
			// Arrange
			const verificationUrl = "https://example.com/verify";

			// Act
			const html = await render(
				<VerificationEmail verificationUrl={verificationUrl} />,
			);

			// Assert
			expect(html).toContain("회원가입을 요청하지 않으셨다면");
		});
	});
});
