import { z } from "zod";

/**
 * 기본 엔티티 스키마 (BaseEntity에 대응)
 *
 * 모든 엔티티 스키마의 기반이 됩니다.
 */
export const baseEntitySchema = z.object({
	id: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
});
