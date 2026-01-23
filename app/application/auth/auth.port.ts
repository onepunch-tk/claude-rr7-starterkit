import type { IUser } from "~/domain/user";

/**
 * 로그인 결과 타입
 */
export interface SignInResult {
	setCookie: string | null;
}

/**
 * 회원가입 결과의 사용자 정보 타입
 *
 * 회원가입 직후에는 id를 알 수 없으므로 (이메일 인증 필요)
 * id 필드를 제외한 타입을 사용합니다.
 */
export type SignUpUser = Omit<IUser, "id"> & { id?: string };

/**
 * 회원가입 결과 타입
 */
export interface SignUpResult {
	user: SignUpUser;
}

/**
 * OAuth 로그인 결과 타입
 */
export interface OAuthSignInResult {
	redirectUrl: string;
	setCookies: string[];
}

/**
 * Auth Provider 인터페이스
 *
 * 인증 관련 외부 서비스 추상화입니다.
 * 구현체는 Infrastructure 레이어에서 Better-auth로 제공됩니다.
 */
export interface IAuthProvider {
	/**
	 * 현재 세션에서 사용자 정보 조회
	 */
	getSession(headers: Headers): Promise<{ user: IUser } | null>;

	/**
	 * 이메일/비밀번호 로그인
	 */
	signInWithCredentials(
		email: string,
		password: string,
		headers: Headers,
	): Promise<SignInResult>;

	/**
	 * 이메일/비밀번호 회원가입
	 */
	signUpWithCredentials(
		email: string,
		password: string,
		name: string,
		headers: Headers,
	): Promise<SignUpResult>;

	/**
	 * OAuth 로그인
	 */
	signInWithOAuth(
		provider: "github" | "google" | "kakao",
		callbackURL: string,
		headers: Headers,
	): Promise<OAuthSignInResult>;

	/**
	 * 로그아웃
	 */
	signOut(headers: Headers): Promise<void>;

	/**
	 * 비밀번호 변경
	 */
	changePassword(
		currentPassword: string,
		newPassword: string,
		revokeOtherSessions: boolean,
		headers: Headers,
	): Promise<void>;

	/**
	 * 비밀번호 재설정 요청
	 */
	requestPasswordReset(email: string, headers: Headers): Promise<void>;

	/**
	 * 비밀번호 재설정 실행
	 */
	resetPassword(
		newPassword: string,
		token: string,
		headers: Headers,
	): Promise<void>;
}
