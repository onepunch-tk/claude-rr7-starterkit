import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";

// sonner toast 모킹
vi.mock("sonner", () => ({
	toast: {
		success: vi.fn(),
	},
}));

// 컴포넌트 import
const { default: Settings } = await import(
	"~/presentation/routes/settings/index"
);

// Settings 컴포넌트 래퍼 (타입 체크 우회)
const SettingsWrapper = ({
	actionData,
}: {
	actionData?: Record<string, unknown>;
}) => {
	// Route.ComponentProps를 완전히 구현하기 어려우므로
	// 필요한 actionData만 전달하는 간소화된 테스트
	const props = { actionData } as unknown as Parameters<typeof Settings>[0];
	return <Settings {...props} />;
};

describe("Settings", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("기본 렌더링", () => {
		it("설정 페이지를 렌더링한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/my/settings",
					Component: () => <SettingsWrapper actionData={undefined} />,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/my/settings"]} />);

			// Assert
			expect(
				await screen.findByRole("heading", { name: "설정" }),
			).toBeInTheDocument();
		});

		it("프로필 정보 카드를 표시한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/my/settings",
					Component: () => <SettingsWrapper actionData={undefined} />,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/my/settings"]} />);

			// Assert
			expect(await screen.findByText("프로필 정보")).toBeInTheDocument();
		});

		it("비밀번호 변경 카드를 표시한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/my/settings",
					Component: () => <SettingsWrapper actionData={undefined} />,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/my/settings"]} />);

			// Assert
			// "비밀번호 변경" 텍스트가 여러 번 나타남 (카드 제목, 버튼)
			const elements = await screen.findAllByText(/비밀번호 변경/i);
			expect(elements.length).toBeGreaterThan(0);
		});

		it("2단계 인증 카드를 표시한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/my/settings",
					Component: () => <SettingsWrapper actionData={undefined} />,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/my/settings"]} />);

			// Assert
			expect(await screen.findByText("2단계 인증")).toBeInTheDocument();
		});
	});

	describe("프로필 정보 폼", () => {
		it("이름 입력 필드를 표시한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/my/settings",
					Component: () => <SettingsWrapper actionData={undefined} />,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/my/settings"]} />);

			// Assert
			expect(await screen.findByLabelText(/이름/i)).toBeInTheDocument();
		});

		it("이메일 입력 필드를 표시한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/my/settings",
					Component: () => <SettingsWrapper actionData={undefined} />,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/my/settings"]} />);

			// Assert
			expect(await screen.findByLabelText(/이메일/i)).toBeInTheDocument();
		});

		it("자기소개 입력 필드를 표시한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/my/settings",
					Component: () => <SettingsWrapper actionData={undefined} />,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/my/settings"]} />);

			// Assert
			expect(await screen.findByLabelText(/자기소개/i)).toBeInTheDocument();
		});

		it("언어 선택을 표시한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/my/settings",
					Component: () => <SettingsWrapper actionData={undefined} />,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/my/settings"]} />);

			// Assert
			// Select 컴포넌트는 htmlFor로 연결되어 있지 않으므로 텍스트로 확인
			expect(await screen.findByText("언어")).toBeInTheDocument();
		});

		it("알림 수신 스위치를 표시한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/my/settings",
					Component: () => <SettingsWrapper actionData={undefined} />,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/my/settings"]} />);

			// Assert
			expect(await screen.findByText(/알림 수신/i)).toBeInTheDocument();
		});

		it("변경사항 저장 버튼을 표시한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/my/settings",
					Component: () => <SettingsWrapper actionData={undefined} />,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/my/settings"]} />);

			// Assert
			expect(
				await screen.findByRole("button", { name: /변경사항 저장/i }),
			).toBeInTheDocument();
		});
	});

	describe("비밀번호 변경 폼", () => {
		it("현재 비밀번호 입력 필드를 표시한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/my/settings",
					Component: () => <SettingsWrapper actionData={undefined} />,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/my/settings"]} />);

			// Assert
			expect(await screen.findByLabelText(/현재 비밀번호/i)).toBeInTheDocument();
		});

		it("새 비밀번호 입력 필드를 표시한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/my/settings",
					Component: () => <SettingsWrapper actionData={undefined} />,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/my/settings"]} />);

			// Assert
			// 페이지 로딩 대기 후 newPassword input 확인
			await screen.findAllByText(/비밀번호 변경/i);
			const newPasswordInput = document.querySelector('input[name="newPassword"]');
			expect(newPasswordInput).toBeInTheDocument();
		});

		it("새 비밀번호 확인 입력 필드를 표시한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/my/settings",
					Component: () => <SettingsWrapper actionData={undefined} />,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/my/settings"]} />);

			// Assert
			expect(
				await screen.findByLabelText(/새 비밀번호 확인/i),
			).toBeInTheDocument();
		});

		it("비밀번호 변경 버튼을 표시한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/my/settings",
					Component: () => <SettingsWrapper actionData={undefined} />,
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/my/settings"]} />);

			// Assert
			expect(
				await screen.findByRole("button", { name: /비밀번호 변경/i }),
			).toBeInTheDocument();
		});
	});

	describe("에러 상태", () => {
		it("프로필 에러 메시지를 표시한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/my/settings",
					Component: () => (
						<SettingsWrapper
							actionData={{ profileError: "프로필 업데이트에 실패했습니다." }}
						/>
					),
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/my/settings"]} />);

			// Assert
			expect(
				await screen.findByText(/프로필 업데이트에 실패했습니다/i),
			).toBeInTheDocument();
		});

		it("비밀번호 에러 메시지를 표시한다", async () => {
			// Arrange
			const RoutesStub = createRoutesStub([
				{
					path: "/my/settings",
					Component: () => (
						<SettingsWrapper
							actionData={{ passwordError: "비밀번호 변경에 실패했습니다." }}
						/>
					),
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/my/settings"]} />);

			// Assert
			expect(
				await screen.findByText(/비밀번호 변경에 실패했습니다/i),
			).toBeInTheDocument();
		});
	});
});
