import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@react-email/components";
import EmailLayout, {
	emailStyles,
} from "~/presentation/components/email/email-layout";

describe("EmailLayout", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("기본 렌더링", () => {
		it("제목을 렌더링한다", async () => {
			// Arrange & Act
			const html = await render(
				<EmailLayout preview="미리보기" title="테스트 제목">
					<p>내용</p>
				</EmailLayout>,
			);

			// Assert
			expect(html).toContain("테스트 제목");
		});

		it("미리보기 텍스트를 렌더링한다", async () => {
			// Arrange & Act
			const html = await render(
				<EmailLayout preview="이메일 미리보기 텍스트" title="제목">
					<p>내용</p>
				</EmailLayout>,
			);

			// Assert
			expect(html).toContain("이메일 미리보기 텍스트");
		});

		it("children 내용을 렌더링한다", async () => {
			// Arrange & Act
			const html = await render(
				<EmailLayout preview="미리보기" title="제목">
					<p>테스트 내용입니다</p>
				</EmailLayout>,
			);

			// Assert
			expect(html).toContain("테스트 내용입니다");
		});
	});

	describe("푸터", () => {
		it("기본 푸터 텍스트를 렌더링한다", async () => {
			// Arrange & Act
			const html = await render(
				<EmailLayout preview="미리보기" title="제목">
					<p>내용</p>
				</EmailLayout>,
			);

			// Assert
			expect(html).toContain("이 이메일은 자동으로 발송되었습니다.");
		});

		it("커스텀 푸터 텍스트를 렌더링한다", async () => {
			// Arrange & Act
			const html = await render(
				<EmailLayout
					preview="미리보기"
					title="제목"
					footer="커스텀 푸터 메시지"
				>
					<p>내용</p>
				</EmailLayout>,
			);

			// Assert
			expect(html).toContain("커스텀 푸터 메시지");
		});
	});

	describe("emailStyles", () => {
		it("text 스타일이 정의되어 있다", () => {
			// Assert
			expect(emailStyles.text).toBeDefined();
			expect(emailStyles.text.color).toBe("#4a5568");
			expect(emailStyles.text.fontSize).toBe("16px");
		});

		it("button 스타일이 정의되어 있다", () => {
			// Assert
			expect(emailStyles.button).toBeDefined();
			expect(emailStyles.button.backgroundColor).toBe("#0070f3");
			expect(emailStyles.button.color).toBe("#ffffff");
		});

		it("warningBox 스타일이 정의되어 있다", () => {
			// Assert
			expect(emailStyles.warningBox).toBeDefined();
			expect(emailStyles.warningBox.backgroundColor).toBe("#fff5f5");
		});

		it("code 스타일이 정의되어 있다", () => {
			// Assert
			expect(emailStyles.code).toBeDefined();
			expect(emailStyles.code.wordBreak).toBe("break-all");
		});
	});
});
