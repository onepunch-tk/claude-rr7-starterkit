import type { BaseEntity } from "~/domain/shared/common.types";

/**
 * User 엔티티 인터페이스
 *
 * Better-auth의 user 테이블과 매핑되는 도메인 모델
 */
export interface IUser extends BaseEntity {
	name: string;
	email: string;
	emailVerified: boolean;
	image: string | null;
}

/**
 * Profile 엔티티 인터페이스
 *
 * 사용자의 추가 정보를 저장하는 프로필 도메인 모델
 * BaseEntity를 확장하여 일관된 구조를 유지합니다.
 */
export interface IProfile extends BaseEntity {
	userId: string;
	fullName: string | null;
	avatarUrl: string | null;
	bio: string | null;
}

/**
 * User와 Profile을 합친 전체 사용자 정보
 */
export interface IUserWithProfile extends IUser {
	profile: IProfile | null;
}
