import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { ActionFunctionArgs } from "react-router";
import { useFetcher } from "react-router";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
	type ChangePasswordFormData,
	changePasswordSchema,
} from "~/features/auth/types";
import { changePasswordWithCurrent } from "~/lib/auth.server";
import type { Route } from "./+types/security";

/**
 * 보안 설정 페이지
 */
export const meta: Route.MetaFunction = () => [
	{ title: "보안 설정 - Claude RR7 Starterkit" },
];

/**
 * 비밀번호 변경 액션
 */
export const action = async ({ request, context }: ActionFunctionArgs) => {
	if (request.method !== "POST") {
		throw new Response(JSON.stringify({ error: "POST 요청만 허용됩니다." }), {
			status: 405,
			headers: { "Content-Type": "application/json" },
		});
	}

	const formData = await request.formData();
	const currentPassword = formData.get("currentPassword") as string | null;
	const newPassword = formData.get("newPassword") as string | null;
	const newPasswordConfirm = formData.get("newPasswordConfirm") as string | null;

	// 검증
	const result = changePasswordSchema.safeParse({
		currentPassword,
		newPassword,
		newPasswordConfirm,
	});

	if (!result.success) {
		throw new Response(
			JSON.stringify({ error: "입력값이 올바르지 않습니다." }),
			{
				status: 400,
				headers: { "Content-Type": "application/json" },
			},
		);
	}

	try {
		await changePasswordWithCurrent({
			request,
			context,
			currentPassword: result.data.currentPassword,
			newPassword: result.data.newPassword,
			revokeOtherSessions: true,
		});

		return { success: true };
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "비밀번호 변경에 실패했습니다.";
		throw new Response(JSON.stringify({ error: errorMessage }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}
};

export default function SecuritySettings() {
	const fetcher = useFetcher<typeof action>();

	const form = useForm<ChangePasswordFormData>({
		resolver: zodResolver(changePasswordSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			newPasswordConfirm: "",
		},
	});

	const onSubmit = (data: ChangePasswordFormData) => {
		fetcher.submit(data, { method: "post" });
	};

	const isSubmitting = fetcher.state === "submitting";
	const success = fetcher.data?.success === true;
	const error = fetcher.data?.error;

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold">보안 설정</h1>
				<p className="text-muted-foreground">
					계정 보안을 강화하고 비밀번호를 관리하세요
				</p>
			</div>

			<div className="space-y-4">
				<div className="rounded-lg border bg-card p-6">
					<h2 className="text-xl font-semibold mb-4">비밀번호 변경</h2>

					{success && (
						<Alert className="mb-4">
							<AlertDescription>
								비밀번호가 성공적으로 변경되었습니다.
							</AlertDescription>
						</Alert>
					)}

					{error && (
						<Alert variant="destructive" className="mb-4">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="currentPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>현재 비밀번호</FormLabel>
										<FormControl>
											<Input type="password" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="newPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>새 비밀번호</FormLabel>
										<FormControl>
											<Input type="password" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="newPasswordConfirm"
								render={({ field }) => (
									<FormItem>
										<FormLabel>새 비밀번호 확인</FormLabel>
										<FormControl>
											<Input type="password" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? "변경 중..." : "비밀번호 변경"}
							</Button>
						</form>
					</Form>
				</div>

				<div className="rounded-lg border bg-card p-6">
					<h2 className="text-xl font-semibold">2단계 인증</h2>
					<p className="mt-2 text-muted-foreground">
						계정 보안을 강화하기 위해 2단계 인증을 활성화하세요.
					</p>
				</div>
			</div>
		</div>
	);
}
