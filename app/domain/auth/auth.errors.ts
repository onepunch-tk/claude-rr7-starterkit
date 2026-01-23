/**
 * 인증 관련 기본 에러 추상 클래스
 *
 * 모든 인증 관련 에러의 기본 클래스입니다.
 * 직접 인스턴스화하지 않고 반드시 상속하여 사용해야 합니다.
 */
export abstract class AuthError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "AuthError";
	}
}

/**
 * 이메일 중복 에러
 *
 * 이미 등록된 이메일로 회원가입을 시도할 때 발생합니다.
 */
export class DuplicateEmailError extends AuthError {
	constructor(message = "이미 사용 중인 이메일입니다.") {
		super(message);
		this.name = "DuplicateEmailError";
	}
}

/**
 * 사용자 생성 실패 에러
 *
 * Better-auth를 통한 사용자 생성이 실패했을 때 발생합니다.
 */
export class UserCreationError extends AuthError {
	constructor(message = "사용자 생성에 실패했습니다.") {
		super(message);
		this.name = "UserCreationError";
	}
}

/**
 * 인증 실패 에러
 *
 * 잘못된 인증 정보로 로그인 시도 시 발생합니다.
 */
export class InvalidCredentialsError extends AuthError {
	constructor(message = "이메일 또는 비밀번호가 일치하지 않습니다.") {
		super(message);
		this.name = "InvalidCredentialsError";
	}
}

/**
 * 이메일 미인증 에러
 *
 * 이메일 인증이 완료되지 않은 사용자가 로그인 시도 시 발생합니다.
 */
export class EmailNotVerifiedError extends AuthError {
	constructor(message = "이메일 인증이 완료되지 않았습니다.") {
		super(message);
		this.name = "EmailNotVerifiedError";
	}
}

/**
 * 이메일 서비스 미설정 에러
 *
 * Resend API 키가 설정되지 않았을 때 발생합니다.
 */
export class EmailServiceNotConfiguredError extends AuthError {
	constructor(message = "이메일 서비스가 설정되지 않았습니다.") {
		super(message);
		this.name = "EmailServiceNotConfiguredError";
	}
}

/**
 * 이메일 전송 실패 에러
 *
 * Resend API를 통한 이메일 전송이 실패했을 때 발생합니다.
 */
export class EmailSendError extends AuthError {
	constructor(message = "이메일 전송에 실패했습니다.") {
		super(message);
		this.name = "EmailSendError";
	}
}
