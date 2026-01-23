import { z } from "zod";

import { baseEntitySchema } from "~/domain/shared";

/**
 * User 엔티티 스키마 (IUser에 대응)
 *
 * Better-auth의 user 객체 검증에 사용됩니다.
 */
export const userSchema = baseEntitySchema.extend({
	name: z.string(),
	email: z.string(),
	emailVerified: z.boolean(),
	image: z.string().nullable(),
});

/**
 * Profile 엔티티 스키마 (IProfile에 대응)
 *
 * 사용자 프로필 객체 검증에 사용됩니다.
 */
export const profileSchema = baseEntitySchema.extend({
	userId: z.string(),
	fullName: z.string().nullable(),
	avatarUrl: z.string().nullable(),
	bio: z.string().nullable(),
});

/**
 * User 검증 Type Guard (Zod 기반)
 *
 * @param data - 검증할 데이터
 * @returns data가 IUser 인터페이스를 만족하면 true
 */
export const isUser = (data: unknown): data is z.infer<typeof userSchema> => {
	return userSchema.safeParse(data).success;
};

/**
 * Profile 검증 Type Guard (Zod 기반)
 *
 * @param data - 검증할 데이터
 * @returns data가 IProfile 인터페이스를 만족하면 true
 */
export const isProfile = (
	data: unknown,
): data is z.infer<typeof profileSchema> => {
	return profileSchema.safeParse(data).success;
};

/**
 * 프로필 업데이트 폼 스키마
 *
 * settings/index.tsx에서 폼 검증에 사용됩니다.
 */
export const updateProfileSchema = z.object({
	fullName: z.string().min(1, "이름을 입력해주세요"),
	email: z.email("올바른 이메일 형식이 아닙니다"),
	bio: z.string().max(500, "자기소개는 500자 이내로 작성해주세요").optional(),
	language: z.enum(["ko", "en", "ja"]),
	notifications: z.boolean(),
});
