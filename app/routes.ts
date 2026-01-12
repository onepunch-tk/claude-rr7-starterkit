import {
	index,
	layout,
	type RouteConfig,
	route,
} from "@react-router/dev/routes";

export default [
	// 리소스 라우트
	route("robots.txt", "routes/resources/robots.ts"),
	route("sitemap.xml", "routes/resources/sitemap.ts"),

	// Better-auth API 라우트 (catch-all)
	route("auth/api/*", "features/auth/api/$.tsx"),

	// 공개 페이지 (public.layout)
	layout("routes/layouts/public.layout.tsx", [
		index("routes/home/home.tsx"),

		// 인증 페이지 (모두 public.layout 직속)
		route("auth/signin", "routes/auth/sign-in.tsx"),
		route("auth/signup", "routes/auth/sign-up.tsx"),
		route("auth/forgot-password", "routes/auth/forgot-password.tsx"),
		route("auth/reset-password", "routes/auth/reset-password.tsx"),
	]),

	// 인증 필수 페이지 (private.layout)
	layout("routes/layouts/private.layout.tsx", [
		// 로그아웃 (인증 필수)
		route("auth/signout", "routes/auth/sign-out.tsx"),

		// 대시보드 (중첩 레이아웃)
		layout("routes/dashboard/layout.tsx", [
			index("routes/dashboard/index.tsx"),

			// 사용자 관리
			route("users", "routes/dashboard/users/index.tsx"),
			route("users/:id", "routes/dashboard/users/[id].tsx"),

			// 설정
			route("settings", "routes/dashboard/settings/index.tsx"),
			route("settings/profile", "routes/dashboard/settings/profile.tsx"),
			route("settings/security", "routes/dashboard/settings/security.tsx"),
		]),
	]),
] satisfies RouteConfig;
