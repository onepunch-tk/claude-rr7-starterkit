import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { account, session, user, verification } from "./auth.schema";

export {
	user as userTable,
	session as sessionTable,
	account as accountTable,
	verification as verificationTable,
};

/**
 * 2FA 테이블 (Better-auth TOTP 플러그인)
 * TOTP 시크릿 및 백업 코드 저장
 */
export const twoFactorTable = pgTable("two_factor", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.unique()
		.references(() => user.id, { onDelete: "cascade" }),
	secret: text("secret").notNull(),
	backupCodes: text("backup_codes").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

/**
 * 프로필 테이블
 * Better-auth의 user 테이블과 연동하여 추가 정보 저장
 */
export const profilesTable = pgTable("profiles", {
	id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
	userId: text("user_id")
		.notNull()
		.unique()
		.references(() => user.id, { onDelete: "cascade" }),
	fullName: text("full_name"),
	avatarUrl: text("avatar_url"),
	bio: text("bio"),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

// 스키마에서 추론되는 타입들
// 향후 필요 시 주석 해제하여 사용
// export type User = typeof user.$inferSelect;
// export type NewUser = typeof user.$inferInsert;

// TwoFactor 테이블은 2FA 기능 구현 시 사용 예정
// TODO: 2FA 기능 구현 시 타입 export 활성화
export type TwoFactor = typeof twoFactorTable.$inferSelect;
export type NewTwoFactor = typeof twoFactorTable.$inferInsert;

export type Profile = typeof profilesTable.$inferSelect;
export type NewProfile = typeof profilesTable.$inferInsert;
