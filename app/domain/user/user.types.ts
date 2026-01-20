import type { IProfile, IUser } from "./user.entity";

/**
 * 사용자 생성 DTO
 */
export interface CreateUserDTO {
	name: string;
	email: string;
	password: string;
}

/**
 * 사용자 업데이트 DTO
 */
export interface UpdateUserDTO {
	name?: string;
	image?: string;
}

/**
 * 프로필 생성 DTO
 */
export interface CreateProfileDTO {
	userId: string;
	fullName?: string | null;
	avatarUrl?: string | null;
	bio?: string | null;
}

/**
 * 프로필 업데이트 DTO
 */
export interface UpdateProfileDTO {
	fullName?: string | null;
	avatarUrl?: string | null;
	bio?: string | null;
}

/**
 * DB에서 추론된 User 타입 (스키마와 호환)
 */
export type User = IUser;

/**
 * DB에서 추론된 Profile 타입 (스키마와 호환)
 */
export type Profile = IProfile;
