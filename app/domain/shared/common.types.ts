/**
 * 공통 타입 정의
 *
 * 모든 도메인에서 공유하는 기본 타입들을 정의합니다.
 */

/**
 * 기본 엔티티 인터페이스
 *
 * 모든 엔티티가 구현해야 하는 기본 속성
 */
export interface BaseEntity {
	id: string;
	createdAt: Date;
	updatedAt: Date;
}
