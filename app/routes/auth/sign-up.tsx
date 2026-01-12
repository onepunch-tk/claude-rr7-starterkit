import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { ActionFunctionArgs } from "react-router";
import {
	Form,
	Link,
	redirect,
	useFetcher,
	useOutletContext,
} from "react-router";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import {
	Form as FormComponent,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import type { User } from "~/db/schema";
import { type SignupFormData, signupSchema } from "~/features/auth/types";
import { signUpWithCredentials } from "~/lib/auth.server";
import type { Route } from "./+types/sign-up";

/**
 * 회원가입 페이지
 *
 * - auth/layout.tsx의 getOptionalAuth로 user 정보를 이미 로드함
 * - useOutletContext로 user 정보 가져오기
 * - 로그인 상태: "이미 로그인됨" UI 표시 + 대시보드 이동 옵션
 * - 미로그인 상태: 회원가입 폼 표시
 * - 성공 시: /auth/signin?message=email-verification-sent로 리다이렉트
 */
export const meta: Route.MetaFunction = () => [
	{ title: "회원가입 - Claude RR7 Starterkit" },
];

/**
 * 서버 사이드 회원가입 처리
 *
 * useFetcher와 함께 작동하여 폼 제출을 처리
 */
export const action = async ({ request, context }: ActionFunctionArgs) => {
	if (request.method !== "POST") {
		throw new Response(JSON.stringify({ error: "POST 요청만 허용됩니다." }), {
			status: 405,
			headers: { "Content-Type": "application/json" },
		});
	}

	const formData = await request.formData();
	const name = formData.get("name") as string | null;
	const email = formData.get("email") as string | null;
	const password = formData.get("password") as string | null;

	// 폼 검증
	const result = signupSchema.safeParse({ name, email, password });
	if (!result.success) {
		throw new Response(JSON.stringify({ error: "입력값이 올바르지 않습니다." }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}

	try {
		// 서버 사이드 회원가입
		await signUpWithCredentials({
			request,
			context,
			name: result.data.name,
			email: result.data.email,
			password: result.data.password,
		});

		// 회원가입 성공 → 이메일 인증 메시지와 함께 로그인 페이지로 리다이렉트
		return redirect("/auth/signin?message=email-verification-sent");
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "회원가입에 실패했습니다.";
		throw new Response(JSON.stringify({ error: errorMessage }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}
};

export default function SignUp() {
	const { user } = useOutletContext<{ user: User | null }>();
	const fetcher = useFetcher<typeof action>();

	const form = useForm<SignupFormData>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	const isSubmitting = fetcher.state === "submitting";

	// 로그인 상태: "이미 로그인됨" UI 표시
	if (user) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle>이미 로그인되어 있습니다</CardTitle>
						<CardDescription>
							{user.name}님으로 로그인되어 있습니다.
						</CardDescription>
					</CardHeader>

					<CardContent>
						<Button asChild className="w-full">
							<Link to="/dashboard">대시보드로 이동</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	// 미로그인 상태: 회원가입 폼
	const onSubmit = (data: SignupFormData) => {
		fetcher.submit(data, { method: "post" });
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
			<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>회원가입</CardTitle>
				<CardDescription>
					새로운 계정을 만들어 서비스를 시작하세요
				</CardDescription>
			</CardHeader>

			<FormComponent {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardContent className="space-y-4">
						{/* 에러 메시지 */}
						{fetcher.data?.error && (
							<Alert variant="destructive">
								<AlertDescription>{fetcher.data.error}</AlertDescription>
							</Alert>
						)}

						{/* 이름 필드 */}
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>이름</FormLabel>
									<FormControl>
										<Input type="text" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* 이메일 필드 */}
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>이메일</FormLabel>
									<FormControl>
										<Input type="email" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* 비밀번호 필드 */}
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>비밀번호</FormLabel>
									<FormControl>
										<Input type="password" {...field} />
									</FormControl>
									<FormDescription>
										최소 8자 이상, 대소문자와 숫자를 포함해주세요
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* 회원가입 버튼 */}
						<Button type="submit" className="w-full" disabled={isSubmitting}>
							{isSubmitting ? "회원가입 중..." : "회원가입"}
						</Button>
					</CardContent>

					{/* 로그인 링크 */}
					<CardFooter className="flex justify-center">
						<p className="text-sm text-muted-foreground">
							이미 계정이 있으신가요?{" "}
							<Link to="/auth/signin" className="text-primary hover:underline">
								로그인
							</Link>
						</p>
					</CardFooter>
				</form>
			</FormComponent>
			</Card>
		</div>
	);
}
