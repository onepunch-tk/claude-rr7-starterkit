import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@react-email/components";
import PasswordResetEmail from "~/presentation/components/email/password-reset-email";

describe("PasswordResetEmail", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("기본 렌더링", () => {
		it("비밀번호 재설정 제목을 렌더링한다", async () => {
			// Arrange
			const resetUrl = "https://example.com/reset?token=abc123";

			// Act
			const html = await render(<PasswordResetEmail resetUrl={resetUrl} />);

			// Assert
			expect(html).toContain("비밀번호 재설정");
		});

		it("미리보기 텍스트를 포함한다", async () => {
			// Arrange
			const resetUrl = "https://example.com/reset?token=abc123";

			// Act
			const html = await render(<PasswordResetEmail resetUrl={resetUrl} />);

			// Assert
			expect(html).toContain("비밀번호 재설정 요청");
		});

		it("안내 메시지를 렌더링한다", async () => {
			// Arrange
			const resetUrl = "https://example.com/reset?token=abc123";

			// Act
			const html = await render(<PasswordResetEmail resetUrl={resetUrl} />);

			// Assert
			expect(html).toContain("비밀번호 재설정을 요청하셨습니다");
		});
	});

	describe("리셋 URL", () => {
		it("리셋 버튼의 href에 resetUrl을 포함한다", async () => {
			// Arrange
			const resetUrl = "https://example.com/reset?token=abc123";

			// Act
			const html = await render(<PasswordResetEmail resetUrl={resetUrl} />);

			// Assert
			expect(html).toContain('href="https://example.com/reset?token=abc123"');
		});

		it("대체 링크 텍스트로 resetUrl을 표시한다", async () => {
			// Arrange
			const resetUrl = "https://example.com/reset?token=xyz789";

			// Act
			const html = await render(<PasswordResetEmail resetUrl={resetUrl} />);

			// Assert
			expect(html).toContain("https://example.com/reset?token=xyz789");
		});

		it("비밀번호 재설정하기 버튼 텍스트를 표시한다", async () => {
			// Arrange
			const resetUrl = "https://example.com/reset";

			// Act
			const html = await render(<PasswordResetEmail resetUrl={resetUrl} />);

			// Assert
			expect(html).toContain("비밀번호 재설정하기");
		});
	});

	describe("경고 메시지", () => {
		it("링크 유효 시간 경고를 표시한다", async () => {
			// Arrange
			const resetUrl = "https://example.com/reset";

			// Act
			const html = await render(<PasswordResetEmail resetUrl={resetUrl} />);

			// Assert
			expect(html).toContain("1시간 동안만 유효합니다");
		});

		it("중요 표시를 포함한다", async () => {
			// Arrange
			const resetUrl = "https://example.com/reset";

			// Act
			const html = await render(<PasswordResetEmail resetUrl={resetUrl} />);

			// Assert
			expect(html).toContain("중요:");
		});
	});

	describe("푸터", () => {
		it("보안 관련 푸터 메시지를 표시한다", async () => {
			// Arrange
			const resetUrl = "https://example.com/reset";

			// Act
			const html = await render(<PasswordResetEmail resetUrl={resetUrl} />);

			// Assert
			expect(html).toContain("계정 보안을 확인해주세요");
		});
	});
});
