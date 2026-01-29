import { describe, it, expect } from "vitest";
import { COOKIE_PREFIX, SESSION_COOKIE_NAMES } from "~/application/auth/auth.const";

/**
 * application/auth/auth.const.ts 유닛 테스트
 *
 * 테스트 대상:
 * - COOKIE_PREFIX: Better-auth 쿠키 접두사
 * - SESSION_COOKIE_NAMES: Better-auth 세션 쿠키 이름들
 */

describe("application/auth/auth.const", () => {
	describe("COOKIE_PREFIX", () => {
		it("올바른 쿠키 접두사 값을 가진다", () => {
			// Assert
			expect(COOKIE_PREFIX).toBe("cc-rr7");
		});

		it("문자열 타입이다", () => {
			// Assert
			expect(typeof COOKIE_PREFIX).toBe("string");
		});
	});

	describe("SESSION_COOKIE_NAMES", () => {
		it("session_token 쿠키 이름을 포함한다", () => {
			// Assert
			expect(SESSION_COOKIE_NAMES).toContain(`${COOKIE_PREFIX}.session_token`);
		});

		it("session_data 쿠키 이름을 포함한다", () => {
			// Assert
			expect(SESSION_COOKIE_NAMES).toContain(`${COOKIE_PREFIX}.session_data`);
		});

		it("2개의 쿠키 이름을 가진다", () => {
			// Assert
			expect(SESSION_COOKIE_NAMES).toHaveLength(2);
		});

		it("readonly 배열이다 (as const)", () => {
			// Assert - readonly 배열은 push 등의 메서드가 없음
			// TypeScript 레벨에서 검증되지만, 런타임에서는 배열 형태
			expect(Array.isArray(SESSION_COOKIE_NAMES)).toBe(true);
		});

		it("COOKIE_PREFIX를 접두사로 사용한다", () => {
			// Assert
			for (const cookieName of SESSION_COOKIE_NAMES) {
				expect(cookieName.startsWith(COOKIE_PREFIX)).toBe(true);
			}
		});
	});
});
