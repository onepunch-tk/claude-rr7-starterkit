import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { signOut } from "~/lib/auth.server";

/**
 * 로그아웃 라우트
 *
 * POST 요청만 받아서 로그아웃 처리
 */
export const action = async ({ request, context }: ActionFunctionArgs) => {
	// HTTP 메서드 검증 (POST만 허용)
	if (request.method !== "POST") {
		throw new Response("Method not allowed", { status: 405 });
	}

	try {
		await signOut({ request, context });
		return redirect("/");
	} catch (error) {
		console.error("로그아웃 실패:", error);
		// 실패해도 홈으로 리다이렉트 (세션이 이미 만료되었을 수 있음)
		return redirect("/");
	}
};
