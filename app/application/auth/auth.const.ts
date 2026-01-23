/**
 * 인증 관련 상수
 */

// Better-auth 쿠키 접두사
export const COOKIE_PREFIX = "cc-rr7";

// Better-auth 세션 쿠키 이름들
export const SESSION_COOKIE_NAMES = [
	`${COOKIE_PREFIX}.session_token`,
	`${COOKIE_PREFIX}.session_data`,
] as const;
