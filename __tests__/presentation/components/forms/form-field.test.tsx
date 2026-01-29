import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import FormField from "~/presentation/components/forms/form-field";

describe("FormField", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("기본 렌더링", () => {
		it("레이블과 입력 필드를 렌더링한다", () => {
			// Arrange & Act
			render(<FormField name="email" label="이메일" />);

			// Assert
			expect(screen.getByLabelText("이메일")).toBeInTheDocument();
			expect(screen.getByRole("textbox")).toBeInTheDocument();
		});

		it("name 속성이 id와 name에 적용된다", () => {
			// Arrange & Act
			render(<FormField name="username" label="사용자명" />);

			// Assert
			const input = screen.getByRole("textbox");
			expect(input).toHaveAttribute("id", "username");
			expect(input).toHaveAttribute("name", "username");
		});

		it("label이 htmlFor로 연결된다", () => {
			// Arrange & Act
			render(<FormField name="password" label="비밀번호" type="password" />);

			// Assert
			const label = screen.getByText("비밀번호");
			expect(label).toHaveAttribute("for", "password");
		});
	});

	describe("필수 필드", () => {
		it("required가 true일 때 별표(*)를 표시한다", () => {
			// Arrange & Act
			render(<FormField name="email" label="이메일" required />);

			// Assert
			expect(screen.getByText("*")).toBeInTheDocument();
		});

		it("required가 false일 때 별표를 표시하지 않는다", () => {
			// Arrange & Act
			render(<FormField name="email" label="이메일" required={false} />);

			// Assert
			expect(screen.queryByText("*")).not.toBeInTheDocument();
		});

		it("required 속성이 input에 적용된다", () => {
			// Arrange & Act
			render(<FormField name="email" label="이메일" required />);

			// Assert
			expect(screen.getByRole("textbox")).toBeRequired();
		});
	});

	describe("에러 표시", () => {
		it("에러가 있을 때 에러 메시지를 표시한다", () => {
			// Arrange & Act
			render(
				<FormField
					name="email"
					label="이메일"
					errors={["유효한 이메일을 입력하세요."]}
				/>,
			);

			// Assert
			expect(screen.getByText("유효한 이메일을 입력하세요.")).toBeInTheDocument();
		});

		it("여러 에러가 있을 때 첫 번째 에러만 표시한다", () => {
			// Arrange & Act
			render(
				<FormField
					name="email"
					label="이메일"
					errors={["첫 번째 에러", "두 번째 에러"]}
				/>,
			);

			// Assert
			expect(screen.getByText("첫 번째 에러")).toBeInTheDocument();
			expect(screen.queryByText("두 번째 에러")).not.toBeInTheDocument();
		});

		it("빈 에러 배열일 때 에러를 표시하지 않는다", () => {
			// Arrange & Act
			render(<FormField name="email" label="이메일" errors={[]} />);

			// Assert
			expect(screen.queryByRole("alert")).not.toBeInTheDocument();
		});

		it("에러가 있을 때 레이블에 text-destructive 클래스가 적용된다", () => {
			// Arrange & Act
			render(
				<FormField
					name="email"
					label="이메일"
					errors={["에러 메시지"]}
				/>,
			);

			// Assert
			const label = screen.getByText("이메일");
			expect(label).toHaveClass("text-destructive");
		});
	});

	describe("접근성 속성", () => {
		it("에러가 있을 때 aria-invalid가 true이다", () => {
			// Arrange & Act
			render(
				<FormField
					name="email"
					label="이메일"
					errors={["에러 메시지"]}
				/>,
			);

			// Assert
			expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
		});

		it("에러가 없을 때 aria-invalid가 false이다", () => {
			// Arrange & Act
			render(<FormField name="email" label="이메일" />);

			// Assert
			// hasError가 false일 때 aria-invalid={false}는 DOM에서 "false" 문자열로 렌더링되지 않음
			// React는 boolean false를 속성에서 제거함
			const input = screen.getByRole("textbox");
			expect(input).not.toHaveAttribute("aria-invalid", "true");
		});

		it("에러가 있을 때 aria-describedby가 에러 id를 참조한다", () => {
			// Arrange & Act
			render(
				<FormField
					name="email"
					label="이메일"
					errors={["에러 메시지"]}
				/>,
			);

			// Assert
			const input = screen.getByRole("textbox");
			expect(input).toHaveAttribute("aria-describedby", "email-error");
		});

		it("설명이 있을 때 aria-describedby가 설명 id를 참조한다", () => {
			// Arrange & Act
			render(
				<FormField
					name="email"
					label="이메일"
					description="이메일 주소를 입력하세요"
				/>,
			);

			// Assert
			const input = screen.getByRole("textbox");
			expect(input).toHaveAttribute("aria-describedby", "email-description");
		});

		it("에러가 있으면 설명 대신 에러 id를 참조한다", () => {
			// Arrange & Act
			render(
				<FormField
					name="email"
					label="이메일"
					description="이메일 주소를 입력하세요"
					errors={["에러 메시지"]}
				/>,
			);

			// Assert
			const input = screen.getByRole("textbox");
			expect(input).toHaveAttribute("aria-describedby", "email-error");
		});
	});

	describe("설명 텍스트", () => {
		it("description이 있을 때 설명을 표시한다", () => {
			// Arrange & Act
			render(
				<FormField
					name="email"
					label="이메일"
					description="이메일 주소를 입력하세요"
				/>,
			);

			// Assert
			expect(screen.getByText("이메일 주소를 입력하세요")).toBeInTheDocument();
		});

		it("에러가 있을 때 설명을 숨긴다", () => {
			// Arrange & Act
			render(
				<FormField
					name="email"
					label="이메일"
					description="이메일 주소를 입력하세요"
					errors={["에러 메시지"]}
				/>,
			);

			// Assert
			expect(
				screen.queryByText("이메일 주소를 입력하세요"),
			).not.toBeInTheDocument();
		});
	});

	describe("추가 속성 전달", () => {
		it("type 속성을 전달한다", () => {
			// Arrange & Act
			render(<FormField name="password" label="비밀번호" type="password" />);

			// Assert
			expect(screen.getByLabelText("비밀번호")).toHaveAttribute(
				"type",
				"password",
			);
		});

		it("placeholder 속성을 전달한다", () => {
			// Arrange & Act
			render(
				<FormField
					name="email"
					label="이메일"
					placeholder="example@email.com"
				/>,
			);

			// Assert
			expect(
				screen.getByPlaceholderText("example@email.com"),
			).toBeInTheDocument();
		});

		it("className을 컨테이너에 적용한다", () => {
			// Arrange & Act
			const { container } = render(
				<FormField name="email" label="이메일" className="custom-class" />,
			);

			// Assert
			expect(container.firstChild).toHaveClass("custom-class");
		});
	});
});
