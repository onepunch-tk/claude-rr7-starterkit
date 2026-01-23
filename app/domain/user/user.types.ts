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
