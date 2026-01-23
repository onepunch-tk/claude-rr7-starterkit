import type {
	IAuthProvider,
	OAuthSignInResult,
	SignInResult,
	SignUpResult,
} from "~/application/auth/auth.port";
import type { IUser } from "~/domain/user";
import { isUser } from "~/domain/user";
import type { BetterAuthInstance } from "./auth.config";

/**
 * Better-auth Provider 구현체
 *
 * IAuthProvider 인터페이스를 Better-auth로 구현합니다.
 */
export const createAuthProviderImpl = (
	auth: BetterAuthInstance,
): IAuthProvider => ({
	async getSession(headers: Headers): Promise<{ user: IUser } | null> {
		const session = await auth.api.getSession({ headers });

		if (!session?.user) {
			return null;
		}

		// Zod 기반 Type Guard를 사용하여 안전하게 변환
		if (!isUser(session.user)) {
			console.error(
				"Better-auth 세션의 user 객체가 IUser 인터페이스와 일치하지 않습니다:",
				session.user,
			);
			return null;
		}

		return { user: session.user };
	},

	async signInWithCredentials(
		email: string,
		password: string,
		headers: Headers,
	): Promise<SignInResult> {
		const { headers: responseHeaders } = await auth.api.signInEmail({
			body: { email, password },
			headers,
			returnHeaders: true,
		});

		const setCookie = responseHeaders?.get("set-cookie");

		return { setCookie };
	},

	async signUpWithCredentials(
		email: string,
		password: string,
		name: string,
		headers: Headers,
	): Promise<SignUpResult> {
		await auth.api.signUpEmail({
			body: { email, password, name },
			headers,
		});

		// Better-auth는 사용자 정보를 바로 반환하지 않으므로 세션에서 가져옵니다
		// 이 시점에서는 이메일 인증이 필요하므로 세션이 없을 수 있습니다
		// SignUpUser 타입은 id를 optional로 정의하여 이 케이스를 명시적으로 처리합니다
		return {
			user: {
				// id는 회원가입 직후에는 알 수 없음 (이메일 인증 후 세션에서 확인 가능)
				email,
				name,
				emailVerified: false,
				image: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		};
	},

	async signInWithOAuth(
		provider: "github" | "google" | "kakao",
		callbackURL: string,
		headers: Headers,
	): Promise<OAuthSignInResult> {
		const {
			headers: responseHeaders,
			response: { url },
		} = await auth.api.signInSocial({
			body: {
				provider,
				callbackURL,
			},
			headers,
			returnHeaders: true,
		});

		const setCookies: string[] = [];
		for (const cookie of responseHeaders.getSetCookie()) {
			setCookies.push(cookie);
		}

		return {
			redirectUrl: url ?? "",
			setCookies,
		};
	},

	async signOut(headers: Headers): Promise<void> {
		await auth.api.signOut({ headers });
	},

	async changePassword(
		currentPassword: string,
		newPassword: string,
		revokeOtherSessions: boolean,
		headers: Headers,
	): Promise<void> {
		await auth.api.changePassword({
			body: { currentPassword, newPassword, revokeOtherSessions },
			headers,
		});
	},

	async requestPasswordReset(email: string, headers: Headers): Promise<void> {
		await auth.api.requestPasswordReset({
			body: { email },
			headers,
		});
	},

	async resetPassword(
		newPassword: string,
		token: string,
		headers: Headers,
	): Promise<void> {
		await auth.api.resetPassword({
			body: { newPassword, token },
			headers,
		});
	},
});
