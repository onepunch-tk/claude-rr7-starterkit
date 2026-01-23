/**
 * User 도메인 기본 에러 추상 클래스
 *
 * 모든 User 관련 에러의 기본 클래스입니다.
 * 직접 인스턴스화하지 않고 반드시 상속하여 사용해야 합니다.
 */
export abstract class UserError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "UserError";
	}
}

/**
 * 사용자를 찾을 수 없음 에러
 */
export class UserNotFoundError extends UserError {
	constructor(message = "사용자를 찾을 수 없습니다.") {
		super(message);
		this.name = "UserNotFoundError";
	}
}

/**
 * 프로필을 찾을 수 없음 에러
 */
export class ProfileNotFoundError extends UserError {
	constructor(message = "프로필을 찾을 수 없습니다.") {
		super(message);
		this.name = "ProfileNotFoundError";
	}
}

/**
 * 프로필 생성 실패 에러 (비치명적)
 *
 * 프로필 테이블 레코드 생성이 실패했을 때 발생합니다.
 * 이 에러는 비치명적이므로 로그만 남기고 회원가입은 성공으로 처리됩니다.
 */
export class ProfileCreationError extends UserError {
	constructor(message = "프로필 생성에 실패했습니다.") {
		super(message);
		this.name = "ProfileCreationError";
	}
}
